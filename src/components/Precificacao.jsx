import { useState, useMemo, useEffect } from 'react';

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
  { id: 'subsolo', label: 'Subsolo', pct: 5, checked: false },
  { id: 'lod400', label: 'Modelagem BIM LOD400', pct: 6, checked: false },
  { id: 'memorial', label: 'Memorial de Cálculo', pct: 3, checked: false },
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
  { id: 'estagiario_2', label: 'Estagiário 2', salario: 1200, encargos: 0, horasMes: 120 },
];

export default function Precificacao({ projects, setProjects }) {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [activeTab, setActiveTab] = useState('hora_trabalhada');
  const [showSettings, setShowSettings] = useState(false);
  
  const [fatoresRepeticao, setFatoresRepeticao] = useState(defaultFatoresRepeticao);
  const [mediaNacional, setMediaNacional] = useState(defaultMediaNacional);
  const [equipe, setEquipe] = useState(defaultEquipe);
  const [fatoresComplexidade, setFatoresComplexidade] = useState(defaultFatoresComplexidade);

  const [levantamentos, setLevantamentos] = useState([
    { etapa: 'Reunião de briefing', responsavelId: '', horas: 0 },
    { etapa: 'Visita ao local', responsavelId: '', horas: 0 },
    { etapa: 'Levantamentos In Loco', responsavelId: '', horas: 0 },
  ]);
  const [projetoEstrutural, setProjetoEstrutural] = useState([
    { etapa: 'Concepção', responsavelId: '', horas: 0 },
    { etapa: 'Modelagem', responsavelId: '', horas: 0 },
    { etapa: 'Análise', responsavelId: '', horas: 0 },
    { etapa: 'Detalhamento', responsavelId: '', horas: 0 },
  ]);
  const [custosVariaveis, setCustosVariaveis] = useState({ renders: 0, plotagens: 0, taxas: 0 });
  const [combustivel, setCombustivel] = useState({ visitas: 0, distancia: 0, precoL: 0 });
  const [margemLucro, setMargemLucro] = useState(30);
  const [tributacao, setTributacao] = useState(11);
  const [area, setArea] = useState(100);
  const [repeticaoIdx, setRepeticaoIdx] = useState(0);

  const selectedProject = useMemo(() => 
    Object.values(projects).flat().find(p => p.id === Number(selectedProjectId))
  , [projects, selectedProjectId]);

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

  const custoEquipe = calcCustoEtapa(levantamentos) + calcCustoEtapa(projetoEstrutural);
  const totalVariaveis = Object.values(custosVariaveis).reduce((a, b) => a + b, 0);
  const totalCombustivel = (combustivel.distancia + 7) * combustivel.visitas * 2.2 * (combustivel.precoL || 0);
  const subtotalCustos = custoEquipe + totalVariaveis + totalCombustivel;
  const valorFinalMetodo2 = subtotalCustos / (1 - (margemLucro + tributacao) / 100);

  const complexidadeExtraPct = fatoresComplexidade.filter(f => f.checked).reduce((acc, f) => acc + f.pct, 0);
  const fatorRepeticao = fatoresRepeticao[repeticaoIdx]?.fator || 1;
  const valorFinalMetodo1 = area * 15.2 * (1 + complexidadeExtraPct / 100) * fatorRepeticao;

  const valorFinal = activeTab === 'hora_trabalhada' ? valorFinalMetodo2 : valorFinalMetodo1;

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
      {/* Settings Modal (Repetição & Média Nacional) */}
      {showSettings && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: 800, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3>Configurações Gerais</h3>
                <button className="btn-secondary" onClick={() => setShowSettings(false)}>Fechar</button>
              </div>
              
              <div style={{ display: 'grid', gap: 30 }}>
                <section>
                  <h4 style={{ marginBottom: 10 }}>Fatores de Repetição de Pavimentos</h4>
                  <table style={{ width: '100%' }}>
                    <thead><tr><th>Descrição</th><th>Fator</th></tr></thead>
                    <tbody>
                      {fatoresRepeticao.map((f, i) => (
                        <tr key={i}>
                          <td><input className="form-control" value={f.desc} onChange={(e) => {
                            const n = [...fatoresRepeticao]; n[i].desc = e.target.value; setFatoresRepeticao(n);
                          }} /></td>
                          <td><input type="number" className="form-control" value={f.fator} step="0.1" onChange={(e) => {
                            const n = [...fatoresRepeticao]; n[i].fator = Number(e.target.value); setFatoresRepeticao(n);
                          }} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>

                <section>
                  <h4 style={{ marginBottom: 10 }}>Média Nacional por m² — Fonte AltoQi</h4>
                  <table style={{ width: '100%' }}>
                    <thead><tr><th>Região</th><th>Residencial</th><th>Predial</th><th>Comercial</th></tr></thead>
                    <tbody>
                      {mediaNacional.map((m, i) => (
                        <tr key={i}>
                          <td><strong>{m.regiao}</strong></td>
                          <td><input type="number" className="form-control" value={m.residencial} onChange={(e) => {
                            const n = [...mediaNacional]; n[i].residencial = Number(e.target.value); setMediaNacional(n);
                          }} /></td>
                          <td><input type="number" className="form-control" value={m.predial} onChange={(e) => {
                            const n = [...mediaNacional]; n[i].predial = Number(e.target.value); setMediaNacional(n);
                          }} /></td>
                          <td><input type="number" className="form-control" value={m.comercial} onChange={(e) => {
                            const n = [...mediaNacional]; n[i].comercial = Number(e.target.value); setMediaNacional(n);
                          }} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main UI */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                color: activeTab === t ? '#fff' : '#666', fontWeight: 600
              }}>{t.replace('_', ' ').toUpperCase()}</button>
            ))}
          </div>
        </div>
        <button className="btn-secondary" style={{ fontSize: 20 }} onClick={() => setShowSettings(true)}>⚙️</button>
      </div>

      <div className="two-col-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {activeTab === 'hora_trabalhada' && (
            <>
              <div className="card">
                <div className="card-body">
                  <h4 style={{ marginBottom: 15, color: 'var(--emaer-azul-principal)' }}>GESTÃO DA EQUIPE & SALÁRIOS</h4>
                  <table style={{ width: '100%' }}>
                    <thead><tr><th>Membro</th><th>Salário Base</th><th>Encargos (%)</th><th>R$/Hora</th></tr></thead>
                    <tbody>
                      {equipe.map((m, i) => (
                        <tr key={i}>
                          <td><input className="form-control" value={m.label} onChange={(e) => {
                            const n = [...equipe]; n[i].label = e.target.value; setEquipe(n);
                          }} /></td>
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
              </div>

              <div className="card">
                <div className="card-body">
                  <h4 style={{ marginBottom: 15, color: 'var(--emaer-azul-principal)' }}>LEVANTAMENTOS & PROJETO</h4>
                  <table style={{ width: '100%' }}>
                    <thead><tr><th>Etapa</th><th>Responsável</th><th>Horas</th></tr></thead>
                    <tbody>
                      {levantamentos.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.etapa}</td>
                          <td><select className="form-control" value={item.responsavelId} onChange={(e) => {
                            const n = [...levantamentos]; n[idx].responsavelId = e.target.value; setLevantamentos(n);
                          }}>
                            <option value="">─</option>
                            {equipe.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                          </select></td>
                          <td><input type="number" className="form-control" value={item.horas} onChange={(e) => {
                            const n = [...levantamentos]; n[idx].horas = Number(e.target.value); setLevantamentos(n);
                          }} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'complexidade' && (
            <div className="card">
              <div className="card-body">
                <h4 style={{ marginBottom: 20, color: 'var(--emaer-azul-principal)' }}>FATORES DE COMPLEXIDADE</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {fatoresComplexidade.map((f, i) => (
                    <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, background: '#f9f9f9', borderRadius: 8 }}>
                      <label style={{ display: 'flex', gap: 8, fontSize: 13, alignItems: 'center' }}>
                        <input type="checkbox" checked={f.checked} onChange={() => {
                          const n = [...fatoresComplexidade]; n[i].checked = !n[i].checked; setFatoresComplexidade(n);
                        }} /> {f.label}
                      </label>
                      <input type="number" className="form-control" style={{ width: 60 }} value={f.pct} onChange={(e) => {
                        const n = [...fatoresComplexidade]; n[i].pct = Number(e.target.value); setFatoresComplexidade(n);
                      }} />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, display: 'flex', gap: 20 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Área (m²)</label>
                    <input type="number" className="form-control" value={area} onChange={(e) => setArea(Number(e.target.value))} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Repetição</label>
                    <select className="form-control" value={repeticaoIdx} onChange={(e) => setRepeticaoIdx(Number(e.target.value))}>
                      {fatoresRepeticao.map((f, i) => <option key={i} value={i}>{f.desc}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-body">
            <h4 style={{ marginBottom: 20 }}>RESUMO DA PROPOSTA</h4>
            <div style={{ display: 'grid', gap: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Custos Base</span><span>{fmt(subtotalCustos)}</span></div>
              <div className="form-group"><label className="form-label">Margem (%)</label><input type="number" className="form-control" value={margemLucro} onChange={(e)=>setMargemLucro(Number(e.target.value))} /></div>
              <div className="form-group"><label className="form-label">Impostos (%)</label><input type="number" className="form-control" value={tributacao} onChange={(e)=>setTributacao(Number(e.target.value))} /></div>
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <div style={{ fontSize: 12, color: '#888' }}>VALOR TOTAL</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--emaer-azul-principal)' }}>{fmt(valorFinal)}</div>
              </div>
              <button className="btn-primary" style={{ width: '100%', padding: 15 }} onClick={handleAprovar} disabled={!selectedProjectId}>APROVAR PROPOSTA</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
