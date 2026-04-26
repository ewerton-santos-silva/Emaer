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
      setFormData(initialForm); // Reset form when opening from header
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

    // Ensure the column exists
    const targetCol = formData.etapa || 'A PRECIFICAR';
    next[targetCol] = [...(next[targetCol] || []), novo];
    
    setProjects(next);
    setIsModalOpen(false);
    setFormData(initialForm); // Reset after save
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
                      <option value="Cliente B">Cliente B</option>
                    </select>
                  </div>
                  <button className="btn-primary" style={{ padding: '8px 12px', background: '#331111' }}>+ Novo</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                    <label className="form-label">ARQUITETO DO PROJETO</label>
                    <select className="form-control" value={formData.arquiteto} onChange={(e)=>setFormData({...formData, arquiteto: e.target.value})}>
                      <option value="">─ nenhum ─</option>
                      <option value="Arq X">Arq X</option>
                      <option value="Arq Y">Arq Y</option>
                    </select>
                  </div>
                  <button className="btn-primary" style={{ padding: '8px 12px', background: '#331111' }}>+ Novo</button>
                </div>

                <div className="form-group">
                  <label className="form-label">TIPO DE PROJETO</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {['Estrutural', 'Elétrico', 'Hidrossanitário', 'Laudo', 'Outro'].map(t => (
                      <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                        <input type="checkbox" checked={formData.tipos.includes(t)} onChange={(e) => {
                          const n = e.target.checked ? [...formData.tipos, t] : formData.tipos.filter(x => x !== t);
                          setFormData({...formData, tipos: n});
                        }} /> {t}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">ETAPA INICIAL</label>
                  <select className="form-control" value={formData.etapa} onChange={(e)=>setFormData({...formData, etapa: e.target.value})}>
                    {Object.keys(colConfigs).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <div className="form-group">
                    <label className="form-label">VALOR DA PROPOSTA (R$)</label>
                    <input type="number" className="form-control" value={formData.valor} onChange={(e)=>setFormData({...formData, valor: Number(e.target.value)})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ARQUIVO</label>
                    <select className="form-control" value={formData.arquivo} onChange={(e)=>setFormData({...formData, arquivo: e.target.value})}>
                      <option>Aguardando</option>
                      <option>Recebido</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">ORIGEM</label>
                  <select className="form-control" value={formData.origem} onChange={(e)=>setFormData({...formData, origem: e.target.value})}>
                    <option>Parceiro</option>
                    <option>Google</option>
                    <option>Instagram</option>
                    <option>Indicação</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">PRÓXIMA AÇÃO</label>
                  <input type="date" className="form-control" value={formData.proximaAcao} onChange={(e)=>setFormData({...formData, proximaAcao: e.target.value})} />
                </div>

                <div className="form-group">
                  <label className="form-label">OBSERVAÇÕES</label>
                  <textarea className="form-control" rows="3" value={formData.observacoes} onChange={(e)=>setFormData({...formData, observacoes: e.target.value})} />
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
