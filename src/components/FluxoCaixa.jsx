import { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { formatCurrency } from './ui/Shared';

const monthlyData = [
  { name: 'Jan', valor: 45000 }, { name: 'Fev', valor: 52000 }, { name: 'Mar', valor: 48000 }, { name: 'Abr', valor: 153400 }
];

const initialClosedProjects = [
  { id: 1, nome: 'Samel', data: '24/04/2026', parcelas: 2, valor: 73500, aReceber: 36750, status: 'Pendente', vencido: false },
  { id: 2, nome: 'Casa Aline', data: '24/04/2026', parcelas: 2, valor: 5000, aReceber: 2500, status: 'Pendente', vencido: false },
  { id: 3, nome: 'Casa Alphaville Estevão Salvador', data: '24/04/2026', parcelas: 2, valor: 12000, aReceber: 12000, status: 'A Receber', vencido: true },
  { id: 4, nome: 'Casa Cleiton', data: '24/04/2026', parcelas: 1, valor: 11900, aReceber: 0, status: 'A Receber', vencido: false },
  { id: 5, nome: 'Casa Carol', data: '20/04/2026', parcelas: 1, valor: 51000, aReceber: 0, status: 'Pago', vencido: false },
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

  const filteredProjects = initialClosedProjects.filter(p => {
    if (activeTab === 'Todos') return true;
    if (activeTab === 'Somente Vencidos') return p.vencido;
    if (activeTab === 'Sem Vencimento') return !p.vencido;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
      {/* Top Header with Month Picker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 10, background: 'rgba(0,0,0,0.05)', padding: 6, borderRadius: 10 }}>
          {['Todos', 'Mês', 'Últimos 12 meses', 'Período', 'Somente Vencidos', 'Sem Vencimento'].map(t => (
            <button 
              key={t} 
              onClick={() => setActiveTab(t)}
              style={{
                padding: '6px 14px', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700,
                background: activeTab === t ? 'var(--emaer-azul-principal)' : 'transparent',
                color: activeTab === t ? '#fff' : '#666', cursor: 'pointer'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <button 
            className="btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 15px' }}
            onClick={() => setShowMonthPicker(!showMonthPicker)}
          >
            <span>📅</span>
            <span>{selectedMonth} {selectedYear}</span>
          </button>

          {showMonthPicker && (
            <div className="card" style={{ 
              position: 'absolute', top: '110%', right: 0, zIndex: 1000, 
              width: 250, boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              padding: 15
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <button onClick={() => setSelectedYear(y => y-1)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>◀</button>
                <span style={{ fontWeight: 800, color: 'var(--emaer-azul-principal)' }}>{selectedYear}</span>
                <button onClick={() => setSelectedYear(y => y+1)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>▶</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {meses.map(m => (
                  <button 
                    key={m}
                    onClick={() => { setSelectedMonth(m); setShowMonthPicker(false); }}
                    style={{
                      padding: '8px 4px', fontSize: 11, borderRadius: 4, border: '1px solid #eee',
                      background: selectedMonth === m ? 'var(--emaer-ambar)' : '#fff',
                      color: selectedMonth === m ? '#fff' : '#666',
                      fontWeight: selectedMonth === m ? 700 : 400,
                      cursor: 'pointer'
                    }}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 25 }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 15 }}>
            {[
              { label: 'FATURADO', value: 153400, color: 'var(--emaer-azul-medio)' },
              { label: 'RECEBIDO', value: 90250, color: 'var(--emaer-verde)' },
              { label: 'A RECEBER', value: 63150, color: 'var(--emaer-ambar)' },
              { label: 'VENCIDO', value: 12000, color: '#ff4444' },
            ].map(k => (
              <div key={k.label} className="card" style={{ padding: 18 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#999', marginBottom: 8 }}>{k.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{formatCurrency(k.value)}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--emaer-azul-claro)', fontWeight: 700 }}>
                  PROJETOS FECHADOS — STATUS FINANCEIRO
                </h3>
              </div>
              <div style={{ display: 'grid', gap: 15 }}>
                {filteredProjects.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15, borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                      <span style={{ fontSize: 18 }}>{p.status === 'Pago' ? '✅' : '🕒'}</span>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--emaer-azul-principal)', fontSize: 14 }}>{p.nome}</div>
                        <div style={{ fontSize: 11, color: '#999' }}>{p.data} • {p.parcelas} parcelas</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: 'var(--emaer-azul-medio)', fontSize: 14 }}>{formatCurrency(p.valor)}</div>
                      {p.aReceber > 0 && <div style={{ fontSize: 11, color: p.vencido ? '#ff4444' : 'var(--emaer-ambar)', fontWeight: 700 }}>{p.vencido ? 'Vencido: ' : 'A receber: '}{formatCurrency(p.aReceber)}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
          <div className="card">
            <div className="card-body" style={{ padding: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                <h4 style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--emaer-azul-claro)' }}>DESEMPENHO</h4>
                <span>📈</span>
              </div>
              <div style={{ height: 100 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--emaer-verde)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--emaer-verde)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="valor" stroke="var(--emaer-verde)" fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginTop: 15, fontSize: 12, fontWeight: 700, color: 'var(--emaer-verde)' }}>
                {formatCurrency(153400)}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body" style={{ display: 'grid', gap: 15 }}>
              <div>
                <div style={{ fontSize: 10, color: '#999' }}>MÉDIA MENSAL</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--emaer-azul-principal)' }}>{formatCurrency(12783.33)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
