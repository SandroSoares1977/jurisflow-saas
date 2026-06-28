import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-12345');

async function obterUsuarioAutenticado(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.sub as string;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const advogadoId = await obterUsuarioAutenticado(req);
  if (!advogadoId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const processos = await prisma.processo.findMany({
      where: { advogadoId },
      include: { cliente: true, financeiro: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(processos);
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const advogadoId = await obterUsuarioAutenticado(req);
  if (!advogadoId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  try {
    const body = await req.json();
    const { numero, titulo, valorCausa, porcentagem, clienteId } = body;

    if (!numero || !titulo || !valorCausa || !porcentagem || !clienteId) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const valorHonorarioEstimado = (valorCausa * porcentagem) / 100;

    const novoProcesso = await prisma.$transaction(async (tx) => {
      const processo = await tx.processo.create({
        data: { numero, titulo, valorCausa, porcentagem, advogadoId, clienteId, status: 'INICIAL' }
      });

      await tx.financeiro.create({
        data: {
          descricao: `Honorários Contratuais Estimados - Proc. ${numero}`,
          valor: valorHonorarioEstimado,
          tipo: 'ENTRADA',
          pago: false,
          dataVenc: new Date(new Date().setMonth(new Date().getMonth() + 12)),
          processoId: processo.id
        }
      });

      return tx.processo.findUnique({
        where: { id: processo.id },
        include: { cliente: true, financeiro: true }
      });
    });

    return NextResponse.json(novoProcesso, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar processo' }, { status: 500 });
  }
}