import { formatCurrency } from './ui/Shared';

export default function Indicadores({ projects }) {
  const financeiro = {
    faturamento: 159900,
    recebidos: 127000,
    aReceber: 32900,
    vencidos: 3250
  };

  const comercial = {
    ticketMedio: 27950,
    taxaFechamento: 46,
    fechadosMes: 6,
    perdidosMes: 3
  };

  const allProjects = Object.values(projects).flat();
  const totalProjetos = allProjects.length;
  const projetosFechados = projects['FECHADA']?.length || 0;
  const projetosPerdidos = 3;
  const totalRecebido = 127000;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      {/* FINANCEIRO */}
      <section>
        <div style={{ fontSize: 11, color: 'var(--emaer-azul-claro)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1.5, marginBottom: 15 }}>Financeiro — Geral</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 15 }}>
          {[
            { label: 'Faturamento', value: financeiro.faturamento, sub: '6 contratos fechados', color: 'var(--emaer-azul-medio)' },
            { label: 'Recebidos', value: financeiro.recebidos, sub: 'pagamentos confirmados', color: 'var(--emaer-verde)' },
            { label: 'A Receber', value: financeiro.aReceber, sub: 'R$ 3.250 vencidos', color: 'var(--emaer-ambar)' },
            { label: 'Vencidos', value: financeiro.vencidos, sub: 'prazo expirado', color: '#ff4444' },
          ].map(k => (
            <div key={k.label} className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 10, color: 'var(--emaer-azul-claro)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: k.color }}>{formatCurrency(k.value)}</div>
              <div style={{ fontSize: 11, color: 'var(--emaer-grafite)', opacity: 0.7, marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMERCIAL */}
      <section>
        <div style={{ fontSize: 11, color: 'var(--emaer-azul-claro)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1.5, marginBottom: 15 }}>Comercial — Geral</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 15 }}>
          {[
            { label: 'Ticket Médio', value: formatCurrency(comercial.ticketMedio), sub: 'por projeto fechado', color: 'var(--emaer-azul-medio)', border: 'var(--emaer-ambar)' },
            { label: 'Taxa de Fechamento', value: `${comercial.taxaFechamento}%`, sub: 'dos iniciados', color: 'var(--emaer-verde)' },
            { label: 'Fechados (mês)', value: comercial.fechadosMes, sub: 'projetos', color: 'var(--emaer-azul-medio)' },
            { label: 'Perdidos (mês)', value: comercial.perdidosMes, sub: 'projetos', color: 'var(--emaer-ambar)' },
          ].map(k => (
            <div key={k.label} className="card" style={{ padding: 20, borderTop: k.border ? `3px solid ${k.border}` : 'none' }}>
              <div style={{ fontSize: 10, color: 'var(--emaer-azul-claro)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: k.color }}>{k.value}</div>
              <div style={{ fontSize: 11, color: 'var(--emaer-grafite)', opacity: 0.7, marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM TABLES */}
      <div className="two-col-grid">
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginBottom: 20, color: 'var(--emaer-azul-principal)' }}>Pipeline Atual</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {Object.entries(projects).map(([col, cards]) => {
                const total = cards.reduce((s, c) => s + (c.valor || 0), 0);
                return (
                  <div key={col} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid #eee' }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{col}</span>
                    <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--emaer-azul-claro)' }}>{total > 0 ? formatCurrency(total) : '—'}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--emaer-azul-principal)' }}>{cards.length}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginBottom: 20, color: 'var(--emaer-azul-principal)' }}>Indicadores de Performance</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                { label: 'Total Projetos cadastrados', value: totalProjetos, icon: '👥' },
                { label: 'Projetos fechados (total)', value: projetosFechados, icon: '📈' },
                { label: 'Projetos perdidos (total)', value: projetosPerdidos, icon: '📉' },
                { label: 'Ticket médio fechado', value: formatCurrency(comercial.ticketMedio), icon: '💰' },
                { label: 'Total recebido (todos os períodos)', value: formatCurrency(totalRecebido), icon: '📊' },
                { label: 'Tempo médio no pipeline*', value: '-14 dias', icon: '🕒' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12 }}>{item.icon}</span>
                    <span style={{ fontSize: 13 }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--emaer-azul-principal)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
