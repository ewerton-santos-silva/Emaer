import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { ticketMedioData, receitaRecorrenteData, npsData, funilVendasData } from '../data/mockData';
import { formatCurrency } from './ui/Shared';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff', border: '1px solid rgba(12,68,124,0.15)',
        borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 12px rgba(12,68,124,0.1)',
      }}>
        <p style={{ color: '#85B7EB', fontSize: 12, fontWeight: 700 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.color, fontWeight: 700, fontSize: 14 }}>
            {p.name}: {typeof p.value === 'number' && p.value > 1000 ? formatCurrency(p.value) : `${p.value}${p.name?.includes('%') ? '%' : ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Gauge using Pie
function GaugeChart({ value, label, color }) {
  const data = [
    { value, fill: color },
    { value: 100 - value, fill: 'rgba(12,68,124,0.08)' },
  ];
  return (
    <div style={{ textAlign: 'center' }}>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={data} cx="50%" cy="80%" startAngle={180} endAngle={0}
            innerRadius={55} outerRadius={75} dataKey="value" paddingAngle={2}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ marginTop: -30 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}%</div>
        <div style={{ fontSize: 12, color: '#85B7EB', fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  );
}

const npsColors = ['#2E9E5B', '#85B7EB', '#EF9F27'];

export default function Indicadores() {
  const taxaConversao = Math.round(
    (funilVendasData[funilVendasData.length - 1].quantidade / funilVendasData[0].quantidade) * 100
  );
  const nps = npsData[0].valor - npsData[2].valor; // NPS = % promotores - % detratores

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Top KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {[
          { label: 'TICKET MÉDIO', value: formatCurrency(40200), color: '#0C447C', border: '#0C447C' },
          { label: 'TAXA CONVERSÃO', value: `${taxaConversao}%`, color: '#185FA5', border: '#185FA5' },
          { label: 'NPS', value: nps, color: '#2E9E5B', border: '#2E9E5B' },
          { label: 'RECEITA RECOR.', value: formatCurrency(35000), color: '#EF9F27', border: '#EF9F27' },
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ borderTopColor: k.border }}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color: k.color, fontSize: 22 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="two-col-grid">
        {/* Ticket Médio — Linha */}
        <div className="card">
          <div className="card-body">
            <div className="section-title" style={{ marginBottom: 4 }}>Ticket Médio (6M)</div>
            <p style={{ fontSize: 12, color: '#85B7EB', marginBottom: 18 }}>Evolução do valor médio por projeto</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ticketMedioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(12,68,124,0.08)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: '#85B7EB', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#85B7EB', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="valor" name="Ticket"
                  stroke="#185FA5" strokeWidth={2.5} dot={{ fill: '#185FA5', r: 4 }}
                  activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gauges de taxa de conversão */}
        <div className="card">
          <div className="card-body">
            <div className="section-title" style={{ marginBottom: 8 }}>Taxa de Conversão</div>
            <p style={{ fontSize: 12, color: '#85B7EB', marginBottom: 8 }}>Por estágio do funil</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <GaugeChart value={58} label="Lead → Qualif." color="#EF9F27" />
              <GaugeChart value={33} label="Qualif. → Prop." color="#0C447C" />
              <GaugeChart value={17} label="Prop. → Negoc." color="#185FA5" />
              <GaugeChart value={taxaConversao} label="Conversão Global" color="#2E9E5B" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="two-col-grid">
        {/* Receita Recorrente — Área */}
        <div className="card">
          <div className="card-body">
            <div className="section-title" style={{ marginBottom: 4 }}>Receita Recorrente</div>
            <p style={{ fontSize: 12, color: '#85B7EB', marginBottom: 18 }}>Contratos e serviços mensais</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={receitaRecorrenteData}>
                <defs>
                  <linearGradient id="gradRecorrente" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#185FA5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#185FA5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(12,68,124,0.08)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: '#85B7EB', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#85B7EB', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="receita" name="Receita"
                  stroke="#185FA5" strokeWidth={2.5} fill="url(#gradRecorrente)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* NPS — Barra horizontal */}
        <div className="card">
          <div className="card-body">
            <div className="section-title" style={{ marginBottom: 4 }}>NPS — Net Promoter Score</div>
            <p style={{ fontSize: 12, color: '#85B7EB', marginBottom: 20 }}>Satisfação e lealdade dos clientes</p>

            <div style={{
              background: 'linear-gradient(135deg, #0C447C, #185FA5)',
              borderRadius: 12, padding: '16px 20px', textAlign: 'center', marginBottom: 20,
            }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>SCORE NPS</div>
              <div style={{ color: '#EF9F27', fontSize: 52, fontWeight: 800 }}>{nps}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Excelente (acima de 50)</div>
            </div>

            {npsData.map((item, i) => (
              <div key={item.categoria} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: '#444441' }}>{item.categoria}</span>
                  <span style={{ fontWeight: 700, color: npsColors[i] }}>{item.valor}%</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{
                    width: `${item.valor}%`,
                    background: npsColors[i],
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
