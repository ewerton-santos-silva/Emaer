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

const defaultNewProject = {
  nome: '', cliente: '', arquiteto: '', tipos: [], etapa: 'A PRECIFICAR',
  valor: 0, arquivo: 'Aguardando', origem: 'Parceiro', parceiro: '',
  proximaAcao: '', observacoes: ''
};

export default function PipelineProjetos({ projects, setProjects }) {
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [activeCol, setActiveCol] = useState('A PRECIFICAR');

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

  const handleSave = (formData) => {
    const next = { ...projects };
    if (editingCard) {
      next[editingCard.col] = next[editingCard.col].map(c => 
        c.id === editingCard.id ? { ...c, ...formData } : c
      );
    } else {
      const novo = {
        id: Date.now(),
        ...formData,
        data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
      };
      next[formData.etapa] = [...(next[formData.etapa] || []), novo];
    }
    setProjects(next);
    setIsModalOpen(false);
  };

  const openAdd = (col) => {
    setActiveCol(col);
    setEditingCard(null);
    setIsModalOpen(true);
  };

  return (
    <>
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card" style={{ width: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, color: 'var(--emaer-azul-principal)' }}>NOVO PROJETO</h2>
                <button style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}>×</button>
              </div>

              <div style={{ display: 'grid', gap: 15 }}>
                <div className="form-group">
                  <label className="form-label">NOME DO PROJETO *</label>
                  <input className="form-control" placeholder="Ex: Casa Resilla" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">CLIENTE</label>
                    <select className="form-control"><option>— nenhum —</option></select>
                  </div>
                  <button className="btn-primary" style={{ padding: '8px 12px' }}>+ Novo</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">ARQUITETO DO PROJETO</label>
                    <select className="form-control"><option>— nenhum —</option></select>
                  </div>
                  <button className="btn-primary" style={{ padding: '8px 12px' }}>+ Novo</button>
                </div>

                <div className="form-group">
                  <label className="form-label">TIPO DE PROJETO</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {['Estrutural', 'Elétrico', 'Hidrossanitário', 'Laudo', 'Outro'].map(t => (
                      <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                        <input type="checkbox" /> {t}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">ETAPA INICIAL</label>
                  <select className="form-control">
                    {Object.keys(colConfigs).map(col => <option key={col} value={col}>{col}</option>)}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <div className="form-group">
                    <label className="form-label">VALOR DA PROPOSTA (R$)</label>
                    <input type="number" className="form-control" defaultValue="0.00" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ARQUIVO</label>
                    <select className="form-control">
                      <option>Aguardando</option>
                      <option>Recebido</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">ORIGEM</label>
                  <select className="form-control">
                    <option>Parceiro</option>
                    <option>Google</option>
                    <option>Instagram</option>
                    <option>Indicação</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">PARCEIRO</label>
                    <select className="form-control"><option>— selecione —</option></select>
                  </div>
                  <button className="btn-primary" style={{ padding: '8px 12px' }}>+ Novo</button>
                </div>

                <div className="form-group">
                  <label className="form-label">PRÓXIMA AÇÃO</label>
                  <input type="date" className="form-control" />
                </div>

                <div className="form-group">
                  <label className="form-label">OBSERVAÇÕES</label>
                  <textarea className="form-control" rows="3" placeholder="Notas..."></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                  <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                  <button className="btn-primary" onClick={() => handleSave({})}>Adicionar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Row */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 25 }}>
        <div className="card" style={{ flex: 1, padding: '15px 20px', borderLeft: '4px solid var(--emaer-azul-claro)' }}>
          <div style={{ fontSize: 11, color: 'var(--emaer-azul-claro)', fontWeight: 700, textTransform: 'uppercase' }}>Em Proposta</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: var(--emaer-azul-principal) }}>{formatCurrency(133900)}</div>
        </div>
        <div className="card" style={{ flex: 1, padding: '15px 20px', borderLeft: '4px solid var(--emaer-verde)' }}>
          <div style={{ fontSize: 11, color: 'var(--emaer-verde)', fontWeight: 700, textTransform: 'uppercase' }}>Fechadas</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: var(--emaer-azul-principal) }}>{formatCurrency(153400)}</div>
        </div>
      </div>

      <div className="kanban-board">
        {Object.entries(colConfigs).map(([col, config]) => {
          const cards = projects[col] || [];
          return (
            <div key={col} className="kanban-col"
              onDragOver={e => { e.preventDefault(); setDragOver(col); }}
              onDrop={() => handleDrop(col)}
              style={{
                background: 'rgba(0,0,0,0.03)',
                border: dragOver === col ? '2px dashed var(--emaer-azul-medio)' : 'none'
              }}
            >
              <div className="kanban-col-header" style={{ background: config.color }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{config.icon}</span>
                  <span style={{ fontSize: 11, textTransform: 'uppercase' }}>{col}</span>
                </div>
                <span className="kanban-col-count">{cards.length}</span>
              </div>

              <div className="kanban-cards">
                {cards.map((card) => (
                  <div key={card.id} className="kanban-card" draggable
                    onDragStart={() => handleDragStart(card, col)}
                    style={{ borderTop: `3px solid ${config.color}` }}
                  >
                    <div className="kanban-card-title">{card.nome}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--emaer-azul-principal)', margin: '5px 0' }}>
                      {formatCurrency(card.valor)}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                      <span style={{ background: 'var(--emaer-azul-light)', color: 'var(--emaer-azul-medio)', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>{card.cliente}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--emaer-azul-claro)', display: 'flex', alignItems: 'center', gap: 5 }}>
                      📅 {card.data || '25/04/26'}
                    </div>
                  </div>
                ))}

                <button className="btn-secondary" style={{ width: '100%', borderStyle: 'dashed', marginTop: 5 }} onClick={() => openAdd(col)}>
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
