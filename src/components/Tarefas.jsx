import { useState, useRef } from 'react';
import { tarefasData } from '../data/mockData';
import Modal from './ui/Modal';

/* ─── helpers ─── */
const prioridadeConfig = {
  ALTA:  { color: '#EF9F27', bg: '#FFF8EC' },
  MÉDIA: { color: '#185FA5', bg: '#EBF3FB' },
  BAIXA: { color: '#85B7EB', bg: '#EBF3FB' },
};

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
               'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DIAS_SEMANA = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

function parseDate(str) {
  // str = "dd/mm/aaaa"
  const [d, m, y] = str.split('/').map(Number);
  return { d, m, y };
}

/* ─── KANBAN VIEW ─── */
function KanbanView({ colunas, setColunas, dragging, setDragging, dragOver, setDragOver, onAdd, onEdit }) {
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

  return (
    <div className="kanban-board">
      {Object.entries(colunas).map(([col, cards]) => (
        <div key={col} className="kanban-col"
          onDragOver={e => { e.preventDefault(); setDragOver(col); }}
          onDrop={() => handleDrop(col)}
          style={{ outline: dragOver === col && dragging?.colOrigem !== col ? '2px dashed #EF9F27' : 'none' }}
        >
          <div className="kanban-col-header">
            {col} <span className="kanban-col-count">{cards.length}</span>
          </div>
          <div className="kanban-cards">
            {cards.map((card) => {
              const pri = prioridadeConfig[card.prioridade] || prioridadeConfig.BAIXA;
              return (
                <div key={card.id} className="kanban-card" draggable
                  onDragStart={() => handleDragStart(card, col)}
                  onClick={() => onEdit(card, col)}
                  style={{ opacity: dragging?.card.id === card.id ? 0.45 : 1, cursor: 'grab' }}
                >
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ background:pri.bg, color:pri.color, fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:12 }}>
                      {card.prioridade}
                    </span>
                    <button onClick={(e) => handleDelete(card.id, col, e)}
                      style={{ background:'none', border:'none', color:'#EF9F27', cursor:'pointer' }}>✕</button>
                  </div>
                  <div className="kanban-card-title">{card.titulo}</div>
                  <div className="kanban-card-meta"><span>👤 {card.responsavel}</span> <span style={{ marginLeft:'auto' }}>📅 {card.prazo}</span></div>
                </div>
              );
            })}
            <button className="btn-secondary" style={{ width:'100%', borderStyle:'dashed', padding:'10px', marginTop:10 }} onClick={() => onAdd(col)}>
              + Adicionar tarefa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── LIST VIEW ─── */
function ListView({ colunas, setColunas, onEdit }) {
  const allCards = Object.entries(colunas).flatMap(([col, cards]) => cards.map(c => ({ ...c, col })));
  const handleDelete = (id, col) => setColunas(prev => ({ ...prev, [col]: prev[col].filter(c => c.id !== id) }));

  return (
    <div className="card"><div className="card-body"><div className="table-container">
      <table>
        <thead><tr><th>Tarefa</th><th>Prioridade</th><th>Responsável</th><th>Prazo</th><th>Status</th><th>Ações</th></tr></thead>
        <tbody>
          {allCards.map(card => {
            const pri = prioridadeConfig[card.prioridade] || prioridadeConfig.BAIXA;
            return (
              <tr key={`${card.col}-${card.id}`}>
                <td style={{ fontWeight:600 }}>{card.titulo}</td>
                <td><span style={{ background:pri.bg, color:pri.color, fontSize:11, padding:'2px 8px', borderRadius:12 }}>{card.prioridade}</span></td>
                <td>{card.responsavel}</td>
                <td>{card.prazo}</td>
                <td>{card.col}</td>
                <td>
                  <button className="btn-secondary" onClick={() => onEdit(card, card.col)} style={{ padding:'2px 8px', marginRight:8 }}>Editar</button>
                  <button className="btn-secondary" onClick={() => handleDelete(card.id, card.col)} style={{ padding:'2px 8px', color:'#dc3545' }}>✕</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div></div></div>
  );
}

/* ─── CALENDAR VIEW ─── */
function CalendarView({ colunas }) {
  const [mes, setMes] = useState(4);
  const [ano, setAno] = useState(2026);

  const totalDias = new Date(ano, mes, 0).getDate();
  const primeiroDia = new Date(ano, mes - 1, 1).getDay();

  const allCards = Object.entries(colunas).flatMap(([col, cards]) =>
    cards.map(c => ({ ...c, col }))
  );

  const colColors = { 'A Fazer':'#EF9F27','Em Andamento':'#185FA5','Concluído':'#2E9E5B' };

  const cardsNoDia = (dia) => {
    return allCards.filter(c => {
      const { d, m, y } = parseDate(c.prazo);
      return d === dia && m === mes && y === ano;
    });
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="section-header" style={{ marginBottom:20 }}>
          <div className="section-title">Calendário de Tarefas</div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button className="btn-secondary" style={{ padding:'5px 12px', fontSize:13 }}
              onClick={() => { let m=mes-1,a=ano; if(m<1){m=12;a--;} setMes(m);setAno(a); }}>‹</button>
            <span style={{ fontWeight:700, color:'#0C447C', fontSize:15, minWidth:160, textAlign:'center' }}>
              {MESES[mes-1]} {ano}
            </span>
            <button className="btn-secondary" style={{ padding:'5px 12px', fontSize:13 }}
              onClick={() => { let m=mes+1,a=ano; if(m>12){m=1;a++;} setMes(m);setAno(a); }}>›</button>
          </div>
        </div>

        {/* Day headers */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:4 }}>
          {DIAS_SEMANA.map(d => (
            <div key={d} style={{ textAlign:'center', fontSize:11, fontWeight:700,
              color:'#85B7EB', padding:'6px 0' }}>{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
          {Array.from({ length: primeiroDia }).map((_,i) => <div key={`e-${i}`} />)}
          {Array.from({ length: totalDias }).map((_,i) => {
            const dia = i + 1;
            const tasks = cardsNoDia(dia);
            const hoje = new Date();
            const isHoje = dia === hoje.getDate() && mes === hoje.getMonth()+1 && ano === hoje.getFullYear();
            return (
              <div key={dia} style={{
                minHeight: 72, borderRadius:8, padding:'6px 6px 4px',
                background: isHoje ? 'rgba(24,95,165,0.08)' : 'rgba(12,68,124,0.03)',
                border: isHoje ? '2px solid #185FA5' : '1.5px solid rgba(12,68,124,0.07)',
              }}>
                <div style={{ fontSize:12, fontWeight: isHoje ? 800 : 500,
                  color: isHoje ? '#185FA5' : '#444441', marginBottom:4 }}>{dia}</div>
                {tasks.map(t => (
                  <div key={t.id} style={{
                    background: colColors[t.col]+'22', color: colColors[t.col],
                    fontSize:10, fontWeight:700, borderRadius:4, padding:'2px 5px',
                    marginBottom:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                  }} title={t.titulo}>
                    {t.titulo}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display:'flex', gap:16, marginTop:16 }}>
          {Object.entries(colColors).map(([col,color]) => (
            <div key={col} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:10, height:10, borderRadius:3, background:color }}/>
              <span style={{ fontSize:12, color:'#444441' }}>{col}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function Tarefas() {
  const [colunas, setColunas] = useState(tarefasData);
  const [view, setView] = useState('kanban');
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [activeCol, setActiveCol] = useState('A Fazer');

  const taskFields = [
    { name: 'titulo', label: 'Título da Tarefa', type: 'text' },
    { name: 'prioridade', label: 'Prioridade', type: 'select', options: [
      { value: 'ALTA', label: 'Alta' },
      { value: 'MÉDIA', label: 'Média' },
      { value: 'BAIXA', label: 'Baixa' },
    ]},
    { name: 'responsavel', label: 'Responsável', type: 'text' },
    { name: 'prazo', label: 'Prazo (dd/mm/aaaa)', type: 'text' },
  ];

  const handleSave = (formData) => {
    if (editingCard) {
      setColunas(prev => {
        const next = { ...prev };
        const col = editingCard.col;
        next[col] = next[col].map(c => c.id === editingCard.id ? { ...c, ...formData } : c);
        return next;
      });
    } else {
      const novo = {
        id: Date.now(),
        ...formData
      };
      setColunas(prev => ({ ...prev, [activeCol]: [...prev[activeCol], novo] }));
    }
  };

  const openAddModal = (col) => {
    setActiveCol(col);
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const openEditModal = (card, col) => {
    setEditingCard({ ...card, col });
    setIsModalOpen(true);
  };

  const views = [
    { id:'kanban',   label:'🗂️ Cards'     },
    { id:'list',     label:'📋 Lista'     },
    { id:'calendar', label:'📅 Calendário' },
  ];

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:18, gap:6 }}>
        {views.map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            style={{
              padding:'7px 16px', borderRadius:8, fontSize:13, fontWeight:600,
              cursor:'pointer', border:'1.5px solid',
              borderColor: view === v.id ? '#185FA5' : 'rgba(12,68,124,0.15)',
              background: view === v.id ? '#185FA5' : '#fff',
              color: view === v.id ? '#fff' : '#444441',
              transition:'0.2s',
            }}>
            {v.label}
          </button>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title={editingCard ? 'Editar Tarefa' : `Nova Tarefa - ${activeCol}`}
        initialData={editingCard}
        fields={taskFields}
      />

      {view === 'kanban' && (
        <KanbanView 
          colunas={colunas} 
          setColunas={setColunas}
          dragging={dragging} 
          setDragging={setDragging}
          dragOver={dragOver} 
          setDragOver={setDragOver} 
          onAdd={openAddModal}
          onEdit={openEditModal}
        />
      )}
      {view === 'list' && <ListView colunas={colunas} setColunas={setColunas} onEdit={openEditModal} />}
      {view === 'calendar' && <CalendarView colunas={colunas} />}
    </div>
  );
}
