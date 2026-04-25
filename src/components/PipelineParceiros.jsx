import { useState } from 'react';
import { pipelineParceirosData } from '../data/mockData';
import { formatCurrency } from './ui/Shared';
import Modal from './ui/Modal';

export default function PipelineParceiros() {
  const [colunas, setColunas] = useState(pipelineParceirosData);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [activeCol, setActiveCol] = useState('Prospecção');

  const fields = [
    { name: 'nome', label: 'Nome do Parceiro', type: 'text' },
    { name: 'tipo', label: 'Tipo de Empresa', type: 'text' },
    { name: 'valorPotencial', label: 'Valor Potencial (R$)', type: 'number' },
  ];

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

  const handleDelete = (id, col, e) => {
    e.stopPropagation();
    setColunas(prev => ({ ...prev, [col]: prev[col].filter(c => c.id !== id) }));
  };

  const handleSave = (formData) => {
    const valorNum = parseFloat(formData.valorPotencial);
    if (editingCard) {
      setColunas(prev => {
        const next = { ...prev };
        const col = editingCard.col;
        next[col] = next[col].map(c => c.id === editingCard.id ? { ...c, ...formData, valorPotencial: valorNum } : c);
        return next;
      });
    } else {
      const novo = {
        id: Date.now(),
        ...formData,
        valorPotencial: valorNum
      };
      setColunas(prev => ({ ...prev, [activeCol]: [...prev[activeCol], novo] }));
    }
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
    <div className="kanban-board">
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title={editingCard ? 'Editar Parceiro' : `Novo Parceiro - ${activeCol}`}
        initialData={editingCard}
        fields={fields}
      />
      {Object.entries(colunas).map(([col, cards]) => (
        <div key={col} className="kanban-col"
          onDragOver={e => { e.preventDefault(); setDragOver(col); }}
          onDrop={() => handleDrop(col)}
          style={{
            outline: dragOver === col && dragging?.colOrigem !== col ? '2px dashed #EF9F27' : 'none',
            borderRadius: 12
          }}
        >
          <div className="kanban-col-header">
            {col}
            <span className="kanban-col-count">{cards.length}</span>
          </div>
          <div className="kanban-cards">
            {cards.map((card) => (
              <div key={card.id} className="kanban-card" draggable
                onDragStart={() => handleDragStart(card, col)}
                onClick={() => openEdit(card, col)}
                style={{ opacity: dragging?.card.id === card.id ? 0.4 : 1, cursor: 'grab' }}
              >
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <span style={{ fontSize:11, color:'#85B7EB', userSelect:'none' }}>⠿ arrastar</span>
                  <button onClick={(e) => handleDelete(card.id, col, e)}
                    style={{ background:'rgba(239,159,39,0.12)', border:'none', borderRadius:'50%',
                      width:22, height:22, cursor:'pointer', color:'#EF9F27', fontWeight:700, fontSize:13,
                      display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
                </div>

                <div className="kanban-card-title">{card.nome}</div>
                <div className="kanban-card-meta" style={{ marginBottom:10 }}>
                  <span>🏢</span><span>{card.tipo}</span>
                </div>
                <div style={{ background:'#EBF3FB', borderRadius:8, padding:'6px 10px', fontSize:13, fontWeight:700, color:'#185FA5' }}>
                  💼 {formatCurrency(card.valorPotencial)}
                </div>
              </div>
            ))}

            <button className="btn-secondary" style={{ width:'100%', borderStyle:'dashed', padding:'10px', marginTop:10 }} onClick={() => openAdd(col)}>
              + Adicionar Parceiro
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
