import { useState } from 'react';
import { mentoriaData } from '../data/mockData';
import Modal from './ui/Modal';

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
               'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function getDiasDoMes(ano, mes) { return new Date(ano, mes, 0).getDate(); }
function getPrimeiroDiaSemana(ano, mes) { return new Date(ano, mes - 1, 1).getDay(); }

export default function Mentoria() {
  const [sessoes, setSessoes] = useState(mentoriaData);
  const [mesSel, setMesSel] = useState(4); 
  const [anoSel, setAnoSel] = useState(2026);
  const [sessaoSel, setSessaoSel] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fields = [
    { name: 'dia', label: 'Dia', type: 'number' },
    { name: 'mes', label: 'Mês', type: 'number' },
    { name: 'ano', label: 'Ano', type: 'number' },
    { name: 'mentor', label: 'Mentor', type: 'text' },
    { name: 'tema', label: 'Tema', type: 'text' },
    { name: 'anotacoes', label: 'Anotações', type: 'text' },
  ];

  const handleSave = (formData) => {
    const diaNum = parseInt(formData.dia);
    const mesNum = parseInt(formData.mes);
    const anoNum = parseInt(formData.ano);
    
    if (editingItem) {
      setSessoes(prev => prev.map(s => s.id === editingItem.id ? { ...s, ...formData, dia: diaNum, mes: mesNum, ano: anoNum } : s));
    } else {
      const novo = {
        id: Date.now(),
        ...formData,
        dia: diaNum, mes: mesNum, ano: anoNum
      };
      setSessoes([...sessoes, novo]);
    }
  };

  const openAdd = () => {
    setEditingItem({ dia: new Date().getDate(), mes: mesSel, ano: anoSel });
    setIsModalOpen(true);
  };

  const openEdit = (s) => {
    setEditingItem(s);
    setIsModalOpen(true);
  };

  const totalDias = getDiasDoMes(anoSel, mesSel);
  const primeiroDia = getPrimeiroDiaSemana(anoSel, mesSel);
  const sessoesMes = sessoes.filter(s => s.mes === mesSel && s.ano === anoSel);
  const diasComSessao = sessoesMes.map(s => s.dia);

  return (
    <div className="two-col-grid">
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title={editingItem?.id ? 'Editar Sessão' : 'Nova Sessão'}
        initialData={editingItem}
        fields={fields}
      />

      <div className="card">
        <div className="card-body">
          <div className="section-header">
            <div className="section-title">Calendário de Sessões</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" style={{ padding: '5px 10px', fontSize: 12 }}
                onClick={() => { let m = mesSel - 1, a = anoSel; if (m < 1) { m = 12; a--; } setMesSel(m); setAnoSel(a); }}>‹</button>
              <span style={{ fontWeight: 700, color: '#0C447C', fontSize: 14, padding: '5px 8px' }}>
                {MESES[mesSel - 1]} {anoSel}
              </span>
              <button className="btn-secondary" style={{ padding: '5px 10px', fontSize: 12 }}
                onClick={() => { let m = mesSel + 1, a = anoSel; if (m > 12) { m = 1; a++; } setMesSel(m); setAnoSel(a); }}>›</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
            {diasSemana.map((d) => <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#85B7EB', padding: '6px 0' }}>{d}</div>)}
            {Array.from({ length: primeiroDia }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: totalDias }).map((_, i) => {
              const dia = i + 1;
              const temSessao = diasComSessao.includes(dia);
              return (
                <div key={dia} style={{
                  textAlign: 'center', padding: '8px 4px', borderRadius: 8, fontSize: 13,
                  background: temSessao ? '#EF9F27' : 'transparent',
                  color: temSessao ? '#fff' : '#444441',
                  cursor: temSessao ? 'pointer' : 'default',
                }} onClick={() => { if(temSessao) { const s = sessoesMes.find(x => x.dia === dia); setSessaoSel(s); } }}>
                  {dia}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontWeight: 700, color: '#0C447C', fontSize: 16 }}>Sessões do Mês</div>
        {sessoesMes.map((s) => (
          <div key={s.id} className="card" style={{ borderLeft: `4px solid ${sessaoSel?.id === s.id ? '#EF9F27' : '#185FA5'}`, cursor: 'pointer' }}
            onClick={() => setSessaoSel(s)}>
            <div className="card-body" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, color: '#0C447C' }}>{s.tema}</span>
                <span className="badge badge-ambar">{`${String(s.dia).padStart(2,'0')}/${String(s.mes).padStart(2,'0')}/${s.ano}`}</span>
              </div>
              <div style={{ fontSize: 13, color: '#85B7EB', marginBottom: 10 }}>👨‍🏫 {s.mentor}</div>
              <div style={{ display:'flex', gap:8 }}>
                <button className="btn-secondary" style={{ padding:'2px 8px', fontSize:11 }} onClick={(e) => { e.stopPropagation(); openEdit(s); }}>Editar</button>
              </div>
            </div>
          </div>
        ))}
        <button className="btn-primary" onClick={openAdd}>+ Nova Sessão</button>
      </div>
    </div>
  );
}
