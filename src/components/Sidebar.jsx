import { useState } from 'react';

const navStructure = [
  {
    section: 'VISÃO GERAL',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: '📊' }],
  },
  {
    section: 'DIÁRIO',
    items: [
      { id: 'tarefas', label: 'Tarefas', icon: '✅' },
      { id: 'mentoria', label: 'Mentoria', icon: '🎓' },
    ],
  },
  {
    section: 'PARCEIROS',
    items: [
      { id: 'pipeline-parceiros', label: 'Pipeline Parceiros', icon: '🤝' },
      { id: 'parceiros-ativos', label: 'Parceiros Ativos', icon: '⭐' },
    ],
  },
  {
    section: 'COMERCIAL',
    items: [
      { id: 'pipeline-projetos', label: 'Pipeline Projetos', icon: '🏗️' },
      { id: 'precificacao', label: 'Precificação', icon: '🧮' },
    ],
  },
  {
    section: 'FINANCEIRO',
    items: [
      { id: 'fluxo-caixa', label: 'Fluxo de Caixa', icon: '💰' },
      { id: 'carteira-projetos', label: 'Carteira Projetos', icon: '📁' },
      { id: 'carteira-clientes', label: 'Carteira Clientes', icon: '👥' },
    ],
  },
  {
    section: 'FUNIS & ANÁLISE',
    items: [
      { id: 'funil-vendas', label: 'Funil de Vendas', icon: '🔽' },
      { id: 'funil-marketing', label: 'Funil Marketing', icon: '📣' },
      { id: 'redes-sociais', label: 'Redes Sociais', icon: '📱' },
      { id: 'indicadores', label: 'Indicadores', icon: '📈' },
    ],
  },
];

export default function Sidebar({ activePage, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-main">EMAER</div>
        {!collapsed && (
          <>
            <div className="logo-sub">Engenharia</div>
            <div className="logo-accent" />
          </>
        )}
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navStructure.map((section) => (
          <div className="nav-section" key={section.section}>
            <div className="nav-section-label">{section.section}</div>
            {section.items.map((item) => (
              <div
                key={item.id}
                className={`nav-item${activePage === item.id ? ' active' : ''}`}
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
