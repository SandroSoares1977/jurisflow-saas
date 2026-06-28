import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, payment } = body;

    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      console.log(`[JurisFlow] Processando pagamento simulado: ${payment.id}`);
      
      // Teste local simplificado: Retorna sucesso direto para validar o fluxo do navegador
      return NextResponse.json({ 
        sucesso: true, 
        mensagem: "Webhook processado com sucesso no ecossistema!" 
      }, { status: 200 });
    }

    return NextResponse.json({ error: 'Evento não mapeado' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro interno', detalhes: error.message }, { status: 500 });
  }
}