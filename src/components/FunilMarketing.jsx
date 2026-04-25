import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';
import { funilMarketingData, funilMarketingBarData } from '../data/mockData';

const barColors = ['#0C447C', '#185FA5', '#2E7DC5', '#5A9AD8', '#85B7EB'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff', border: '1px solid rgba(12,68,124,0.15)',
        borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 12px rgba(12,68,124,0.1)',
      }}>
        <p style={{ color: '#85B7EB', fontSize: 12, fontWeight: 700 }}>{label}</p>
        <p style={{ color: '#0C447C', fontWeight: 800, fontSize: 16 }}>{payload[0].value} leads</p>
      </div>
    );
  }
  return null;
};

export default function FunilMarketing() {
  const totalLeads = funilMarketingData.reduce((a, c) => a + c.leads, 0);
  const totalImpress = funilMarketingData.reduce((a, c) => a + c.impressoes, 0);
  const totalCliques = funilMarketingData.reduce((a, c) => a + c.cliques, 0);
  const custoPorLead = funilMarketingData.filter(c => c.custoPorLead > 0)
    .reduce((a, c) => a + c.custoPorLead, 0) /
    funilMarketingData.filter(c => c.custoPorLead > 0).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {[
          { label: 'IMPRESSÕES', value: totalImpress.toLocaleString('pt-BR'), color: '#0C447C', border: '#0C447C' },
          { label: 'CLIQUES', value: totalCliques.toLocaleString('pt-BR'), color: '#185FA5', border: '#185FA5' },
          { label: 'LEADS GERADOS', value: totalLeads, color: '#EF9F27', border: '#EF9F27' },
          { label: 'CUSTO / LEAD MÉD.', value: `R$ ${Math.round(custoPorLead)}`, color: '#85B7EB', border: '#85B7EB' },
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ borderTopColor: k.border }}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color: k.color, fontSize: 26 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="two-col-grid">
        {/* Gráfico de barras por canal */}
        <div className="card">
          <div className="card-body">
            <div className="section-title" style={{ marginBottom: 4 }}>Leads por Canal</div>
            <p style={{ fontSize: 12, color: '#85B7EB', marginBottom: 18 }}>Comparativo de canais de aquisição</p>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={funilMarketingBarData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(12,68,124,0.08)" vertical={false} />
                <XAxis dataKey="canal" tick={{ fill: '#85B7EB', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#85B7EB', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(12,68,124,0.05)' }} />
                <Bar dataKey="leads" radius={[6, 6, 0, 0]}>
                  {funilMarketingBarData.map((_, i) => (
                    <Cell key={i} fill={barColors[i % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabela detalhada */}
        <div className="card">
          <div className="card-body">
            <div className="section-title" style={{ marginBottom: 16 }}>Métricas por Canal</div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Canal</th>
                    <th>Impressões</th>
                    <th>Cliques</th>
                    <th>Leads</th>
                    <th>CPL</th>
                  </tr>
                </thead>
                <tbody>
                  {funilMarketingData.map((c, i) => (
                    <tr key={c.canal}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: 3, background: barColors[i % barColors.length] }} />
                          <span style={{ fontWeight: 600 }}>{c.canal}</span>
                        </div>
                      </td>
                      <td>{c.impressoes > 0 ? c.impressoes.toLocaleString('pt-BR') : '—'}</td>
                      <td>{c.cliques > 0 ? c.cliques.toLocaleString('pt-BR') : '—'}</td>
                      <td style={{ fontWeight: 800, color: '#0C447C' }}>{c.leads}</td>
                      <td style={{ color: c.custoPorLead === 0 ? '#2E9E5B' : '#EF9F27', fontWeight: 700 }}>
                        {c.custoPorLead === 0 ? 'Grátis' : `R$ ${c.custoPorLead}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
