import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Tarefas from './components/Tarefas';
import Mentoria from './components/Mentoria';
import PipelineParceiros from './components/PipelineParceiros';
import ParceirosAtivos from './components/ParceirosAtivos';
import PipelineProjetos from './components/PipelineProjetos';
import Precificacao from './components/Precificacao';
import FluxoCaixa from './components/FluxoCaixa';
import CarteiraProjetos from './components/CarteiraProjetos';
import CarteiraClientes from './components/CarteiraClientes';
import FunilVendas from './components/FunilVendas';
import FunilMarketing from './components/FunilMarketing';
import RedesSociais from './components/RedesSociais';
import Indicadores from './components/Indicadores';

const pageConfig = {
  'dashboard':           { title: 'Dashboard',          sub: 'Visão geral do sistema',              showNewProject: true  },
  'tarefas':             { title: 'Tarefas',             sub: 'Gestão de atividades da equipe',      showNewProject: false },
  'mentoria':            { title: 'Mentoria',            sub: 'Agenda e sessões de mentoria',        showNewProject: false },
  'pipeline-parceiros':  { title: 'Pipeline Parceiros',  sub: 'Gestão do funil de parceiros',        showNewProject: false },
  'parceiros-ativos':    { title: 'Parceiros Ativos',    sub: 'Parceiros e comissões',               showNewProject: false },
  'pipeline-projetos':   { title: 'Pipeline Projetos',   sub: 'Projetos por fase comercial',         showNewProject: true  },
  'precificacao':        { title: 'Precificação',        sub: 'Calculadora de propostas técnicas',   showNewProject: false },
  'fluxo-caixa':         { title: 'Fluxo de Caixa',      sub: 'Entradas, saídas e saldo atual',      showNewProject: false },
  'carteira-projetos':   { title: 'Carteira Projetos',   sub: 'Todos os projetos em andamento',      showNewProject: true  },
  'carteira-clientes':   { title: 'Carteira Clientes',   sub: 'Base de clientes e relacionamentos',  showNewProject: false },
  'funil-vendas':        { title: 'Funil de Vendas',     sub: 'Estágios e taxa de conversão',        showNewProject: false },
  'funil-marketing':     { title: 'Funil Marketing',     sub: 'Canais, leads e custo de aquisição',  showNewProject: false },
  'redes-sociais':       { title: 'Redes Sociais',       sub: 'Engajamento e crescimento digital',   showNewProject: false },
  'indicadores':         { title: 'Indicadores',         sub: 'KPIs e métricas estratégicas',        showNewProject: false },
};

const pageComponents = {
  'dashboard':          Dashboard,
  'tarefas':            Tarefas,
  'mentoria':           Mentoria,
  'pipeline-parceiros': PipelineParceiros,
  'parceiros-ativos':   ParceirosAtivos,
  'pipeline-projetos':  PipelineProjetos,
  'precificacao':       Precificacao,
  'fluxo-caixa':        FluxoCaixa,
  'carteira-projetos':  CarteiraProjetos,
  'carteira-clientes':  CarteiraClientes,
  'funil-vendas':       FunilVendas,
  'funil-marketing':    FunilMarketing,
  'redes-sociais':      RedesSociais,
  'indicadores':        Indicadores,
};

import { pipelineProjetosData } from './data/mockData';

const initialParceirosData = {
  'PROSPECÇÃO': [
    { id: 1, nome: 'Igor Cabral', profissao: 'Arquiteto', instagram: '@igorcabral', local: 'Recife/PE', proximaAcao: 'Entrar em contato', dataAcao: '2026-04-28' },
    { id: 2, nome: 'Pedro Silva', profissao: 'Engenheiro', instagram: '@pedro.eng', local: 'Olinda/PE', proximaAcao: 'Enviar proposta', dataAcao: '2026-04-29' },
  ],
  'CONTATADO': [
    { id: 3, nome: 'Manuela arq', profissao: 'Arquiteto', instagram: '@manuela.arq', local: 'Jaboatão/PE', proximaAcao: 'Agendar reunião', dataAcao: '2026-04-30' },
  ],
  'REUNIÃO': [],
  'PARCERIA FIRMADA': [],
  'INATIVO': [],
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [pageKey, setPageKey] = useState(0);
  const [projects, setProjects] = useState(pipelineProjetosData);
  const [parceirosData, setParceirosData] = useState(initialParceirosData);
  const [clients, setClients] = useState([{ id: 1, nome: 'Cliente Exemplo' }]);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const navigate = (page) => {
    setActivePage(page);
    setPageKey((k) => k + 1);
  };

  const config = pageConfig[activePage] || pageConfig['dashboard'];
  const PageComponent = pageComponents[activePage] || Dashboard;

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={navigate} />

      <div className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1>{config.title}</h1>
            <p>{config.sub}</p>
          </div>
          {config.showNewProject && (
            <button className="btn-primary" onClick={() => setIsNewProjectModalOpen(true)}>
              + Novo Projeto
            </button>
          )}
        </div>

        <div className="page-body" key={pageKey}>
          <PageComponent 
            onNavigate={navigate} 
            projects={projects} 
            setProjects={setProjects}
            parceirosData={parceirosData}
            setParceirosData={setParceirosData}
            clients={clients}
            setClients={setClients}
            externalModalOpen={isNewProjectModalOpen}
            setExternalModalOpen={setIsNewProjectModalOpen}
          />
        </div>
      </div>
    </div>
  );
}
