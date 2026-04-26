import { formatCurrency } from './ui/Shared';

export default function Indicadores({ projects }) {
  // Mock data for financial KPIs since we don't have a shared financial state yet
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
  const projetosPerdidos = 3; // Mock
  const totalRecebido = 127000; // Mock

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      {/* FINANCEIRO - GERAL */}
      <section>
        <div style={{ fontSize: 11, color: 'var(--emaer-text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1.5, marginBottom: 15 }}>Financeiro — Geral</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 15 }}>
          {[
            { label: 'Faturamento', value: financeiro.faturamento, sub: '6 contratos fechados', color: 'var(--emaer-cyan)' },
            { label: 'Recebidos', value: financeiro.recebidos, sub: 'pagamentos confirmados', color: 'var(--emaer-text)' },
            { label: 'A Receber', value: financeiro.aReceber, sub: 'R$ 3.250 vencidos', color: 'var(--emaer-yellow)' },
            { label: 'Vencidos', value: financeiro.vencidos, sub: 'prazo expirado', color: 'var(--emaer-red)' },
          ].map(k => (
            <div key={k.label} className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 10, color: 'var(--emaer-text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: k.color }}>{formatCurrency(k.value)}</div>
              <div style={{ fontSize: 11, color: 'var(--emaer-text-dim)', marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMERCIAL - GERAL */}
      <section>
        <div style={{ fontSize: 11, color: 'var(--emaer-text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1.5, marginBottom: 15 }}>Comercial — Geral</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 15 }}>
          {[
            { label: 'Ticket Médio', value: formatCurrency(comercial.ticketMedio), sub: 'por projeto fechado', color: 'var(--emaer-cyan)', border: 'var(--emaer-red)' },
            { label: 'Taxa de Fechamento', value: `${comercial.taxaFechamento}%`, sub: 'dos iniciados', color: 'var(--emaer-green)' },
            { label: 'Fechados (mês)', value: comercial.fechadosMes, sub: 'projetos', color: 'var(--emaer-text)' },
            { label: 'Perdidos (mês)', value: comercial.perdidosMes, sub: 'projetos', color: 'var(--emaer-yellow)' },
          ].map(k => (
            <div key={k.label} className="card" style={{ padding: 20, borderTop: k.border ? `2px solid ${k.border}` : 'none' }}>
              <div style={{ fontSize: 10, color: 'var(--emaer-text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: k.color }}>{k.value}</div>
              <div style={{ fontSize: 11, color: 'var(--emaer-text-dim)', marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM TABLES */}
      <div className="two-col-grid">
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginBottom: 20 }}>Pipeline Atual</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {Object.entries(projects).map(([col, cards]) => {
                const total = cards.reduce((s, c) => s + (c.valor || 0), 0);
                return (
                  <div key={col} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid var(--emaer-border)' }}>
                    <span style={{ fontSize: 13 }}>{col}</span>
                    <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--emaer-text-dim)' }}>{total > 0 ? formatCurrency(total) : '—'}</span>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{cards.length}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginBottom: 20 }}>Indicadores de Performance</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                { label: 'Total Projetos cadastrados', value: totalProjetos, icon: '👥' },
                { label: 'Projetos fechados (total)', value: projetosFechados, icon: '📈' },
                { label: 'Projetos perdidos (total)', value: projetosPerdidos, icon: '📉' },
                { label: 'Ticket médio fechado', value: formatCurrency(comercial.ticketMedio), icon: '💰' },
                { label: 'Total recebido (todos os períodos)', value: formatCurrency(totalRecebido), icon: '📊' },
                { label: 'Tempo médio no pipeline*', value: '-14 dias', icon: '🕒' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid var(--emaer-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12 }}>{item.icon}</span>
                    <span style={{ fontSize: 13 }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800 }}>{item.value}</span>
                </div>
              ))}
              <div style={{ fontSize: 10, color: 'var(--emaer-text-dim)', fontStyle: 'italic', marginTop: 10 }}>* Estimativa baseada em dados disponíveis</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
