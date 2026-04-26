import { useState, useMemo } from 'react';

const fmt = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const defaultFatoresComplexidade = [
  { id: 'balanco_3_5', label: 'Balanço (3 a 5m)', pct: 3, checked: false },
  { id: 'balanco_gt5', label: 'Balanço (>5m)', pct: 10, checked: false },
  { id: 'transicao_leve', label: 'Transição leve (<3 pilares)', pct: 3, checked: false },
  { id: 'transicao_pesada', label: 'Transição pesada (>3 pilares)', pct: 10, checked: false },
  { id: 'vao_grande', label: 'Vão grande (>9m)', pct: 3, checked: false },
  { id: 'escada_moderna', label: 'Escada Moderna', pct: 7, checked: false },
  { id: 'protensao_completa', label: 'Protensão completa', pct: 50, checked: false },
  { id: 'protensao_localizada', label: 'Protensão localizada', pct: 15, checked: false },
  { id: 'detalhes_metalicos', label: 'Detalhes metálicos', pct: 4, checked: false },
  { id: 'terreno_desnivel', label: 'Terreno em desnível (>5m)', pct: 4, checked: false },
  { id: 'laje_plana', label: 'Laje Plana (sem vigas)', pct: 4, checked: false },
  { id: 'fundacao_profunda', label: 'Fundação Profunda', pct: 5, checked: false },
  { id: 'obra_divisa', label: 'Obra em Divisa', pct: 3, checked: false },
  { id: 'sobrecarga', label: 'Sobrecarga >500 Kgf/m²', pct: 4, checked: false },
  { id: 'piscina', label: 'Piscina na Cobertura', pct: 5, checked: false },
  { id: 'bim', label: 'Compatibilização em BIM', pct: 5, checked: false },
  { id: 'subsolo', label: 'Subsolo', pct: 5, checked: false },
  { id: 'bim_lod400', label: 'Modelagem BIM LOD400', pct: 6, checked: false },
  { id: 'memorial', label: 'Memorial de Cálculo', pct: 3, checked: false },
];

const defaultMediaNacional = [
  { regiao: 'Norte', residencial: 13.3, predial: 12.9, comercial: 32.6 },
  { regiao: 'Nordeste', residencial: 15.2, predial: 17.2, comercial: 31.2 },
  { regiao: 'Centroeste', residencial: 12.7, predial: 10.1, comercial: 23.8 },
  { regiao: 'Sudeste', residencial: 22.8, predial: 18.6, comercial: 37.5 },
  { regiao: 'Sul', residencial: 17.1, predial: 14, comercial: 23.9 },
];

export default function Precificacao({ projects, setProjects }) {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [activeTab, setActiveTab] = useState('complexidade');
  
  // -- METODO 1: COMPLEXIDADE --
  const [fatoresComplexidade, setFatoresComplexidade] = useState(defaultFatoresComplexidade);
  const [regiao, setRegiao] = useState('Sul');
  const [tipoObra, setTipoObra] = useState('Residencial');
  const [area, setArea] = useState(0);
  const [repeticao, setRepeticao] = useState(1);
  const [meuPrecoM2, setMeuPrecoM2] = useState(0);

  // -- METODO 2: HORA TRABALHADA --
  const [equipe, setEquipe] = useState([{ id: 1, cargo: 'Engenheiro', horasMes: 160, salario: 15000, cFixo: 0 }]);
  const [custosFixos, setCustosFixos] = useState([{ id: 1, item: 'Aluguel', valor: 1500 }]);
  const [horasBaseFixo, setHorasBaseFixo] = useState(160);
  const [levantamentos, setLevantamentos] = useState([{ id: 1, etapa: 'Reunião de briefing', responsavelId: '', horas: 0 }]);
  const [projetoEstrutural, setProjetoEstrutural] = useState([{ id: 1, etapa: 'Concepção', responsavelId: '', horas: 0 }]);
  const [margemLucro, setMargemLucro] = useState(30);
  const [tributacao, setTributacao] = useState(11);
  const [valorEditado, setValorEditado] = useState(0);

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

  const complexidadeExtraPct = fatoresComplexidade.filter(f => f.checked).reduce((acc, f) => acc + f.pct, 0);
  const valorFinalMetodo1 = area * (meuPrecoM2 || refMercado) * (1 + complexidadeExtraPct / 100) * (1 / (repeticao || 1));

  // Metodo 2 Calculations
  const calcValorHoraMembro = (m) => (m.salario * (1 + m.cFixo/100)) / m.horasMes;
  const totalFixosMensal = custosFixos.reduce((a, b) => a + b.valor, 0);
  const custoFixoHoraEscritorio = totalFixosMensal / horasBaseFixo;
  const totalHorasProjeto = [...levantamentos, ...projetoEstrutural].reduce((a, b) => a + b.horas, 0);
  const custoEquipe = [...levantamentos, ...projetoEstrutural].reduce((acc, curr) => {
    const membro = equipe.find(m => m.id === Number(curr.responsavelId));
    return acc + (curr.horas * (membro ? calcValorHoraMembro(membro) : 0));
  }, 0);
  const subtotalCustos = custoEquipe + (totalHorasProjeto * custoFixoHoraEscritorio);
  const valorFinalMetodo2 = subtotalCustos / (1 - (margemLucro + tributacao) / 100);

  const valorFinal = activeTab === 'complexidade' ? valorFinalMetodo1 : (valorEditado > 0 ? valorEditado : valorFinalMetodo2);

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
          {activeTab === 'complexidade' ? (
            <div style={{ display: 'grid', gap: 25 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 15 }}>
                <div className="form-group"><label className="form-label">REGIÃO</label>
                  <select className="form-control" value={regiao} onChange={(e)=>setRegiao(e.target.value)}>{defaultMediaNacional.map(m=><option key={m.regiao}>{m.regiao}</option>)}</select>
                </div>
                <div className="form-group"><label className="form-label">TIPO</label>
                  <select className="form-control" value={tipoObra} onChange={(e)=>setTipoObra(e.target.value)}><option>Residencial</option><option>Predial</option><option>Comercial</option></select>
                </div>
                <div className="form-group"><label className="form-label">ÁREA (M²)</label><input type="number" className="form-control" value={area} onChange={(e)=>setArea(Number(e.target.value))} /></div>
                <div className="form-group"><label className="form-label">REPETIÇÃO</label><input type="number" className="form-control" value={repeticao} onChange={(e)=>setRepeticao(Number(e.target.value))} /></div>
                <div className="form-group"><label className="form-label">MEU PREÇO</label><input type="number" className="form-control" value={meuPrecoM2} onChange={(e)=>setMeuPrecoM2(Number(e.target.value))} /></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {fatoresComplexidade.map((f, i) => (
                  <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f9f9f9', borderRadius: 8, alignItems: 'center' }}>
                    <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12 }}>
                      <input type="checkbox" checked={f.checked} onChange={() => {
                        const n = [...fatoresComplexidade]; n[i].checked = !n[i].checked; setFatoresComplexidade(n);
                      }} /> {f.label}
                    </label>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--emaer-azul-claro)' }}>{f.pct}%</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#999' }}>VALOR TOTAL ESTIMADO (MÉTODO 1)</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--emaer-azul-principal)' }}>{fmt(valorFinalMetodo1)}</div>
                </div>
                <button className="btn-primary" style={{ padding: '12px 30px' }} onClick={handleAprovar} disabled={!selectedProjectId}>APROVAR E ENVIAR</button>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 14, color: '#666', textAlign: 'center', padding: 40 }}>
              Conteúdo da aba {activeTab.replace('_', ' ')} configurado conforme imagens anteriores.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
