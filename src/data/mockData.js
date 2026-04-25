// ============ DASHBOARD ============
export const kpiData = {
  faturado: { value: 201000, label: 'R$ 201.000,00', sub: '6 projetos', color: '#185FA5' },
  recebido: { value: 117500, label: 'R$ 117.500,00', sub: 'Confirmado', color: '#0C447C' },
  aReceber: { value: 83500, label: 'R$ 83.500,00', sub: 'Pendente', color: '#EF9F27' },
  leads: { value: 5, label: '5', sub: 'No pipeline', color: '#0C447C' },
};

export const faturamentoData = [
  { mes: 'NOV', valor: 28000 },
  { mes: 'DEZ', valor: 45000 },
  { mes: 'JAN', valor: 12000 },
  { mes: 'FEV', valor: 51000 },
  { mes: 'MAR', valor: 38000 },
  { mes: 'ABR', valor: 201000 },
];

export const projetosRecentes = [
  { id: 1, nome: 'Loja Centro', cliente: 'Comercial Dias', valor: 22000, status: 'PENDENTE' },
  { id: 2, nome: 'Casa Silva', cliente: 'Fernando Silva', valor: 45000, status: 'PARCIAL' },
  { id: 3, nome: 'Interiores Lima', cliente: 'Paula Lima', valor: 12000, status: 'PARCIAL' },
  { id: 4, nome: 'Escritório Central', cliente: 'Grupo Emaer', valor: 38000, status: 'PAGO' },
  { id: 5, nome: 'Casa Ferreira', cliente: 'Ana Ferreira', valor: 51000, status: 'PAGO' },
];

// ============ TAREFAS ============
export const tarefasData = {
  'A Fazer': [
    { id: 1, titulo: 'Elaborar memorial descritivo', prioridade: 'ALTA', responsavel: 'Carlos M.', prazo: '28/04/2026' },
    { id: 2, titulo: 'Revisar orçamento Loja Centro', prioridade: 'MÉDIA', responsavel: 'Ana P.', prazo: '30/04/2026' },
    { id: 3, titulo: 'Contato com fornecedor estrutural', prioridade: 'BAIXA', responsavel: 'João S.', prazo: '05/05/2026' },
  ],
  'Em Andamento': [
    { id: 4, titulo: 'Projeto elétrico Casa Silva', prioridade: 'ALTA', responsavel: 'Marcos L.', prazo: '29/04/2026' },
    { id: 5, titulo: 'Compatibilização hidráulica', prioridade: 'MÉDIA', responsavel: 'Fernanda R.', prazo: '02/05/2026' },
  ],
  'Concluído': [
    { id: 6, titulo: 'ART registrada — Casa Ferreira', prioridade: 'ALTA', responsavel: 'Carlos M.', prazo: '20/04/2026' },
    { id: 7, titulo: 'Entrega projeto arquitetônico', prioridade: 'MÉDIA', responsavel: 'Ana P.', prazo: '18/04/2026' },
  ],
};

// ============ MENTORIA ============
export const mentoriaData = [
  { id: 1, dia: 3, mes: 4, ano: 2026, mentor: 'Dr. Roberto Alves', tema: 'Gestão de contratos EPC', anotacoes: 'Discutir cláusulas de reajuste INCC e responsabilidades técnicas.' },
  { id: 2, dia: 10, mes: 4, ano: 2026, mentor: 'Eng. Sílvia Costa', tema: 'BIM e coordenação de projetos', anotacoes: 'Implementação do LOD 300 na equipe.' },
  { id: 3, dia: 17, mes: 4, ano: 2026, mentor: 'Dr. Roberto Alves', tema: 'Precificação estratégica', anotacoes: 'Análise de benchmarking com concorrentes regionais.' },
  { id: 4, dia: 24, mes: 4, ano: 2026, mentor: 'Eng. Patrícia Nunes', tema: 'Liderança em engenharia', anotacoes: 'Técnicas de delegação e acompanhamento de metas.' },
  { id: 5, dia: 8, mes: 5, ano: 2026, mentor: 'Dr. Roberto Alves', tema: 'Expansão para novos mercados', anotacoes: 'Análise de oportunidades no segmento industrial.' },
];

// ============ PIPELINE PARCEIROS ============
export const pipelineParceirosData = {
  'Prospecção': [
    { id: 1, nome: 'Construtora Norte', tipo: 'Construtora', valorPotencial: 180000 },
    { id: 2, nome: 'Imobiliária Horizonte', tipo: 'Imobiliária', valorPotencial: 95000 },
  ],
  'Qualificação': [
    { id: 3, nome: 'Grupo SteelBuild', tipo: 'Fornecedor', valorPotencial: 240000 },
    { id: 4, nome: 'Arquiteta Camila Ramos', tipo: 'Profissional', valorPotencial: 60000 },
  ],
  'Proposta': [
    { id: 5, nome: 'Incorporadora Sul', tipo: 'Incorporadora', valorPotencial: 420000 },
  ],
  'Fechado': [
    { id: 6, nome: 'Comercial Dias', tipo: 'Comercial', valorPotencial: 150000 },
    { id: 7, nome: 'Grupo Emaer', tipo: 'Interno', valorPotencial: 380000 },
  ],
};

