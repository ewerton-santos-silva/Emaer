import { useState } from 'react';
import { pipelineParceirosData } from '../data/mockData';
import { formatCurrency } from './ui/Shared';

export default function PipelineParceiros() {
  const [colunas, setColunas] = useState(pipelineParceirosData);
  const [dragging, setDragging] = useState(null); // { card, colOrigem }
  const [dragOver, setDragOver] = useState(null);

  const handleDragStart = (card, colOrigem) => setDragging({ card, colOrigem });

  const handleDrop = (colDestino) => {
    if (!dragging || dragging.colOrigem === colDestino) { setDragging(null); return; }
    setColunas(prev => {
      const next = {};
      Object.entries(prev).forEach(([col, cards]) => {
        if (col === dragging.colOrigem) next[col] = cards.filter(c => c.id !== dragging.card.id);
        else if (col === colDestino)   next[col] = [...cards, dragging.card];
        else                           next[col] = cards;
      });
      return next;
    });
    setDragging(null);
    setDragOver(null);
  };

  const handleDelete = (id, col) => {
    setColunas(prev => ({ ...prev, [col]: prev[col].filter(c => c.id !== id) }));
  };

  return (
    <div className="kanban-board">
      {Object.entries(colunas).map(([col, cards]) => (
        <div
          key={col} className="kanban-col"
          onDragOver={e => { e.preventDefault(); setDragOver(col); }}
          onDragLeave={() => setDragOver(null)}
          onDrop={() => handleDrop(col)}
          style={{
            outline: dragOver === col && dragging?.colOrigem !== col
              ? '2px dashed #EF9F27' : 'none',
            borderRadius: 12,
            transition: '0.15s',
          }}
        >
          <div className="kanban-col-header">
            {col}
            <span className="kanban-col-count">{cards.length}</span>
          </div>
          <div className="kanban-cards">
            {cards.map((card) => (
              <div
                key={card.id}
                className="kanban-card"
                draggable
                onDragStart={() => handleDragStart(card, col)}
                onDragEnd={() => { setDragging(null); setDragOver(null); }}
                style={{ opacity: dragging?.card.id === card.id ? 0.4 : 1, cursor: 'grab' }}
              >
                {/* Top row: drag handle hint + delete */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <span style={{ fontSize:11, color:'#85B7EB', userSelect:'none' }}>⠿ arrastar</span>
                  <button
                    onClick={() => handleDelete(card.id, col)}
                    style={{ background:'rgba(239,159,39,0.12)', border:'none', borderRadius:'50%',
                      width:22, height:22, cursor:'pointer', color:'#EF9F27', fontWeight:700, fontSize:13,
                      display:'flex', alignItems:'center', justifyContent:'center', transition:'0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(220,53,69,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background='rgba(239,159,39,0.12)'}
                    title="Excluir parceiro"
                  >✕</button>
                </div>

                <div className="kanban-card-title">{card.nome}</div>
                <div className="kanban-card-meta" style={{ marginBottom:10 }}>
                  <span>🏢</span><span>{card.tipo}</span>
                </div>
                <div style={{ background:'#EBF3FB', borderRadius:8, padding:'6px 10px',
                  fontSize:13, fontWeight:700, color:'#185FA5' }}>
                  💼 {formatCurrency(card.valorPotencial)}
                </div>
              </div>
            ))}

            {/* Drop zone indicator */}
            {dragOver === col && dragging?.colOrigem !== col && (
              <div style={{ border:'2px dashed #EF9F27', borderRadius:10, padding:16,
                textAlign:'center', color:'#EF9F27', fontSize:12, fontWeight:700 }}>
                Soltar aqui
              </div>
            )}

            <button style={{ background:'rgba(12,68,124,0.05)',border:'1.5px dashed rgba(12,68,124,0.2)',
              borderRadius:10,padding:'10px',color:'#85B7EB',fontSize:13,cursor:'pointer',
              width:'100%',transition:'0.2s' }}
              onMouseEnter={e=>e.target.style.background='rgba(12,68,124,0.1)'}
              onMouseLeave={e=>e.target.style.background='rgba(12,68,124,0.05)'}>
              + Adicionar Parceiro
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
