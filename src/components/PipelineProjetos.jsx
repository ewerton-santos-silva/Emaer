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
  nome: '', clienteId: '', arquitetoId: '', tipos: [], etapa: 'A PRECIFICAR',
  valor: 0, arquivo: 'Aguardando', origem: 'Parceiro', parceiroId: '',
  proximaAcao: '', dataAcao: '', observacoes: ''
};

export default function PipelineProjetos({ 
  projects, setProjects, externalModalOpen, setExternalModalOpen, 
  clients, setClients, parceirosData 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [newClientName, setNewClientName] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);

  useEffect(() => {
    if (externalModalOpen) {
      setIsModalOpen(true);
      setFormData(initialForm);
      setExternalModalOpen(false);
    }
  }, [externalModalOpen, setExternalModalOpen]);

  const handleSave = () => {
    if (!formData.nome) { alert('Nome do projeto é obrigatório.'); return; }
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
  };

  const moveCard = (cardId, fromCol, toCol) => {
    const next = { ...projects };
    const card = next[fromCol].find(p => p.id === cardId);
    if (!card) return;
    next[fromCol] = next[fromCol].filter(p => p.id !== cardId);
    next[toCol] = [...(next[toCol] || []), { ...card, etapa: toCol }];
    setProjects(next);
  };

  const handleAddClient = () => {
    if (!newClientName) return;
    const nuevo = { id: Date.now(), nome: newClientName };
    setClients([...clients, nuevo]);
    setFormData({ ...formData, clienteId: nuevo.id });
    setNewClientName('');
    setIsAddingClient(false);
  };

  const allPartners = Object.values(parceirosData).flat();

  return (
    <>
      {isModalOpen && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="card-body">
              <h3 style={{ marginBottom: 20, color: 'var(--emaer-azul-principal)' }}>NOVO PROJETO</h3>
              
              <div style={{ display: 'grid', gap: 15 }}>
                <div className="form-group">
                  <label className="form-label">NOME DO PROJETO *</label>
                  <input className="form-control" value={formData.nome} onChange={(e)=>setFormData({...formData, nome: e.target.value})} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">CLIENTE</label>
                    {isAddingClient ? (
                      <input className="form-control" placeholder="Nome do novo cliente..." value={newClientName} onChange={(e)=>setNewClientName(e.target.value)} autoFocus />
                    ) : (
                      <select className="form-control" value={formData.clienteId} onChange={(e)=>setFormData({...formData, clienteId: e.target.value})}>
                        <option value="">─ selecionar ─</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                      </select>
                    )}
                  </div>
                  {isAddingClient ? (
                    <button className="btn-primary" style={{ padding: '8px 12px' }} onClick={handleAddClient}>Salvar</button>
                  ) : (
                    <button className="btn-primary" style={{ padding: '8px 12px', background: '#331111' }} onClick={() => setIsAddingClient(true)}>+ Novo</button>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">QUEM INDICOU (PARCEIRO)</label>
                  <select className="form-control" value={formData.parceiroId} onChange={(e)=>setFormData({...formData, parceiroId: e.target.value})}>
                    <option value="">─ nenhum ─</option>
                    {allPartners.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <div className="form-group">
                    <label className="form-label">PRÓXIMA AÇÃO</label>
                    <input className="form-control" placeholder="Ex: Ligar para briefing" value={formData.proximaAcao} onChange={(e)=>setFormData({...formData, proximaAcao: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">DATA DA AÇÃO</label>
                    <input type="date" className="form-control" value={formData.dataAcao} onChange={(e)=>setFormData({...formData, dataAcao: e.target.value})} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">ETAPA INICIAL</label>
                  <select className="form-control" value={formData.etapa} onChange={(e)=>setFormData({...formData, etapa: e.target.value})}>
                    {Object.keys(colConfigs).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                  <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                  <button className="btn-primary" onClick={handleSave}>Adicionar Projeto</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="kanban-board">
        {Object.entries(colConfigs).map(([col, config]) => (
          <div key={col} className="kanban-col">
            <div className="kanban-col-header" style={{ background: config.color }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{config.icon}</span> <span>{col}</span>
              </div>
              <span className="kanban-col-count">{(projects[col] || []).length}</span>
            </div>
            <div className="kanban-cards">
              {(projects[col] || []).map(card => (
                <div key={card.id} className="kanban-card" style={{ borderTop: `3px solid ${config.color}` }}>
                  <div style={{ fontWeight: 700, color: 'var(--emaer-azul-principal)', fontSize: 13 }}>{card.nome}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, marginTop: 4 }}>{formatCurrency(card.valor)}</div>
                  {card.proximaAcao && (
                    <div style={{ marginTop: 8, padding: 6, background: '#fff9c4', borderRadius: 6, fontSize: 10 }}>
                      <strong>AÇÃO:</strong> {card.proximaAcao} ({card.dataAcao})
                    </div>
                  )}
                  <div style={{ marginTop: 10, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {Object.keys(colConfigs).map(tCol => tCol !== col && (
                      <button key={tCol} onClick={() => moveCard(card.id, col, tCol)} style={{ padding: '2px 6px', fontSize: 10, border: '1px solid #ddd', borderRadius: 4, background: '#fff', cursor: 'pointer' }}>{colConfigs[tCol].icon}</button>
                    ))}
                  </div>
                </div>
              ))}
              <button className="btn-secondary" style={{ width: '100%', borderStyle: 'dashed' }} onClick={() => { setFormData({ ...initialForm, etapa: col }); setIsModalOpen(true); }}>+ Novo Projeto</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
