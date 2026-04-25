import { funilVendasData } from '../data/mockData';
import { formatCurrency } from './ui/Shared';

// Gradient stops from #85B7EB (top) to #0C447C (bottom)
const gradients = [
  { bg: '#85B7EB', text: '#fff' },
  { bg: '#5A9AD8', text: '#fff' },
  { bg: '#2E7DC5', text: '#fff' },
  { bg: '#1A5FA5', text: '#fff' },
  { bg: '#0C447C', text: '#fff' },
];

const maxQtd = Math.max(...funilVendasData.map(e => e.quantidade));

export default function FunilVendas() {
  return (
    <div className="two-col-grid">
      {/* Funil visual */}
      <div className="card">
        <div className="card-body">
          <div className="section-title" style={{ marginBottom: 24 }}>🔽 Funil de Vendas</div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {funilVendasData.map((stage, i) => {
              const widthPct = 100 - (i * 12);
              const grad = gradients[i] || gradients[gradients.length - 1];
              return (
                <div key={stage.estagio} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: `${widthPct}%`,
                    background: grad.bg,
                    borderRadius: i === 0 ? '10px 10px 0 0' : i === funilVendasData.length - 1 ? '0 0 10px 10px' : 0,
                    padding: '14px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'transform 0.2s',
                    cursor: 'default',
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scaleX(1.02)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scaleX(1)'}
                  >
                    <span style={{ color: grad.text, fontWeight: 700, fontSize: 14 }}>
                      {stage.estagio}
                    </span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: grad.text, fontWeight: 800, fontSize: 18, lineHeight: 1 }}>
                        {stage.quantidade}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>
                        {stage.conversao}% conversão
                      </div>
                    </div>
                  </div>
                  {i < funilVendasData.length - 1 && (
                    <div style={{
                      width: 0, height: 0,
                      borderLeft: `${widthPct * 1.5}px solid transparent`,
                      borderRight: `${widthPct * 1.5}px solid transparent`,
                      borderTop: `10px solid ${grad.bg}`,
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabela de estágios */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="card">
          <div className="card-body">
            <div className="section-title" style={{ marginBottom: 16 }}>Detalhamento por Estágio</div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Estágio</th>
                    <th>Qtd.</th>
                    <th>Valor</th>
                    <th>Conversão</th>
                  </tr>
                </thead>
                <tbody>
                  {funilVendasData.map((s, i) => (
                    <tr key={s.estagio}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: gradients[i]?.bg || '#85B7EB' }} />
                          <span style={{ fontWeight: 600 }}>{s.estagio}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 800, color: '#0C447C', fontSize: 18 }}>{s.quantidade}</td>
                      <td style={{ fontWeight: 700, color: '#185FA5' }}>{formatCurrency(s.valor)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar-wrap" style={{ flex: 1 }}>
                            <div className="progress-bar-fill" style={{ width: `${s.conversao}%` }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#185FA5', minWidth: 30 }}>
                            {s.conversao}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #0C447C, #185FA5)',
          borderRadius: 12, padding: 20, color: '#fff',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
            TAXA DE CONVERSÃO GLOBAL
          </div>
          <div style={{ fontSize: 48, fontWeight: 800 }}>
            {funilVendasData[funilVendasData.length - 1].conversao}%
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
            {funilVendasData[0].quantidade} leads → {funilVendasData[funilVendasData.length - 1].quantidade} fechados
          </div>
        </div>
      </div>
    </div>
  );
}