// ============ PARCEIROS ATIVOS ============
export const parceirosAtivosData = [
  { id: 1, nome: 'Comercial Dias', tipo: 'Comercial', comissao: 5, projetos: 2, status: 'ATIVO' },
  { id: 2, nome: 'Grupo Emaer', tipo: 'Interno', comissao: 0, projetos: 3, status: 'ATIVO' },
  { id: 3, nome: 'Incorporadora Sul', tipo: 'Incorporadora', comissao: 8, projetos: 1, status: 'ATIVO' },
  { id: 4, nome: 'Construtora Norte', tipo: 'Construtora', comissao: 6, projetos: 0, status: 'INATIVO' },
  { id: 5, nome: 'Arq. Camila Ramos', tipo: 'Profissional', comissao: 10, projetos: 1, status: 'ATIVO' },
  { id: 6, nome: 'Imobiliária Horizonte', tipo: 'Imobiliária', comissao: 7, projetos: 0, status: 'INATIVO' },
];

// ============ PIPELINE PROJETOS ============
export const pipelineProjetosData = {
  'Prospecção': [
    { id: 1, nome: 'Galpão Industrial Norte', cliente: 'Metais S.A.', valor: 320000 },
    { id: 2, nome: 'Condomínio Jardins', cliente: 'Primus Incorporações', valor: 890000 },
  ],
  'Proposta Enviada': [
    { id: 3, nome: 'Ampliação Fábrica Rio', cliente: 'Rio Plásticos Ltda', valor: 215000 },
    { id: 4, nome: 'Centro Comercial Bela Vista', cliente: 'Bela Vista Empreendimentos', valor: 540000 },
  ],
  'Negociação': [
    { id: 5, nome: 'Residencial Park Sul', cliente: 'Construtora Sul', valor: 760000 },
  ],
  'Contrato Assinado': [
    { id: 6, nome: 'Escritório Central', cliente: 'Grupo Emaer', valor: 38000 },
    { id: 7, nome: 'Casa Ferreira', cliente: 'Ana Ferreira', valor: 51000 },
  ],
};

// ============ FLUXO DE CAIXA ============
export const fluxoCaixaData = [
  { id: 1, data: '02/04/2026', descricao: 'Recebimento Casa Ferreira — Parcela 1', tipo: 'ENTRADA', valor: 25500, saldo: 25500 },
  { id: 2, data: '05/04/2026', descricao: 'Pagamento equipe técnica', tipo: 'SAÍDA', valor: 18000, saldo: 7500 },
  { id: 3, data: '08/04/2026', descricao: 'Recebimento Escritório Central — Final', tipo: 'ENTRADA', valor: 38000, saldo: 45500 },
  { id: 4, data: '10/04/2026', descricao: 'Aluguel escritório', tipo: 'SAÍDA', valor: 4200, saldo: 41300 },
  { id: 5, data: '15/04/2026', descricao: 'Recebimento Casa Silva — Parcela 2', tipo: 'ENTRADA', valor: 22500, saldo: 63800 },
  { id: 6, data: '18/04/2026', descricao: 'Software e licenças', tipo: 'SAÍDA', valor: 2800, saldo: 61000 },
  { id: 7, data: '20/04/2026', descricao: 'Recebimento Parceiros — Comissão', tipo: 'ENTRADA', valor: 9000, saldo: 70000 },
  { id: 8, data: '22/04/2026', descricao: 'Materiais de escritório', tipo: 'SAÍDA', valor: 650, saldo: 69350 },
  { id: 9, data: '25/04/2026', descricao: 'Recebimento Interiores Lima', tipo: 'ENTRADA', valor: 12000, saldo: 81350 },
];

export const fluxoMensalData = [
  { mes: 'NOV', entradas: 32000, saidas: 18000 },
  { mes: 'DEZ', entradas: 48000, saidas: 22000 },
  { mes: 'JAN', entradas: 15000, saidas: 19000 },
  { mes: 'FEV', entradas: 55000, saidas: 24000 },
  { mes: 'MAR', entradas: 42000, saidas: 20000 },
  { mes: 'ABR', entradas: 107000, saidas: 25650 },
];

// ============ CARTEIRA PROJETOS ============
export const carteiraProjetosData = [
  { id: 1, nome: 'Loja Centro', cliente: 'Comercial Dias', valor: 22000, progresso: 35, status: 'PENDENTE' },
  { id: 2, nome: 'Casa Silva', cliente: 'Fernando Silva', valor: 45000, progresso: 60, status: 'PARCIAL' },
  { id: 3, nome: 'Interiores Lima', cliente: 'Paula Lima', valor: 12000, progresso: 80, status: 'PARCIAL' },
  { id: 4, nome: 'Escritório Central', cliente: 'Grupo Emaer', valor: 38000, progresso: 100, status: 'PAGO' },
  { id: 5, nome: 'Casa Ferreira', cliente: 'Ana Ferreira', valor: 51000, progresso: 100, status: 'PAGO' },
  { id: 6, nome: 'Galpão Norte', cliente: 'Metais S.A.', valor: 320000, progresso: 15, status: 'EM ANDAMENTO' },
];

