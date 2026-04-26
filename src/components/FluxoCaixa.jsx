import { useState, useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { formatCurrency } from './ui/Shared';

const allProjectsMock = [
  { id: 1, nome: 'Samel', data: '24/04/2026', valor: 73500, recebido: 36750, mes: 'Abril', ano: 2026, status: 'Pendente', vencido: false },
  { id: 2, nome: 'Casa Aline', data: '24/04/2026', valor: 5000, recebido: 2500, mes: 'Abril', ano: 2026, status: 'Pendente', vencido: false },
  { id: 3, nome: 'Casa Alphaville', data: '24/04/2026', valor: 12000, recebido: 0, mes: 'Abril', ano: 2026, status: 'A Receber', vencido: true },
  { id: 4, nome: 'Casa Cleiton', data: '15/03/2026', valor: 11900, recebido: 11900, mes: 'Março', ano: 2026, status: 'Pago', vencido: false },
  { id: 5, nome: 'Casa Carol', data: '20/03/2026', valor: 51000, recebido: 51000, mes: 'Março', ano: 2026, status: 'Pago', vencido: false },
];

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function FluxoCaixa() {
  const [activeTab, setActiveTab] = useState('Todos');
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Abril');
  const [selectedYear, setSelectedYear] = useState(2026);

  const filteredProjects = useMemo(() => {
    return allProjectsMock.filter(p => {
      // Time Filter
      if (activeTab === 'Mês') {
        if (p.mes !== selectedMonth || p.ano !== selectedYear) return false;
      }
      // Status Filter
      if (activeTab === 'Somente Vencidos' && !p.vencido) return false;
      if (activeTab === 'Sem Vencimento' && p.vencido) return false;
      
      return true;
    });
  }, [activeTab, selectedMonth, selectedYear]);

  const kpis = useMemo(() => {
    const faturado = filteredProjects.reduce((a, b) => a + b.valor, 0);
    const recebido = filteredProjects.reduce((a, b) => a + b.recebido, 0);
    const vencido = filteredProjects.filter(p => p.vencido).reduce((a, b) => a + (b.valor - b.recebido), 0);
    const aReceber = faturado - recebido;
    
    return { faturado, recebido, aReceber, vencido, count: filteredProjects.length };
  }, [filteredProjects]);

  const monthlyChartData = [
    { name: 'Jan', valor: 45000 }, { name: 'Fev', valor: 52000 }, 
    { name: 'Mar', valor: 62900 }, { name: 'Abr', valor: 90500 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 10, background: 'rgba(0,0,0,0.05)', padding: 6, borderRadius: 10 }}>
          {['Todos', 'Mês', 'Somente Vencidos', 'Sem Vencimento'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: '6px 14px', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700,
              background: activeTab === t ? 'var(--emaer-azul-principal)' : 'transparent',
              color: activeTab === t ? '#fff' : '#666', cursor: 'pointer'
            }}>{t}</button>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => setShowMonthPicker(!showMonthPicker)}>
            <span>📅</span> <span>{selectedMonth} {selectedYear}</span>
          </button>
          {showMonthPicker && (
            <div className="card" style={{ position: 'absolute', top: '110%', right: 0, zIndex: 1000, width: 250, padding: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                <button onClick={() => setSelectedYear(y => y-1)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>◀</button>
                <span style={{ fontWeight: 800 }}>{selectedYear}</span>
                <button onClick={() => setSelectedYear(y => y+1)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>▶</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
                {meses.map(m => (
                  <button key={m} onClick={() => { setSelectedMonth(m); setShowMonthPicker(false); setActiveTab('Mês'); }} style={{
                    padding: '5px', fontSize: 10, borderRadius: 4, border: '1px solid #eee',
                    background: selectedMonth === m ? 'var(--emaer-ambar)' : '#fff',
                    color: selectedMonth === m ? '#fff' : '#666', cursor: 'pointer'
                  }}>{m.slice(0, 3)}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 25 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
          {/* KPI Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 15 }}>
            {[
              { label: 'FATURADO', value: kpis.faturado, color: 'var(--emaer-azul-medio)' },
              { label: 'RECEBIDO', value: kpis.recebido, color: 'var(--emaer-verde)' },
              { label: 'A RECEBER', value: kpis.aReceber, color: 'var(--emaer-ambar)' },
              { label: 'VENCIDO', value: kpis.vencido, color: '#ff4444' },
            ].map(k => (
              <div key={k.label} className="card" style={{ padding: 18 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#999', marginBottom: 8 }}>{k.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{formatCurrency(k.value)}</div>
              </div>
            ))}
          </div>

          {/* Project List */}
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--emaer-azul-claro)', marginBottom: 20 }}>
                Projetos do Período ({activeTab === 'Mês' ? selectedMonth : activeTab})
              </h3>
              <div style={{ display: 'grid', gap: 15 }}>
                {filteredProjects.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15, borderBottom: '1px solid #f0f0f0' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--emaer-azul-principal)' }}>{p.nome}</div>
                      <div style={{ fontSize: 11, color: '#999' }}>{p.data} • {p.status}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800 }}>{formatCurrency(p.valor)}</div>
                      <div style={{ fontSize: 11, color: p.vencido ? 'red' : 'green' }}>Rec: {formatCurrency(p.recebido)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
          <div className="card">
            <div className="card-body">
              <h4 style={{ fontSize: 11, color: '#999', marginBottom: 15 }}>TENDÊNCIA ANUAL</h4>
              <div style={{ height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyChartData}>
                    <Area type="monotone" dataKey="valor" stroke="var(--emaer-verde)" fill="rgba(46, 158, 91, 0.1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginTop: 15, fontSize: 14, fontWeight: 800, color: 'var(--emaer-verde)' }}>
                Total: {formatCurrency(kpis.faturado)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
