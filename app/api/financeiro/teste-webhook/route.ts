import { NextResponse } from 'next/server';

export async function GET() {
  // Retorna sucesso direto na tela para validar o fluxo do MVP
  return NextResponse.json({ 
    sucesso: true, 
    mensagem: 'Simulação de pagamento enviada com sucesso ao Webhook do JurisFlow!' 
  });
}