// ============ CARTEIRA CLIENTES ============
export const carteiraClientesData = [
  { id: 1, nome: 'Fernando Silva', totalFaturado: 45000, projetos: 1, ultimoContato: '18/04/2026', status: 'ATIVO' },
  { id: 2, nome: 'Ana Ferreira', totalFaturado: 51000, projetos: 1, ultimoContato: '22/04/2026', status: 'ATIVO' },
  { id: 3, nome: 'Grupo Emaer', totalFaturado: 38000, projetos: 2, ultimoContato: '25/04/2026', status: 'ATIVO' },
  { id: 4, nome: 'Comercial Dias', totalFaturado: 22000, projetos: 1, ultimoContato: '15/04/2026', status: 'ATIVO' },
  { id: 5, nome: 'Paula Lima', totalFaturado: 12000, projetos: 1, ultimoContato: '10/04/2026', status: 'ATIVO' },
  { id: 6, nome: 'Metais S.A.', totalFaturado: 0, projetos: 1, ultimoContato: '20/04/2026', status: 'EM NEGOCIAÇÃO' },
  { id: 7, nome: 'Primus Incorporações', totalFaturado: 0, projetos: 0, ultimoContato: '05/04/2026', status: 'PROSPECT' },
];

// ============ FUNIL DE VENDAS ============
export const funilVendasData = [
  { estagio: 'Leads', quantidade: 24, valor: 1850000, conversao: 100 },
  { estagio: 'Qualificados', quantidade: 14, valor: 1240000, conversao: 58 },
  { estagio: 'Proposta', quantidade: 8, valor: 890000, conversao: 33 },
  { estagio: 'Negociação', quantidade: 4, valor: 540000, conversao: 17 },
  { estagio: 'Fechado', quantidade: 2, valor: 201000, conversao: 8 },
];

// ============ FUNIL MARKETING ============
export const funilMarketingData = [
  { canal: 'Google Ads', impressoes: 48200, cliques: 1840, leads: 32, custoPorLead: 121 },
  { canal: 'Instagram', impressoes: 92400, cliques: 2180, leads: 18, custoPorLead: 89 },
  { canal: 'LinkedIn', impressoes: 15600, cliques: 840, leads: 12, custoPorLead: 210 },
  { canal: 'Indicações', impressoes: 0, cliques: 0, leads: 28, custoPorLead: 0 },
  { canal: 'Site Orgânico', impressoes: 31000, cliques: 980, leads: 8, custoPorLead: 0 },
];

export const funilMarketingBarData = [
  { canal: 'Google', leads: 32 },
  { canal: 'Instagram', leads: 18 },
  { canal: 'LinkedIn', leads: 12 },
  { canal: 'Indicações', leads: 28 },
  { canal: 'Orgânico', leads: 8 },
];

// ============ INDICADORES ============
export const ticketMedioData = [
  { mes: 'NOV', valor: 28000 },
  { mes: 'DEZ', valor: 45000 },
  { mes: 'JAN', valor: 12000 },
  { mes: 'FEV', valor: 51000 },
  { mes: 'MAR', valor: 38000 },
  { mes: 'ABR', valor: 40200 },
];

export const receitaRecorrenteData = [
  { mes: 'NOV', receita: 18000 },
  { mes: 'DEZ', receita: 22000 },
  { mes: 'JAN', receita: 9000 },
  { mes: 'FEV', receita: 28000 },
  { mes: 'MAR', receita: 24000 },
  { mes: 'ABR', receita: 35000 },
];

// ============ REDES SOCIAIS ============
export const redesSociaisData = {
  seguidores: [
    { mes: 'NOV', instagram: 1200, linkedin: 450, facebook: 800 },
    { mes: 'DEZ', instagram: 1500, linkedin: 520, facebook: 850 },
    { mes: 'JAN', instagram: 1800, linkedin: 600, facebook: 900 },
    { mes: 'FEV', instagram: 2200, linkedin: 750, facebook: 1100 },
    { mes: 'MAR', instagram: 2800, linkedin: 900, facebook: 1300 },
    { mes: 'ABR', instagram: 3500, linkedin: 1200, facebook: 1500 },
  ],
  postsHoje: [
    { id: 1, rede: 'Instagram', tipo: 'Reels', engajamento: '8.5%', alcance: '12.4k' },
    { id: 2, rede: 'LinkedIn', tipo: 'Artigo', engajamento: '4.2%', alcance: '3.1k' },
    { id: 3, rede: 'Facebook', tipo: 'Imagem', engajamento: '2.1%', alcance: '5.2k' },
  ]
};

export const npsData = [
  { categoria: 'Promotores (9-10)', valor: 62 },
  { categoria: 'Neutros (7-8)', valor: 28 },
  { categoria: 'Detratores (0-6)', valor: 10 },
];
