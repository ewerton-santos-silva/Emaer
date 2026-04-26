import { useState } from 'react';

const colConfigs = {
  'PROSPECÇÃO':      { color: '#555',     icon: '🔍' },
  'CONTATADO':       { color: '#185FA5',  icon: '📞' },
  'REUNIÃO':         { color: '#EF9F27',  icon: '🤝' },
  'PARCERIA FIRMADA': { color: '#2E9E5B',  icon: '✅' },
  'INATIVO':         { color: '#999',     icon: '📁' },
};

const initialParceiros = {
  'PROSPECÇÃO': [
    { id: 1, nome: 'Igor Cabral', profissao: 'Arquiteto', instagram: '@igorcabral', local: 'Recife/PE', proxima: '25/04/26' },
    { id: 2, nome: 'Pedro Silva', profissao: 'Engenheiro', instagram: '@pedro.eng', local: 'Olinda/PE', proxima: '28/04/26' },
  ],
  'CONTATADO': [
    { id: 3, nome: 'Manuela arq', profissao: 'Arquiteto', instagram: '@manuela.arq', local: 'Jaboatão/PE', proxima: '26/04/26' },
  ],
  'REUNIÃO': [],
  'PARCERIA FIRMADA': [],
  'INATIVO': [],
};

export default function PipelineParceiros() {
  const [parceiros, setParceiros] = useState(initialParceiros);

  const moveCard = (cardId, fromCol, toCol) => {
    const next = { ...parceiros };
    const card = next[fromCol].find(p => p.id === cardId);
    next[fromCol] = next[fromCol].filter(p => p.id !== cardId);
    next[toCol] = [...next[toCol], card];
    setParceiros(next);
  };

  return (
    <div className="kanban-board" style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 20 }}>
      {Object.entries(colConfigs).map(([col, config]) => (
        <div key={col} className="kanban-col" style={{ minWidth: 280, flex: 1, background: '#f5f5f5', borderRadius: 12, overflow: 'hidden' }}>
          <div className="kanban-col-header" style={{ background: config.color, padding: '12px 15px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700 }}>
              <span>{config.icon}</span> {col}
            </div>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>
              {parceiros[col].length}
            </span>
          </div>
          
          <div className="kanban-cards" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {parceiros[col].map(p => (
              <div key={p.id} className="kanban-card" style={{ background: '#fff', padding: 15, borderRadius: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderTop: `3px solid ${config.color}` }}>
                <div style={{ fontWeight: 700, color: 'var(--emaer-azul-principal)', marginBottom: 8 }}>{p.nome}</div>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}><strong>Profissão:</strong> {p.profissao}</div>
                <div style={{ fontSize: 12, color: 'var(--emaer-azul-claro)', marginBottom: 4 }}>{p.instagram}</div>
                <div style={{ fontSize: 11, color: '#999' }}>📍 {p.local}</div>
                
                <div style={{ marginTop: 12, display: 'flex', gap: 5 }}>
                  {Object.keys(colConfigs).map(targetCol => (
                    targetCol !== col && (
                      <button 
                        key={targetCol}
                        onClick={() => moveCard(p.id, col, targetCol)}
                        style={{ fontSize: 9, padding: '2px 5px', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer', background: '#fff' }}
                        title={`Mover para ${targetCol}`}
                      >
                        {colConfigs[targetCol].icon}
                      </button>
                    )
                  ))}
                </div>
              </div>
            ))}
            <button className="btn-secondary" style={{ width: '100%', borderStyle: 'dashed', fontSize: 12, padding: 8 }}>+ Novo Parceiro</button>
          </div>
        </div>
      ))}
    </div>
  );
}
