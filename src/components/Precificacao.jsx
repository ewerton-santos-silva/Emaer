import { useState, useMemo } from 'react';

const fmt = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const defaultFatoresComplexidade = [
  { id: 'balanco_3_5', label: 'Balanço (3 a 5m)', pct: 3, checked: false },
  { id: 'balanco_gt5', label: 'Balanço (>5m)', pct: 10, checked: false },
  { id: 'transicao_leve', label: 'Transição leve (<3 pilares)', pct: 3, checked: false },
  { id: 'transicao_pesada', label: 'Transição pesada (>3 pilares)', pct: 10, checked: false },
  { id: 'vao_grande', label: 'Vão grande (>9m)', pct: 3, checked: false },
  { id: 'escada_moderna', label: 'Escada Moderna', pct: 3, checked: false },
  { id: 'protensao_completa', label: 'Protensão completa', pct: 8, checked: false },
  { id: 'protensao_localizada', label: 'Protensão localizada', pct: 5, checked: false },
  { id: 'detalhes_metalicos', label: 'Detalhes metálicos', pct: 4, checked: false },
  { id: 'terreno_desnivel', label: 'Terreno em desnível (>5m)', pct: 4, checked: false },
  { id: 'laje_plana', label: 'Laje Plana (sem vigas)', pct: 4, checked: false },
  { id: 'fundacao_profunda', label: 'Fundação Profunda', pct: 5, checked: false },
  { id: 'obra_divisa', label: 'Obra em Divisa', pct: 3, checked: false },
  { id: 'sobrecarga', label: 'Sobrecarga >500 Kgf/m²', pct: 4, checked: false },
  { id: 'piscina', label: 'Piscina na Cobertura', pct: 5, checked: false },
  { id: 'bim', label: 'Compatibilização em BIM', pct: 5, checked: false },
];

const defaultFatoresRepeticao = [
  { desc: 'Sem repetições', fator: 1 },
  { desc: 'Até 3 repetições', fator: 0.8 },
  { desc: '3 a 8 repetições', fator: 0.7 },
  { desc: '8 a 12 repetições', fator: 0.6 },
  { desc: '+12 repetições', fator: 0.5 },
];

const defaultMediaNacional = [
  { regiao: 'Norte', residencial: 13.3, predial: 12.9, comercial: 32.6 },
  { regiao: 'Nordeste', residencial: 15.2, predial: 17.2, comercial: 31.2 },
  { regiao: 'Centroeste', residencial: 12.7, predial: 10.1, comercial: 23.8 },
  { regiao: 'Sudeste', residencial: 22.8, predial: 18.6, comercial: 37.5 },
  { regiao: 'Sul', residencial: 17.1, predial: 14, comercial: 23.9 },
];

const defaultEquipe = [
  { id: 'eng_dono', label: 'Engenheiro - Dono', salario: 15000, encargos: 30, horasMes: 160 },
  { id: 'eng_colab', label: 'Engenheiro - colaborador', salario: 8000, encargos: 30, horasMes: 160 },
  { id: 'estagiario_1', label: 'Estagiário 1', salario: 1500, encargos: 0, horasMes: 120 },
];

