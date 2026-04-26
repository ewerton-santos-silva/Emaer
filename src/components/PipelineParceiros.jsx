import { useState } from 'react';
import Modal from './ui/Modal';

const colConfigs = {
  'PROSPECÇÃO':      { color: '#555',     icon: '🔍' },
  'CONTATADO':       { color: '#185FA5',  icon: '📞' },
  'REUNIÃO':         { color: '#EF9F27',  icon: '🤝' },
  'PARCERIA FIRMADA': { color: '#2E9E5B',  icon: '✅' },
  'INATIVO':         { color: '#999',     icon: '📁' },
};

export default function PipelineParceiros({ parceirosData, setParceirosData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetCol, setTargetCol] = useState('PROSPECÇÃO');

  const moveCard = (cardId, fromCol, toCol) => {
    const next = { ...parceirosData };
    const card = next[fromCol].find(p => p.id === cardId);
    if (!card) return;
    next[fromCol] = next[fromCol].filter(p => p.id !== cardId);
    next[toCol] = [...(next[toCol] || []), { ...card, etapa: toCol }];
    setParceirosData(next);
  };

  const handleSave = (formData) => {
    const next = { ...parceirosData };
    const novo = { id: Date.now(), ...formData, etapa: targetCol };
    next[targetCol] = [...(next[targetCol] || []), novo];
    setParceirosData(next);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="kanban-board" style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 20 }}>
        {Object.entries(colConfigs).map(([col, config]) => (
          <div key={col} className="kanban-col" style={{ minWidth: 280, flex: 1, background: '#f5f5f5', borderRadius: 12, overflow: 'hidden' }}>
            <div className="kanban-col-header" style={{ background: config.color, padding: '12px 15px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
                <span>{config.icon}</span> {col}
              </div>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>
                {parceirosData[col]?.length || 0}
              </span>
            </div>
            
            <div className="kanban-cards" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(parceirosData[col] || []).map(p => (
                <div key={p.id} className="kanban-card" style={{ background: '#fff', padding: 15, borderRadius: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderTop: `3px solid ${config.color}` }}>
                  <div style={{ fontWeight: 700, color: 'var(--emaer-azul-principal)', marginBottom: 8 }}>{p.nome}</div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{p.profissao} • {p.instagram}</div>
                  
                  {p.proximaAcao && (
                    <div style={{ marginTop: 8, padding: 6, background: '#e3f2fd', borderRadius: 6, fontSize: 10 }}>
                      <strong>AÇÃO:</strong> {p.proximaAcao} ({p.dataAcao})
                    </div>
                  )}

                  <div style={{ marginTop: 12, display: 'flex', gap: 5 }}>
                    {Object.keys(colConfigs).map(tCol => tCol !== col && (
                      <button key={tCol} onClick={() => moveCard(p.id, col, tCol)} style={{ fontSize: 9, padding: '2px 5px', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer', background: '#fff' }}>
                        {colConfigs[tCol].icon}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button className="btn-secondary" style={{ width: '100%', borderStyle: 'dashed', fontSize: 12, padding: 8 }} onClick={() => { setTargetCol(col); setIsModalOpen(true); }}>+ Novo Parceiro</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          title="Novo Parceiro"
          fields={[
            { name: 'nome', label: 'Nome do Contato', type: 'text' },
            { name: 'profissao', label: 'Profissão', type: 'text' },
            { name: 'instagram', label: '@ Instagram', type: 'text' },
            { name: 'local', label: 'Cidade/Estado', type: 'text' },
            { name: 'proximaAcao', label: 'Próxima Ação', type: 'text' },
            { name: 'dataAcao', label: 'Data da Ação', type: 'date' },
          ]}
        />
      )}
    </>
  );
}
