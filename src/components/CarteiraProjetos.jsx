import { useState } from 'react';
import { carteiraProjetosData } from '../data/mockData';
import { StatusBadge, formatCurrency } from './ui/Shared';

export default function CarteiraProjetos() {
  const [projetos, setProjetos] = useState(carteiraProjetosData);

  const addProjeto = () => {
    const novo = {
      id: Date.now(),
      nome: 'Edifício Horizonte',
      cliente: 'Incorporadora Silva',
      valor: 850000,
      progresso: 10,
      status: 'EM ANDAMENTO'
    };
    setProjetos([...projetos, novo]);
  };

  const total = projetos.reduce((a, p) => a + p.valor, 0);

  return (
    <>
      {/* Header stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 22 }}>
        {[
          { label: 'TOTAL DE PROJETOS', value: projetos.length, isNum: true, color: '#0C447C', border: '#0C447C' },
          { label: 'VALOR TOTAL', value: formatCurrency(total), isNum: false, color: '#185FA5', border: '#185FA5' },
          { label: 'CONCLUÍDOS', value: projetos.filter(p => p.progresso === 100).length, isNum: true, color: '#2E9E5B', border: '#2E9E5B' },
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ borderTopColor: k.border }}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color: k.color, fontSize: k.isNum ? 36 : 22 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={addProjeto}>+ Novo Projeto na Carteira</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 18 }}>
        {projetos.map((p) => (
          <div key={p.id} className="card" style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(12,68,124,0.14)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}>
            <div style={{ height: 4, background: p.progresso === 100 ? '#2E9E5B' : '#185FA5' }} />
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0C447C', fontSize: 16, marginBottom: 4 }}>{p.nome}</div>
                  <div style={{ fontSize: 13, color: '#85B7EB' }}>👤 {p.cliente}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>

              <div style={{ fontWeight: 800, color: '#185FA5', fontSize: 20, marginBottom: 14 }}>
                {formatCurrency(p.valor)}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#85B7EB', fontWeight: 600 }}>Progresso</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: p.progresso === 100 ? '#2E9E5B' : '#185FA5' }}>
                    {p.progresso}%
                  </span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill"
                    style={{
                      width: `${p.progresso}%`,
                      background: p.progresso === 100 ? '#2E9E5B' : '#185FA5',
                    }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
                <button style={{
                  background: '#EBF3FB', border: 'none', borderRadius: 6,
                  padding: '5px 12px', color: '#185FA5', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                }}>Detalhes</button>
                <button style={{
                  background: '#0C447C', border: 'none', borderRadius: 6,
                  padding: '5px 12px', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                }}>Editar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
