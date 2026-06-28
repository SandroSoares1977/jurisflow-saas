'use client';

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, DollarSign, FileText, Menu, X, 
  TrendingUp, CheckCircle, Clock, Search, 
  Filter, ArrowUpRight, ArrowDownRight, Sparkles 
} from 'lucide-react';

interface Processo {
  id: string;
  numero: string;
  titulo: string;
  status: string;
  valorCausa: number;
  porcentagem: number;
  cliente: { nome: string };
  financeiro: Array<{ id: string; descricao: string; valor: number; tipo: string; pago: boolean; dataVenc: string }>;
}

export default function Dashboard() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'processos' | 'financeiro' | 'peticoes'>('processos');
  
  const [filtroFinanceiro, setFiltroFinanceiro] = useState<'TODOS' | 'RECEBIDOS' | 'PENDENTES'>('TODOS');
  const [pesquisaPeticao, setPesquisaPeticao] = useState('');

  useEffect(() => {
    const dadosDoBanco = [
      {
        id: '1',
        numero: '0012345-67.2026.8.26.0000',
        titulo: 'Ação Trabalhista - Revisional de Verbas',
        status: 'INSTRUCAO',
        valorCausa: 50000,
        porcentagem: 30,
        cliente: { nome: 'Carlos Silva Mota' },
        financeiro: [
          { id: 'f1', descricao: 'Honorários Iniciais Pro-Labore', valor: 2500, tipo: 'ENTRADA', pago: true, dataVenc: '2026-01-15' },
          { id: 'f2', descricao: 'Êxito Estimado - Sentença Próxima', valor: 15000, tipo: 'ENTRADA', pago: false, dataVenc: '2026-12-20' }
        ]
      },
      {
        id: '2',
        numero: '0098765-43.2026.5.15.0000',
        titulo: 'Indenização por Danos Morais (Acidente)',
        status: 'CONCLUIDO',
        valorCausa: 20000,
        porcentagem: 20,
        cliente: { nome: 'Maria Oliveira Souza' },
        financeiro: [
          { id: 'pay_00123456789', descricao: 'Honorários Contratuais Sucesso', valor: 4000, tipo: 'ENTRADA', pago: true, dataVenc: '2026-06-10' }
        ]
      },
      {
        id: '3',
        numero: '0045612-88.2026.8.26.0002',
        titulo: 'Ação de Alimentos - Revisional',
        status: 'INICIAL',
        valorCausa: 12000,
        porcentagem: 15,
        cliente: { nome: 'Roberto Albuquerque' },
        financeiro: [
          { id: 'f3', descricao: 'Taxa de Ajuizamento Inicial', valor: 1800, tipo: 'ENTRADA', pago: false, dataVenc: '2026-07-05' }
        ]
      }
    ];
    setProcessos(dadosDoBanco);
  }, []);

  const faturamentoTotal = processos.reduce((acc, p) => acc + (p.valorCausa * p.porcentagem / 100), 0);
  const honorariosRecebidos = processos.reduce((acc, p) => {
    return acc + p.financeiro.filter(f => f.pago).reduce((sum, f) => sum + f.valor, 0);
  }, 0);

  const todosLancamentos = processos.flatMap(p => 
    p.financeiro.map(f => ({ ...f, cliente: p.cliente.nome, tituloProcesso: p.titulo }))
  );

  const lancamentosFiltrados = todosLancamentos.filter(l => {
    if (filtroFinanceiro === 'RECEBIDOS') return l.pago;
    if (filtroFinanceiro === 'PENDENTES') return !l.pago;
    return true;
  });

  const modelosPeticoes = [
    { id: 'p1', tipo: 'Inicial', nome: 'Ação de Indenização por Danos Morais', ramo: 'Cível', tags: ['Consumidor', 'Acidente'] },
    { id: 'p2', tipo: 'Inicial', nome: 'Reclamação Trabalhista - Rito Ordinário', ramo: 'Trabalhista', tags: ['Verbas Rescisórias', 'Horas Extras'] },
    { id: 'p3', tipo: 'Recurso', nome: 'Recurso Ordinário Constitucional', ramo: 'Trabalhista', tags: ['Tribunal', 'Segunda Instância'] },
    { id: 'p4', tipo: 'Peça', nome: 'Contestação com Preliminares', ramo: 'Cível', tags: ['Defesa', 'Inépcia'] },
  ].filter(p => p.nome.toLowerCase().includes(pesquisaPeticao.toLowerCase()) || p.ramo.toLowerCase().includes(pesquisaPeticao.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans">
      
      {/* HEADER MOBILE */}
      <header className="bg-slate-900 text-white p-4 flex justify-between items-center md:hidden border-b border-slate-800">
        <h1 className="text-xl font-black tracking-wider text-blue-400">JurisFlow</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* SIDEBAR CORPORATIVA */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-white p-6 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col justify-between border-r border-slate-800`}>
        <div>
          <div className="flex items-center space-x-2 mb-8 hidden md:flex">
            <div className="bg-blue-600 p-2 rounded-lg text-white"><Briefcase size={20} /></div>
            <h2 className="text-2xl font-black text-white tracking-tight">Juris<span className="text-blue-500">Flow</span></h2>
          </div>
          
          <nav className="space-y-1.5">
            <button 
              type="button"
              onClick={() => { setAbaAtiva('processos'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium text-sm transition ${abaAtiva === 'processos' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
            >
              <Briefcase size={18} /> <span>Painel de Processos</span>
            </button>
            <button 
              type="button"
              onClick={() => { setAbaAtiva('financeiro'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium text-sm transition ${abaAtiva === 'financeiro' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
            >
              <DollarSign size={18} /> <span>Fluxo de Caixa / Asaas</span>
            </button>
            <button 
              type="button"
              onClick={() => { setAbaAtiva('peticoes'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium text-sm transition ${abaAtiva === 'peticoes' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
            >
              <FileText size={18} /> <span>Minutas & IA</span>
            </button>
          </nav>
        </div>
        <div className="text-xs text-slate-500 border-t border-slate-900 pt-4 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>Ambiente Legal: Dr. Sandro S.</span>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL CONFIGURÁVEL */}
      <main className="flex-1 p-5 md:p-8 overflow-y-auto">
        
        {/* CARDS METRICOS INTEGRADOS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Carteira Ativa</p>
              <h3 className="text-3xl font-black mt-1 text-slate-800">{processos.length} Casos</h3>
            </div>
            <div className="bg-blue-50 p-3.5 rounded-xl text-blue-600"><Briefcase size={22} /></div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Honorários Contratuais</p>
              <h3 className="text-3xl font-black mt-1 text-amber-600">R$ {faturamentoTotal.toLocaleString('pt-BR')}</h3>
            </div>
            <div className="bg-amber-50 p-3.5 rounded-xl text-amber-600"><TrendingUp size={22} /></div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Custodiado (Liquidado)</p>
              <h3 className="text-3xl font-black mt-1 text-emerald-600">R$ {honorariosRecebidos.toLocaleString('pt-BR')}</h3>
            </div>
            <div className="bg-emerald-50 p-3.5 rounded-xl text-emerald-600"><DollarSign size={22} /></div>
          </div>
        </section>

        {abaAtiva === 'processos' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-6 border-b border-slate-100"><h4 className="font-bold text-xl text-slate-800 tracking-tight">Distribuição da Carteira Jurídica</h4></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase">
                    <th className="p-4">Ação / Distribuição</th>
                    <th className="p-4">Cliente Assistido</th>
                    <th className="p-4">Fase Processual</th>
                    <th className="p-4">Valor Estimado Exito</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {processos.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <span className="font-semibold text-slate-900 block">{p.titulo}</span>
                        <span className="text-xs text-slate-400 font-mono block mt-0.5">{p.numero}</span>
                      </td>
                      <td className="p-4 font-medium text-slate-700">{p.cliente.nome}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.status === 'CONCLUIDO' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>{p.status}</span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">R$ {((p.valorCausa * p.porcentagem) / 100).toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {abaAtiva === 'financeiro' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center space-x-2 text-slate-700 font-bold text-sm"><Filter size={16} /> <span>Filtrar Repasses:</span></div>
              <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
                {(['TODOS', 'RECEBIDOS', 'PENDENTES'] as const).map((tipo) => (
                  <button 
                    key={tipo}
                    type="button"
                    onClick={() => setFiltroFinanceiro(tipo)}
                    className={`flex-1 sm:flex-initial text-xs font-bold px-4 py-1.5 rounded-md transition ${filtroFinanceiro === tipo ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase">
                      <th className="p-4">Origem do Lançamento</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Valor Bruto</th>
                      <th className="p-4">Conciliação Bancária</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {lancamentosFiltrados.map((l, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <span className="font-semibold text-slate-900 block">{l.descricao}</span>
                          <span className="text-xs text-slate-400 block mt-0.5">{l.tituloProcesso}</span>
                        </td>
                        <td className="p-4 text-slate-600 font-medium">{l.cliente}</td>
                        <td className="p-4 font-bold text-slate-900 flex items-center space-x-1">
                          {l.pago ? <ArrowUpRight size={16} className="text-emerald-500" /> : <ArrowDownRight size={16} className="text-amber-500" />}
                          <span>R$ {l.valor.toLocaleString('pt-BR')}</span>
                        </td>
                        <td className="p-4">
                          {l.pago ? (
                            <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold"><CheckCircle size={14} /> <span>Liquidado via Asaas</span></span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold"><Clock size={14} /> <span>Aguardando Compensação</span></span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'peticoes' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/80 flex items-center space-x-3">
              <Search className="text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Buscar minutas por ramo do direito..."
                value={pesquisaPeticao}
                onChange={(e) => setPesquisaPeticao(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modelosPeticoes.map((peti) => (
                <div key={peti.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:border-blue-500 transition-all group flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-wider">{peti.tipo}</span>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{peti.ramo}</span>
                    </div>
                    <h5 className="font-bold text-slate-800 text-base mt-3 group-hover:text-blue-600 transition">{peti.nome}</h5>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {peti.tags.map((t, i) => (
                        <span key={i} className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded">#{t}</span>
                      ))}
                    </div>
                  </div>
                  
                  <button type="button" className="w-full bg-slate-900 text-white group-hover:bg-blue-600 py-2.5 px-4 rounded-xl font-medium text-xs flex items-center justify-center space-x-2 transition shadow-sm">
                    <Sparkles size={14} /> <span>Gerar Minuta com IA</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}