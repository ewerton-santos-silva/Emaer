import { useState } from 'react';
import { formatCurrency } from './ui/Shared';
import Modal from './ui/Modal';

const colConfigs = {
  'A PRECIFICAR':   { color: '#555',     icon: '📋' },
  'A APRESENTAR':   { color: '#185FA5',  icon: '📺' },
  'AGENDADA':       { color: '#2E9E5B',  icon: '📅' },
  'NO SHOW':        { color: '#EF9F27',  icon: '👤' },
  'NEGOCIAÇÃO':     { color: '#9c27b0',  icon: '🤝' },
  'FORMALIZAÇÃO':   { color: '#e91e63',  icon: '📑' },
  'FECHADA':        { color: '#4caf50',  icon: '✅' },
};

export default function PipelineProjetos({ projects, setProjects }) {
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [activeCol, setActiveCol] = useState('A PRECIFICAR');

  const fields = [
    { name: 'nome', label: 'Nome do Projeto', type: 'text' },
    { name: 'cliente', label: 'Cliente', type: 'text' },
    { name: 'valor', label: 'Valor (R$)', type: 'number' },
    { name: 'area', label: 'Área (m²)', type: 'number' },
  ];

  const emPropostaCount = Object.entries(projects)
    .filter(([col]) => col !== 'FECHADA')
    .reduce((acc, [_, cards]) => acc + cards.length, 0);

  const emPropostaValor = Object.entries(projects)
    .filter(([col]) => col !== 'FECHADA')
    .reduce((acc, [_, cards]) => acc + cards.reduce((s, c) => s + (c.valor || 0), 0), 0);

  const fechadasCount = projects['FECHADA']?.length || 0;
  const fechadasValor = projects['FECHADA']?.reduce((acc, c) => acc + (c.valor || 0), 0) || 0;

  const handleDragStart = (card, colOrigem) => setDragging({ card, colOrigem });

  const handleDrop = (colDestino) => {
    if (!dragging || dragging.colOrigem === colDestino) { setDragging(null); return; }
    const next = { ...projects };
    next[dragging.colOrigem] = next[dragging.colOrigem].filter(c => c.id !== dragging.card.id);
    next[colDestino] = [...(next[colDestino] || []), dragging.card];
    setProjects(next);
    setDragging(null);
    setDragOver(null);
  };

  const handleDelete = (id, col, e) => {
    e.stopPropagation();
    const next = { ...projects };
    next[col] = next[col].filter(c => c.id !== id);
    setProjects(next);
  };

  const handleSave = (formData) => {
    const valorNum = parseFloat(formData.valor);
    const areaNum = parseFloat(formData.area);
    const next = { ...projects };
    
    if (editingCard) {
      next[editingCard.col] = next[editingCard.col].map(c => 
        c.id === editingCard.id ? { ...c, ...formData, valor: valorNum, area: areaNum } : c
      );
    } else {
      const novo = {
        id: Date.now(),
        ...formData,
        valor: valorNum,
        area: areaNum,
        data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
      };
      next[activeCol] = [...(next[activeCol] || []), novo];
    }
    setProjects(next);
    setIsModalOpen(false);
  };

  const openAdd = (col) => {
    setActiveCol(col);
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const openEdit = (card, col) => {
    setEditingCard({ ...card, col });
    setIsModalOpen(true);
  };

  return (
    <>
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title={editingCard ? 'Editar Projeto' : `Novo Projeto - ${activeCol}`}
        initialData={editingCard}
        fields={fields}
      />

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
        <div className="card" style={{ padding: 25, borderLeft: '5px solid var(--emaer-cyan)' }}>
          <div style={{ fontSize: 11, color: 'var(--emaer-text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>Em Proposta</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--emaer-cyan)', margin: '5px 0' }}>{formatCurrency(emPropostaValor)}</div>
          <div style={{ fontSize: 13, color: 'var(--emaer-text-dim)' }}>{emPropostaCount} projetos com valor</div>
        </div>
        <div className="card" style={{ padding: 25, borderLeft: '5px solid var(--emaer-green)' }}>
          <div style={{ fontSize: 11, color: 'var(--emaer-text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>Propostas Fechadas</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--emaer-green)', margin: '5px 0' }}>{formatCurrency(fechadasValor)}</div>
          <div style={{ fontSize: 13, color: 'var(--emaer-text-dim)' }}>{fechadasCount} projetos fechados</div>
        </div>
      </div>

      <div className="kanban-board" style={{ alignItems: 'flex-start' }}>
        {Object.entries(colConfigs).map(([col, config]) => {
          const cards = projects[col] || [];
          return (
            <div key={col} className="kanban-col"
              onDragOver={e => { e.preventDefault(); setDragOver(col); }}
              onDrop={() => handleDrop(col)}
              style={{
                outline: dragOver === col && dragging?.colOrigem !== col ? '2px dashed var(--emaer-red)' : 'none',
                background: 'rgba(255,255,255,0.02)',
                minWidth: 240
              }}
            >
              <div className="kanban-col-header" style={{ borderBottom: `3px solid ${config.color}`, background: 'rgba(255,255,255,0.03)', padding: '12px 15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{config.icon}</span>
                  <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{col}</span>
                </div>
                <span className="kanban-col-count" style={{ background: config.color }}>{cards.length}</span>
              </div>

              <div className="kanban-cards">
                {cards.map((card) => (
                  <div key={card.id} className="kanban-card" draggable
                    onDragStart={() => handleDragStart(card, col)}
                    onClick={() => openEdit(card, col)}
                    style={{ 
                      opacity: dragging?.card.id === card.id ? 0.4 : 1, 
                      background: 'var(--emaer-card)',
                      border: '1px solid var(--emaer-border)',
                      padding: 15
                    }}
                  >
                    <div className="kanban-card-title" style={{ color: '#fff', fontSize: 14, marginBottom: 5 }}>{card.nome}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--emaer-text-dim)', marginBottom: 10 }}>
                      {card.valor > 0 ? formatCurrency(card.valor) : 'R$ —'}
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                      <span style={{ 
                        fontSize: 10, background: 'rgba(0,188,212,0.1)', color: 'var(--emaer-cyan)', 
                        padding: '2px 8px', borderRadius: 4, fontWeight: 600 
                      }}>{card.cliente}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--emaer-text-dim)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        📅 {card.data || '25/04/26'}
                      </div>
                      <button onClick={(e) => handleDelete(card.id, col, e)}
                        style={{ background: 'none', border: 'none', color: 'var(--emaer-text-dim)', cursor: 'pointer', fontSize: 12 }}>✕</button>
                    </div>
                  </div>
                ))}

                <button className="btn-secondary" 
                  style={{ width: '100%', border: '1px dashed var(--emaer-border)', color: 'var(--emaer-text-dim)', background: 'transparent' }} 
                  onClick={() => openAdd(col)}
                >
                  + Novo Projeto
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
