import { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { formatCurrency } from './ui/Shared';

const monthlyData = [
  { name: 'Jan', valor: 45000 }, { name: 'Fev', valor: 52000 }, { name: 'Mar', valor: 48000 }, { name: 'Abr', valor: 153400 }
];

const closedProjects = [
  { id: 1, nome: 'Samel', data: '24/04/2026', parcelas: 2, valor: 73500, aReceber: 36750, status: 'Pendente' },
  { id: 2, nome: 'Casa Aline', data: '24/04/2026', parcelas: 2, valor: 5000, aReceber: 2500, status: 'Pendente' },
  { id: 3, nome: 'Casa Alphaville Estevão Salvador', data: '24/04/2026', parcelas: 2, valor: 12000, aReceber: 12000, status: 'A Receber' },
  { id: 4, nome: 'Casa Cleiton', data: '24/04/2026', parcelas: 1, valor: 11900, aReceber: 0, status: 'A Receber' },
  { id: 5, nome: 'Casa Carol', data: '20/04/2026', parcelas: 1, valor: 51000, aReceber: 0, status: 'Pago' },
];

export default function FluxoCaixa() {
  const [filter, setFilter] = useState('Todos');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: 10, background: 'rgba(0,0,0,0.05)', padding: 6, borderRadius: 10, alignSelf: 'flex-start' }}>
        {['Todos', 'Mês', 'Últimos 12 meses', 'Período'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 14px', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700,
            background: filter === f ? 'var(--emaer-azul-principal)' : 'transparent',
            color: filter === f ? '#fff' : '#666', cursor: 'pointer'
          }}>{f}</button>
        ))}
        <div style={{ width: 1, background: '#ccc', margin: '0 5px' }} />
        {['Somente Vencidos', 'Sem Vencimento'].map(f => (
          <button key={f} style={{ padding: '6px 14px', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, color: '#666', background: 'transparent' }}>{f}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 25 }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 15 }}>
            {[
              { label: 'FATURADO', value: 153400, sub: '5 contratos fechados', color: 'var(--emaer-azul-medio)' },
              { label: 'RECEBIDO', value: 90250, sub: 'pagamentos confirmados', color: 'var(--emaer-verde)' },
              { label: 'A RECEBER', value: 63150, sub: 'total a receber', color: 'var(--emaer-ambar)' },
              { label: 'VENCIDO', value: 0, sub: 'prazo expirado', color: '#ff4444' },
            ].map(k => (
              <div key={k.label} className="card" style={{ padding: 18 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#999', marginBottom: 8 }}>{k.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{formatCurrency(k.value)}</div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Project List */}
          <div className="card">
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--emaer-azul-claro)', fontWeight: 700 }}>PROJETOS FECHADOS — STATUS FINANCEIRO</h3>
                <span style={{ fontSize: 11, color: '#999' }}>5 projetos</span>
              </div>
              <div style={{ display: 'grid', gap: 15 }}>
                {closedProjects.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15, borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                      <span style={{ fontSize: 18 }}>{p.status === 'Pago' ? '✅' : '🕒'}</span>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--emaer-azul-principal)', fontSize: 14 }}>{p.nome}</div>
                        <div style={{ fontSize: 11, color: '#999' }}>Fechado em {p.data} • {p.parcelas} parcelas</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: 'var(--emaer-azul-medio)', fontSize: 14 }}>{formatCurrency(p.valor)}</div>
                      {p.aReceber > 0 && <div style={{ fontSize: 11, color: 'var(--emaer-ambar)', fontWeight: 700 }}>A receber: {formatCurrency(p.aReceber)}</div>}
                      {p.status === 'Pago' && <div style={{ fontSize: 11, color: 'var(--emaer-verde)', fontWeight: 700 }}>Pago</div>}
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
                <h4 style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--emaer-azul-claro)' }}>ÚLTIMOS 12 MESES</h4>
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
              <div>
                <div style={{ fontSize: 10, color: '#999' }}>MELHOR MÊS</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--emaer-verde)' }}>abr/26 — {formatCurrency(153400)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
