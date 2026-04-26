import { useMemo } from 'react';

export default function Tarefas({ projects, parceirosData }) {
  const agenda = useMemo(() => {
    const projectActions = Object.values(projects).flat()
      .filter(p => p.proximaAcao && p.dataAcao)
      .map(p => ({
        id: `proj-${p.id}`,
        tipo: 'Projeto',
        origem: p.nome,
        acao: p.proximaAcao,
        data: p.dataAcao,
        color: 'var(--emaer-azul-principal)'
      }));

    const partnerActions = Object.values(parceirosData).flat()
      .filter(p => p.proximaAcao && p.dataAcao)
      .map(p => ({
        id: `parc-${p.id}`,
        tipo: 'Parceiro',
        origem: p.nome,
        acao: p.proximaAcao,
        data: p.dataAcao,
        color: 'var(--emaer-ambar)'
      }));

    return [...projectActions, ...partnerActions].sort((a, b) => new Date(a.data) - new Date(b.data));
  }, [projects, parceirosData]);

  return (
    <div className="card">
      <div className="card-body">
        <h3 style={{ marginBottom: 20, fontSize: 16, color: 'var(--emaer-azul-principal)' }}>AGENDA DE COMPROMISSOS</h3>
        
        {agenda.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Nenhum compromisso agendado no momento.</div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {agenda.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 15, alignItems: 'center', padding: 15, background: '#f9f9f9', borderRadius: 10, borderLeft: `5px solid ${item.color}` }}>
                <div style={{ minWidth: 100, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: item.color }}>{item.data.split('-')[2]}</div>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#999' }}>{new Date(item.data).toLocaleString('pt-BR', { month: 'short' })}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: item.color, textTransform: 'uppercase' }}>{item.tipo}: {item.origem}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#333', marginTop: 2 }}>{item.acao}</div>
                </div>
                <button className="btn-secondary" style={{ fontSize: 10 }}>Concluir</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
