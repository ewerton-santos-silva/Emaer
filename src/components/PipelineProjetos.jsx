import { useState, useEffect } from 'react';
import { formatCurrency } from './ui/Shared';

const colConfigs = {
  'A PRECIFICAR':   { color: '#555',     icon: '📋' },
  'A APRESENTAR':   { color: '#185FA5',  icon: '📺' },
  'AGENDADA':       { color: '#2E9E5B',  icon: '📅' },
  'NO SHOW':        { color: '#EF9F27',  icon: '👤' },
  'NEGOCIAÇÃO':     { color: '#9c27b0',  icon: '🤝' },
  'FORMALIZAÇÃO':   { color: '#e91e63',  icon: '📑' },
  'FECHADA':        { color: '#4caf50',  icon: '✅' },
};

const initialForm = {
  nome: '', cliente: '', arquiteto: '', tipos: [], etapa: 'A PRECIFICAR',
  valor: 0, arquivo: 'Aguardando', origem: 'Parceiro', parceiro: '',
  proximaAcao: '', observacoes: ''
};

export default function PipelineProjetos({ projects, setProjects, externalModalOpen, setExternalModalOpen }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (externalModalOpen) {
      setIsModalOpen(true);
      setFormData(initialForm);
      setExternalModalOpen(false);
    }
  }, [externalModalOpen, setExternalModalOpen]);

  const handleSave = () => {
    if (!formData.nome) {
      alert('Por favor, preencha o nome do projeto.');
      return;
    }
    const next = { ...projects };
    const novo = {
      id: Date.now(),
      ...formData,
      data: new Date().toLocaleDateString('pt-BR')
    };
    const targetCol = formData.etapa || 'A PRECIFICAR';
    next[targetCol] = [...(next[targetCol] || []), novo];
    setProjects(next);
    setIsModalOpen(false);
    setFormData(initialForm);
  };

  const moveCard = (cardId, fromCol, toCol) => {
    const next = { ...projects };
    const card = next[fromCol].find(p => p.id === cardId);
    if (!card) return;
    next[fromCol] = next[fromCol].filter(p => p.id !== cardId);
    next[toCol] = [...(next[toCol] || []), { ...card, status: toCol }];
    setProjects(next);
  };

  return (
    <>
      {isModalOpen && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, color: 'var(--emaer-azul-principal)' }}>NOVO PROJETO</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>×</button>
              </div>

              <div style={{ display: 'grid', gap: 15 }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--emaer-azul-claro)' }}>NOME DO PROJETO *</label>
                  <input className="form-control" style={{ borderColor: formData.nome ? '#ccc' : 'red' }} value={formData.nome} onChange={(e)=>setFormData({...formData, nome: e.target.value})} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                    <label className="form-label">CLIENTE</label>
                    <select className="form-control" value={formData.cliente} onChange={(e)=>setFormData({...formData, cliente: e.target.value})}>
                      <option value="">─ nenhum ─</option>
                      <option value="Cliente A">Cliente A</option>
                    </select>
                  </div>
                  <button className="btn-primary" style={{ padding: '8px 12px', background: '#331111' }} onClick={() => alert('Abrir cadastro de novo cliente...')}>+ Novo</button>
                </div>

                <div className="form-group">
                  <label className="form-label">ETAPA INICIAL</label>
                  <select className="form-control" value={formData.etapa} onChange={(e)=>setFormData({...formData, etapa: e.target.value})}>
                    {Object.keys(colConfigs).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                  <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                  <button className="btn-primary" onClick={handleSave}>Adicionar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="kanban-board">
        {Object.entries(colConfigs).map(([col, config]) => (
          <div key={col} className="kanban-col">
            <div className="kanban-col-header" style={{ background: config.color }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{config.icon}</span>
                <span>{col}</span>
              </div>
              <span className="kanban-col-count">{(projects[col] || []).length}</span>
            </div>
            <div className="kanban-cards">
              {(projects[col] || []).map(card => (
                <div key={card.id} className="kanban-card" style={{ borderTop: `3px solid ${config.color}` }}>
                  <div className="kanban-card-title">{card.nome}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--emaer-azul-principal)' }}>{formatCurrency(card.valor)}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 8 }}>📅 {card.data}</div>
                  
                  {/* Movement Buttons */}
                  <div style={{ marginTop: 12, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {Object.keys(colConfigs).map(tCol => (
                      tCol !== col && (
                        <button 
                          key={tCol}
                          onClick={() => moveCard(card.id, col, tCol)}
                          style={{ fontSize: 10, padding: '2px 6px', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer', background: '#fff' }}
                          title={`Mover para ${tCol}`}
                        >
                          {colConfigs[tCol].icon}
                        </button>
                      )
                    ))}
                  </div>
                </div>
              ))}
              <button className="btn-secondary" style={{ width: '100%', borderStyle: 'dashed' }} onClick={() => {
                setFormData({ ...initialForm, etapa: col });
                setIsModalOpen(true);
              }}>+ Novo Projeto</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