export default function Precificacao({ projects, setProjects }) {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [activeTab, setActiveTab] = useState('complexidade');
  
  const [fatoresComplexidade, setFatoresComplexidade] = useState(defaultFatoresComplexidade);
  const [regiao, setRegiao] = useState('Sul');
  const [tipoObra, setTipoObra] = useState('Residencial');
  const [area, setArea] = useState(0);
  const [repeticaoIdx, setRepeticaoIdx] = useState(0);
  const [tributacao, setTributacao] = useState(11);
  const [meuPrecoM2, setMeuPrecoM2] = useState(0);

  const [equipe, setEquipe] = useState(defaultEquipe);
  const [levantamentos, setLevantamentos] = useState([
    { etapa: 'Reunião de briefing', responsavelId: '', horas: 0 },
    { etapa: 'Visita ao local', responsavelId: '', horas: 0 },
    { etapa: 'Modelagem Estrutural', responsavelId: '', horas: 0 },
    { etapa: 'Detalhamento', responsavelId: '', horas: 0 },
  ]);
  const [margemLucro, setMargemLucro] = useState(30);

  const selectedProject = useMemo(() => 
    Object.values(projects).flat().find(p => p.id === Number(selectedProjectId))
  , [projects, selectedProjectId]);

  const refMercado = useMemo(() => {
    const r = defaultMediaNacional.find(m => m.regiao === regiao);
    if (!r) return 0;
    if (tipoObra === 'Residencial') return r.residencial;
    if (tipoObra === 'Predial') return r.predial;
    return r.comercial;
  }, [regiao, tipoObra]);

  const calcValorHora = (membro) => {
    const totalSalario = (membro.salario || 0) * (1 + (membro.encargos || 0) / 100);
    return totalSalario / (membro.horasMes || 160);
  };

  const calcCustoEtapa = (etapas) => {
    return etapas.reduce((acc, curr) => {
      const membro = equipe.find(m => m.id === curr.responsavelId);
      return acc + (curr.horas * (membro ? calcValorHora(membro) : 0));
    }, 0);
  };

  const complexidadeExtraPct = fatoresComplexidade.filter(f => f.checked).reduce((acc, f) => acc + f.pct, 0);
  const fatorRepeticao = defaultFatoresRepeticao[repeticaoIdx]?.fator || 1;
  
  const valorFinalMetodo1 = area * (meuPrecoM2 || refMercado) * (1 + complexidadeExtraPct / 100) * fatorRepeticao;
  
  const custoEquipe = calcCustoEtapa(levantamentos);
  const valorFinalMetodo2 = custoEquipe / (1 - (margemLucro + tributacao) / 100);

  const valorFinal = activeTab === 'complexidade' ? valorFinalMetodo1 : valorFinalMetodo2;

  const handleAprovar = () => {
    if (!selectedProject) return;
    const next = { ...projects };
    Object.keys(next).forEach(col => {
      next[col] = next[col].map(p => p.id === selectedProject.id ? { ...p, valor: valorFinal, status: 'Precificado' } : p);
    });
    setProjects(next);
    alert('Proposta aprovada!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
        <select className="form-control" style={{ width: 250 }} value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
          <option value="">Selecione o Projeto...</option>
          {Object.values(projects).flat().map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 4, background: '#eee', padding: 4, borderRadius: 8 }}>
          {['complexidade', 'hora_trabalhada', 'comparativo'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: '8px 16px', border: 'none', borderRadius: 6, cursor: 'pointer',
              background: activeTab === t ? 'var(--emaer-azul-principal)' : 'transparent',
              color: activeTab === t ? '#fff' : '#666', fontWeight: 600, fontSize: 12
            }}>{t.replace('_', ' ').toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {activeTab === 'complexidade' && (
            <>
              <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginBottom: 20, color: 'var(--emaer-azul-principal)' }}>MÉTODO 1 - PRECIFICAÇÃO POR M² E COMPLEXIDADE</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 25 }}>
                <div className="form-group"><label className="form-label">REGIÃO DA OBRA</label>
                  <select className="form-control" value={regiao} onChange={(e)=>setRegiao(e.target.value)}>
                    {defaultMediaNacional.map(m => <option key={m.regiao} value={m.regiao}>{m.regiao}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">TIPO DE OBRA</label>
                  <select className="form-control" value={tipoObra} onChange={(e)=>setTipoObra(e.target.value)}><option>Residencial</option><option>Predial</option><option>Comercial</option></select>
                </div>
                <div className="form-group"><label className="form-label">ÁREA TOTAL (M²)</label>
                  <input type="number" className="form-control" value={area} onChange={(e)=>setArea(Number(e.target.value))} />
                </div>
                <div className="form-group"><label className="form-label">PAVIMENTOS REPETIDOS</label>
                  <select className="form-control" value={repeticaoIdx} onChange={(e)=>setRepeticaoIdx(Number(e.target.value))}>
                    {defaultFatoresRepeticao.map((f, i) => <option key={i} value={i}>{f.desc} (x{f.fator})</option>)}
                  </select>
                </div>
              </div>

              <h3 style={{ fontSize: 12, color: '#999', textTransform: 'uppercase', marginBottom: 15 }}>FATORES DE COMPLEXIDADE — SELECIONE OS QUE SE APLICAM</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {fatoresComplexidade.map((f, i) => (
                  <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f9f9f9', borderRadius: 8 }}>
                    <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13 }}>
                      <input type="checkbox" checked={f.checked} onChange={() => {
                        const n = [...fatoresComplexidade]; n[i].checked = !n[i].checked; setFatoresComplexidade(n);
                      }} /> {f.label}
                    </label>
                    <input 
                      type="number" 
                      className="form-control" 
                      style={{ width: 60, padding: 4, height: 25, fontSize: 12 }} 
                      value={f.pct} 
                      onChange={(e) => {
                        const n = [...fatoresComplexidade]; n[i].pct = Number(e.target.value); setFatoresComplexidade(n);
                      }} 
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'hora_trabalhada' && (
            <div style={{ display: 'grid', gap: 25 }}>
              <div>
                <h4 style={{ fontSize: 14, color: 'var(--emaer-azul-principal)', marginBottom: 15 }}>GESTAO DA EQUIPE</h4>
                <table style={{ width: '100%' }}>
                  <thead><tr><th>Membro</th><th>Salário</th><th>Encargos %</th><th>Valor/Hora</th></tr></thead>
                  <tbody>
                    {equipe.map((m, i) => (
                      <tr key={m.id}>
                        <td>{m.label}</td>
                        <td><input type="number" className="form-control" value={m.salario} onChange={(e) => {
                          const n = [...equipe]; n[i].salario = Number(e.target.value); setEquipe(n);
                        }} /></td>
                        <td><input type="number" className="form-control" value={m.encargos} onChange={(e) => {
                          const n = [...equipe]; n[i].encargos = Number(e.target.value); setEquipe(n);
                        }} /></td>
                        <td style={{ fontWeight: 700 }}>{fmt(calcValorHora(m))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h4 style={{ fontSize: 14, color: 'var(--emaer-azul-principal)', marginBottom: 15 }}>CRONOGRAMA DE HORAS</h4>
                <table style={{ width: '100%' }}>
                  <thead><tr><th>Etapa</th><th>Responsável</th><th>Horas Estimadas</th></tr></thead>
                  <tbody>
                    {levantamentos.map((l, i) => (
                      <tr key={i}>
                        <td>{l.etapa}</td>
                        <td><select className="form-control" value={l.responsavelId} onChange={(e) => {
                          const n = [...levantamentos]; n[i].responsavelId = e.target.value; setLevantamentos(n);
                        }}>
                          <option value="">─ Selecione ─</option>
                          {equipe.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                        </select></td>
                        <td><input type="number" className="form-control" value={l.horas} onChange={(e) => {
                          const n = [...levantamentos]; n[i].horas = Number(e.target.value); setLevantamentos(n);
                        }} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div style={{ marginTop: 30, paddingTop: 20, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase' }}>Valor Total Estimado</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--emaer-azul-principal)' }}>{fmt(valorFinal)}</div>
            </div>
            <button className="btn-primary" style={{ padding: '12px 30px' }} onClick={handleAprovar} disabled={!selectedProjectId}>APROVAR E ENVIAR AO PIPELINE</button>
          </div>
        </div>
      </div>
    </div>
  );
}
