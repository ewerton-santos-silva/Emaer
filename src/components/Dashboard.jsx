import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { kpiData, faturamentoData, projetosRecentes } from '../data/mockData';
import { StatusBadge, formatCurrency } from './ui/Shared';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff', border: '1px solid rgba(12,68,124,0.15)',
        borderRadius: 8, padding: '10px 14px',
        boxShadow: '0 4px 12px rgba(12,68,124,0.1)',
      }}>
        <p style={{ color: 'var(--emaer-azul-claro)', fontSize: 12, fontWeight: 700 }}>{label}</p>
        <p style={{ color: 'var(--emaer-azul-principal)', fontWeight: 800, fontSize: 16 }}>
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard({ onNavigate, projects }) {
  const kpis = [
    { key: 'faturado', label: 'FATURADO', value: 'R$ 201.000,00', sub: '6 projetos', color: 'var(--emaer-azul-medio)', borderColor: 'var(--emaer-azul-medio)' },
    { key: 'recebido', label: 'RECEBIDO', value: 'R$ 117.500,00', sub: 'Confirmado', color: 'var(--emaer-verde)', borderColor: 'var(--emaer-verde)' },
    { key: 'aReceber', label: 'A RECEBER', value: 'R$ 83.500,00', sub: 'Pendente', color: 'var(--emaer-ambar)', borderColor: 'var(--emaer-ambar)' },
    { key: 'vencido', label: 'VENCIDO', value: 'R$ 3.250,00', sub: 'Atrasado', color: '#ff4444', borderColor: '#ff4444' },
  ];

  const recent = projects ? Object.values(projects).flat().slice(0, 6) : projetosRecentes;

  return (
    <>
      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <div key={kpi.key} className="kpi-card" style={{ borderTopColor: kpi.borderColor }}>
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="kpi-sub">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="two-col-grid">
        {/* Projetos Recentes */}
        <div className="card">
          <div className="card-body">
            <div className="section-header">
              <div className="section-title">
                Projetos Recentes
                <span className="badge badge-azul-claro" style={{ marginLeft: 10 }}>{recent.length} total</span>
              </div>
              <button className="btn-secondary" style={{ fontSize: 12, padding: '5px 12px' }}
                onClick={() => onNavigate('carteira-projetos')}>
                Ver todos →
              </button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Projeto</th>
                    <th>Cliente</th>
                    <th>Valor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.nome}</td>
                      <td>{p.cliente}</td>
                      <td>{formatCurrency(p.valor)}</td>
                      <td><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Faturamento Chart */}
        <div className="card">
          <div className="card-body">
            <div className="section-header">
              <div className="section-title">Faturamento (6M)</div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--emaer-azul-claro)', marginBottom: 16 }}>
              Últimos 6 meses — valores em R$
            </p>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={faturamentoData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(12,68,124,0.08)" vertical={false} />
                <XAxis
                  dataKey="mes"
                  tick={{ fill: 'var(--emaer-azul-claro)', fontSize: 12, fontWeight: 600 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--emaer-azul-claro)', fontSize: 11 }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(12,68,124,0.05)' }} />
                <Bar dataKey="valor" fill="var(--emaer-azul-medio)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
