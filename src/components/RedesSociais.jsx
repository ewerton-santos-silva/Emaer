import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from 'recharts';
import { redesSociaisData } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff', border: '1px solid rgba(12,68,124,0.15)',
        borderRadius: 8, padding: '10px 14px',
        boxShadow: '0 4px 12px rgba(12,68,124,0.1)',
      }}>
        <p style={{ color: '#85B7EB', fontSize: 12, fontWeight: 700 }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, fontWeight: 700, fontSize: 14 }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RedesSociais() {
  const currentTotal = redesSociaisData.seguidores[redesSociaisData.seguidores.length - 1];
  const totalFollowers = currentTotal.instagram + currentTotal.linkedin + currentTotal.facebook;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {[
          { label: 'TOTAL SEGUIDORES', value: totalFollowers.toLocaleString(), color: '#0C447C', border: '#0C447C' },
          { label: 'INSTAGRAM', value: currentTotal.instagram.toLocaleString(), color: '#E1306C', border: '#E1306C' },
          { label: 'LINKEDIN', value: currentTotal.linkedin.toLocaleString(), color: '#0077B5', border: '#0077B5' },
          { label: 'FACEBOOK', value: currentTotal.facebook.toLocaleString(), color: '#1877F2', border: '#1877F2' },
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ borderTopColor: k.border }}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color: k.color, fontSize: 26 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="two-col-grid">
        {/* Growth Chart */}
        <div className="card">
          <div className="card-body">
            <div className="section-title" style={{ marginBottom: 4 }}>Crescimento de Seguidores</div>
            <p style={{ fontSize: 12, color: '#85B7EB', marginBottom: 18 }}>Evolução mensal por rede</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={redesSociaisData.seguidores}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(12,68,124,0.08)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: '#85B7EB', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#85B7EB', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="instagram" name="Instagram" stroke="#E1306C" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="linkedin" name="LinkedIn" stroke="#0077B5" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="facebook" name="Facebook" stroke="#1877F2" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest Posts */}
        <div className="card">
          <div className="card-body">
            <div className="section-header" style={{ marginBottom: 16 }}>
              <div className="section-title">Últimas Postagens</div>
              <button className="btn-primary" onClick={() => alert('Nova postagem planejada!')}>+ Agendar Post</button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Rede</th>
                    <th>Tipo</th>
                    <th>Engaj.</th>
                    <th>Alcance</th>
                  </tr>
                </thead>
                <tbody>
                  {redesSociaisData.postsHoje.map((post) => (
                    <tr key={post.id}>
                      <td style={{ fontWeight: 600 }}>{post.rede}</td>
                      <td>
                         <span style={{
                          background: '#EBF3FB', color: '#185FA5',
                          padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                        }}>{post.tipo}</span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#2E9E5B' }}>{post.engajamento}</td>
                      <td style={{ fontWeight: 600, color: '#0C447C' }}>{post.alcance}</td>
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
