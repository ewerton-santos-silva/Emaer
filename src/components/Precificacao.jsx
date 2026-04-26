import { useState, useMemo, useEffect } from 'react';

const fmt = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

// Fatores de Complexidade (Image 1)
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

// Fatores de Repetição (Image 4)
const defaultFatoresRepeticao = [
  { desc: 'Sem repetições', fator: 1 },
  { desc: 'Até 3 repetições', fator: 0.8 },
  { desc: '3 a 8 repetições', fator: 0.7 },
  { desc: '8 a 12 repetições', fator: 0.6 },
  { desc: '+12 repetições', fator: 0.5 },
];

// Média Nacional (Image 5)
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

const defaultLevantamentos = [
  { etapa: 'Reunião de briefing', responsavelId: '', horas: 0 },
  { etapa: 'Visita ao local', responsavelId: '', horas: 0 },
  { etapa: 'Levantamentos In Loco', responsavelId: '', horas: 0 },
  { etapa: 'Documentação', responsavelId: '', horas: 0 },
  { etapa: 'Criação da proposta', responsavelId: '', horas: 0 },
];

const defaultProjetoEstrutural = [
  { etapa: 'Concepção', responsavelId: '', horas: 0 },
  { etapa: 'Modelagem', responsavelId: '', horas: 0 },
  { etapa: 'Análise', responsavelId: '', horas: 0 },
  { etapa: 'Dimensionamento', responsavelId: '', horas: 0 },
  { etapa: 'Compatibilização', responsavelId: '', horas: 0 },
  { etapa: 'Otimização', responsavelId: '', horas: 0 },
  { etapa: 'Detalhamento', responsavelId: '', horas: 0 },
  { etapa: 'Correção', responsavelId: '', horas: 0 },
  { etapa: 'Plotagem', responsavelId: '', horas: 0 },
  { etapa: 'Reunião de entrega', responsavelId: '', horas: 0 },
];

export default function Precificacao({ projects, setProjects }) {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [activeTab, setActiveTab] = useState('hora_trabalhada');
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings State
  const [fatoresRepeticao, setFatoresRepeticao] = useState(defaultFatoresRepeticao);
  const [mediaNacional, setMediaNacional] = useState(defaultMediaNacional);
  const [equipe, setEquipe] = useState(defaultEquipe);
  const [fatoresComplexidade, setFatoresComplexidade] = useState(defaultFatoresComplexidade);

  // Method 2 State (Hora Trabalhada)
  const [levantamentos, setLevantamentos] = useState(defaultLevantamentos);
  const [projetoEstrutural, setProjetoEstrutural] = useState(defaultProjetoEstrutural);
  const [custosVariaveis, setCustosVariaveis] = useState({
    renders: 0, plotagens: 0, taxas: 0, placa: 0, brindes: 0, art: 0
  });
  const [combustivel, setCombustivel] = useState({ visitas: 0, distancia: 0, precoL: 0 });
  const [margemLucro, setMargemLucro] = useState(30);
  const [tributacao, setTributacao] = useState(11);
  const [valorFinalEditado, setValorFinalEditado] = useState(0);

  // Method 1 State (Complexidade)
  const [area, setArea] = useState(100);
  const [custoM2Base, setCustoM2Base] = useState(15.2);
  const [repeticaoIdx, setRepeticaoIdx] = useState(0);

  const selectedProject = useMemo(() => 
    Object.values(projects).flat().find(p => p.id === Number(selectedProjectId))
  , [projects, selectedProjectId]);

  useEffect(() => {
    if (selectedProject) {
      setArea(selectedProject.area || 100);
    }
  }, [selectedProject]);

  const calcValorHora = (membro) => {
    const totalSalario = membro.salario * (1 + membro.encargos / 100);
    return totalSalario / membro.horasMes;
  };

  const calcCustoEtapa = (etapas) => {
    return etapas.reduce((acc, curr) => {
      const membro = equipe.find(m => m.id === curr.responsavelId);
      return acc + (curr.horas * (membro ? calcValorHora(membro) : 0));
    }, 0);
  };

  const custoEquipe = calcCustoEtapa(levantamentos) + calcCustoEtapa(projetoEstrutural);
  const totalVariaveis = Object.values(custosVariaveis).reduce((a, b) => a + b, 0);
  const totalCombustivel = (combustivel.distancia + 7) * combustivel.visitas * 2.2 * combustivel.precoL;
  const subtotalCustos = custoEquipe + totalVariaveis + totalCombustivel;
  
  const lucroProjeto = subtotalCustos * (margemLucro / 100);
  const imposto = (subtotalCustos + lucroProjeto) * (tributacao / 100);
  const valorFinalMetodo2 = subtotalCustos + lucroProjeto + imposto;

  // Complexidade Calculation
  const complexidadeExtraPct = fatoresComplexidade
    .filter(f => f.checked)
    .reduce((acc, f) => acc + f.pct, 0);
  
  const fatorRepeticao = fatoresRepeticao[repeticaoIdx]?.fator || 1;
  const valorFinalMetodo1 = area * custoM2Base * (1 + complexidadeExtraPct / 100) * fatorRepeticao;

  useEffect(() => {
    if (activeTab === 'hora_trabalhada') setValorFinalEditado(valorFinalMetodo2);
    else if (activeTab === 'complexidade') setValorFinalEditado(valorFinalMetodo1);
  }, [activeTab, valorFinalMetodo2, valorFinalMetodo1]);

  const handleAprovar = () => {
    if (!selectedProject) return;
    
    const newProjects = { ...projects };
    Object.keys(newProjects).forEach(col => {
      newProjects[col] = newProjects[col].map(p => {
        if (p.id === selectedProject.id) {
          return { ...p, valor: valorFinalEditado, status: 'Precificado' };
        }
        return p;
      });
    });
    
    if (newProjects['A PRECIFICAR']) {
      const p = newProjects['A PRECIFICAR'].find(p => p.id === selectedProject.id);
      if (p) {
        newProjects['A PRECIFICAR'] = newProjects['A PRECIFICAR'].filter(proj => proj.id !== selectedProject.id);
        newProjects['A APRESENTAR'] = [...(newProjects['A APRESENTAR'] || []), { ...p, valor: valorFinalEditado }];
      }
    }

    setProjects(newProjects);
    alert('Proposta aprovada e enviada para o Pipeline!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Settings Modal */}
      {showSettings && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card" style={{ width: 800, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, color: 'var(--emaer-azul-principal)' }}>Configurações de Precificação</h2>
                <button className="btn-secondary" onClick={() => setShowSettings(false)}>Fechar</button>
              </div>

              <div style={{ display: 'grid', gap: 30 }}>
                {/* Repetição */}
                <section>
                  <h3 style={{ fontSize: 14, marginBottom: 15, color: 'var(--emaer-azul-medio)' }}>Fatores de Repetição</h3>
                  <table style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Fator</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {fatoresRepeticao.map((f, i) => (
                        <tr key={i}>
                          <td><input className="form-control" value={f.desc} onChange={(e) => {
                            const next = [...fatoresRepeticao]; next[i].desc = e.target.value; setFatoresRepeticao(next);
                          }} /></td>
                          <td><input type="number" className="form-control" value={f.fator} onChange={(e) => {
                            const next = [...fatoresRepeticao]; next[i].fator = Number(e.target.value); setFatoresRepeticao(next);
                          }} /></td>
                          <td><button className="btn-secondary" onClick={() => setFatoresRepeticao(fatoresRepeticao.filter((_, idx) => idx !== i))}>🗑️</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button className="btn-secondary" style={{ marginTop: 10 }} onClick={() => setFatoresRepeticao([...fatoresRepeticao, { desc: '', fator: 1 }])}>+ Adicionar linha</button>
                </section>

                {/* Média Nacional */}
                <section>
                  <h3 style={{ fontSize: 14, marginBottom: 15, color: 'var(--emaer-azul-medio)' }}>Média Nacional por m² — Fonte AltoQi</h3>
                  <table style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Região</th>
                        <th>Residencial</th>
                        <th>Predial</th>
                        <th>Comercial</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mediaNacional.map((m, i) => (
                        <tr key={i}>
                          <td><strong>{m.regiao}</strong></td>
                          <td><input type="number" className="form-control" value={m.residencial} onChange={(e) => {
                            const next = [...mediaNacional]; next[i].residencial = Number(e.target.value); setMediaNacional(next);
                          }} /></td>
                          <td><input type="number" className="form-control" value={m.predial} onChange={(e) => {
                            const next = [...mediaNacional]; next[i].predial = Number(e.target.value); setMediaNacional(next);
                          }} /></td>
                          <td><input type="number" className="form-control" value={m.comercial} onChange={(e) => {
                            const next = [...mediaNacional]; next[i].comercial = Number(e.target.value); setMediaNacional(next);
                          }} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>

                {/* Gestão de Equipe */}
                <section>
                  <h3 style={{ fontSize: 14, marginBottom: 15, color: 'var(--emaer-azul-medio)' }}>Gestão de Equipe & Salários</h3>
                  <table style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Nome/Função</th>
                        <th>Salário Base</th>
                        <th>Encargos (%)</th>
                        <th>Horas/Mês</th>
                        <th>Valor/Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipe.map((m, i) => (
                        <tr key={i}>
                          <td><input className="form-control" value={m.label} onChange={(e) => {
                            const next = [...equipe]; next[i].label = e.target.value; setEquipe(next);
                          }} /></td>
                          <td><input type="number" className="form-control" value={m.salario} onChange={(e) => {
                            const next = [...equipe]; next[i].salario = Number(e.target.value); setEquipe(next);
                          }} /></td>
                          <td><input type="number" className="form-control" value={m.encargos} onChange={(e) => {
                            const next = [...equipe]; next[i].encargos = Number(e.target.value); setEquipe(next);
                          }} /></td>
                          <td><input type="number" className="form-control" value={m.horasMes} onChange={(e) => {
                            const next = [...equipe]; next[i].horasMes = Number(e.target.value); setEquipe(next);
                          }} /></td>
                          <td style={{ fontWeight: 700 }}>{fmt(calcValorHora(m))}</td>
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

      {/* Header with Project Selection, Tabs and Settings */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
          <label style={{ fontSize: 12, color: 'var(--emaer-azul-claro)', textTransform: 'uppercase', fontWeight: 700 }}>Projeto:</label>
          <select 
            className="form-control" 
            style={{ width: 250 }}
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">Selecione um projeto...</option>
            {Object.entries(projects).map(([col, cards]) => 
              cards.map(p => <option key={p.id} value={p.id}>{p.nome} ({col})</option>)
            )}
          </select>

          <div style={{ display: 'flex', gap: 8, background: 'rgba(0,0,0,0.05)', padding: 4, borderRadius: 8 }}>
            {[
              { id: 'complexidade', label: 'Complexidade' },
              { id: 'hora_trabalhada', label: 'Hora Trabalhada' },
              { id: 'comparativo', label: 'Comparativo' },
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '8px 16px', border: 'none', borderRadius: 6, cursor: 'pointer',
                  background: activeTab === t.id ? 'var(--emaer-azul-principal)' : 'transparent',
                  color: activeTab === t.id ? '#fff' : 'var(--emaer-grafite)', 
                  fontWeight: 600, fontSize: 13, transition: 'var(--transition)'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button 
          className="btn-secondary" 
          style={{ fontSize: 20, padding: '5px 10px' }}
          onClick={() => setShowSettings(true)}
          title="Configurações de Precificação"
        >
          ⚙️
        </button>
      </div>

      <div className="two-col-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {activeTab === 'hora_trabalhada' && (
            <>
              <div className="card">
                <div className="card-body">
                  <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginBottom: 15, color: 'var(--emaer-azul-principal)' }}>Levantamentos</h3>
                  <table style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Etapa</th>
                        <th>Responsável</th>
                        <th>Horas</th>
                        <th>R$/Etapa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {levantamentos.map((item, idx) => {
                        const membro = equipe.find(m => m.id === item.responsavelId);
                        return (
                          <tr key={idx}>
                            <td>{item.etapa}</td>
                            <td>
                              <select 
                                className="form-control" 
                                style={{ padding: '4px 8px' }}
                                value={item.responsavelId}
                                onChange={(e) => {
                                  const next = [...levantamentos];
                                  next[idx].responsavelId = e.target.value;
                                  setLevantamentos(next);
                                }}
                              >
                                <option value="">─</option>
                                {equipe.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                              </select>
                            </td>
                            <td>
                              <input 
                                type="number" className="form-control" style={{ width: 60, padding: '4px 8px' }}
                                value={item.horas}
                                onChange={(e) => {
                                  const next = [...levantamentos];
                                  next[idx].horas = Number(e.target.value);
                                  setLevantamentos(next);
                                }}
                              />
                            </td>
                            <td style={{ color: 'var(--emaer-azul-claro)', fontSize: 13 }}>{fmt(item.horas * (membro ? calcValorHora(membro) : 0))}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginBottom: 15, color: 'var(--emaer-azul-principal)' }}>Projeto Estrutural</h3>
                  <table style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Etapa</th>
                        <th>Responsável</th>
                        <th>Horas</th>
                        <th>R$/Etapa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projetoEstrutural.map((item, idx) => {
                        const membro = equipe.find(m => m.id === item.responsavelId);
                        return (
                          <tr key={idx}>
                            <td>{item.etapa}</td>
                            <td>
                              <select 
                                className="form-control" 
                                style={{ padding: '4px 8px' }}
                                value={item.responsavelId}
                                onChange={(e) => {
                                  const next = [...projetoEstrutural];
                                  next[idx].responsavelId = e.target.value;
                                  setProjetoEstrutural(next);
                                }}
                              >
                                <option value="">─</option>
                                {equipe.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                              </select>
                            </td>
                            <td>
                              <input 
                                type="number" className="form-control" style={{ width: 60, padding: '4px 8px' }}
                                value={item.horas}
                                onChange={(e) => {
                                  const next = [...projetoEstrutural];
                                  next[idx].horas = Number(e.target.value);
                                  setProjetoEstrutural(next);
                                }}
                              />
                            </td>
                            <td style={{ color: 'var(--emaer-azul-claro)', fontSize: 13 }}>{fmt(item.horas * (membro ? calcValorHora(membro) : 0))}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'complexidade' && (
            <div className="card">
              <div className="card-body">
                <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginBottom: 20, color: 'var(--emaer-azul-principal)' }}>Fatores de Complexidade — Selecione os que se aplicam</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {fatoresComplexidade.map((f, i) => (
                    <div key={f.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 15px', background: 'rgba(0,0,0,0.02)', borderRadius: 8,
                      border: f.checked ? '1px solid var(--emaer-azul-medio)' : '1px solid transparent'
                    }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <input type="checkbox" checked={f.checked} onChange={() => {
                          const next = [...fatoresComplexidade]; next[i].checked = !next[i].checked; setFatoresComplexidade(next);
                        }} />
                        <span style={{ fontSize: 13 }}>{f.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <input type="number" className="form-control" style={{ width: 60, padding: '2px 5px', height: 24, fontSize: 12 }} 
                          value={f.pct} onChange={(e) => {
                            const next = [...fatoresComplexidade]; next[i].pct = Number(e.target.value); setFatoresComplexidade(next);
                          }} />
                        <span style={{ fontSize: 12, color: 'var(--emaer-azul-claro)' }}>%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 25, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div className="form-group">
                    <label className="form-label">Área do Projeto (m²)</label>
                    <input type="number" className="form-control" value={area} onChange={(e) => setArea(Number(e.target.value))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fator de Repetição</label>
                    <select className="form-control" value={repeticaoIdx} onChange={(e) => setRepeticaoIdx(Number(e.target.value))}>
                      {fatoresRepeticao.map((f, i) => <option key={i} value={i}>{f.desc} (x{f.fator})</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparativo' && (
            <div className="card">
              <div className="card-body">
                <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginBottom: 20, color: 'var(--emaer-azul-principal)' }}>Comparativo de Métodos</h3>
                <table style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Método</th>
                      <th>Valor Final</th>
                      <th>Detalhe</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ color: 'var(--emaer-azul-medio)', fontWeight: 600 }}>Complexidade</td>
                      <td style={{ fontWeight: 700 }}>{fmt(valorFinalMetodo1)}</td>
                      <td style={{ fontSize: 12, color: 'var(--emaer-azul-claro)' }}>Area x Fator + {complexidadeExtraPct}% extra</td>
                    </tr>
                    <tr>
                      <td style={{ color: 'var(--emaer-azul-principal)', fontWeight: 600 }}>Hora Trabalhada</td>
                      <td style={{ fontWeight: 700 }}>{fmt(valorFinalMetodo2)}</td>
                      <td style={{ fontSize: 12, color: 'var(--emaer-azul-claro)' }}>Baseado em equipe e horas</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginBottom: 20, color: 'var(--emaer-azul-principal)' }}>Resumo — {activeTab === 'hora_trabalhada' ? 'Método 2' : 'Método 1'}</h3>
              
              <div style={{ display: 'grid', gap: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--emaer-grafite)' }}>Subtotal Custos</span>
                  <span style={{ fontWeight: 700 }}>{fmt(activeTab === 'hora_trabalhada' ? subtotalCustos : area * custoM2Base)}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 10 }}>Margem (%)</label>
                    <input type="number" className="form-control" value={margemLucro} onChange={(e)=>setMargemLucro(Number(e.target.value))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 10 }}>Impostos (%)</label>
                    <input type="number" className="form-control" value={tributacao} onChange={(e)=>setTributacao(Number(e.target.value))} />
                  </div>
                </div>

                <div style={{ textAlign: 'left', marginTop: 20 }}>
                  <div style={{ fontSize: 11, color: 'var(--emaer-azul-claro)', textTransform: 'uppercase', fontWeight: 700 }}>Valor Final do Projeto</div>
                  <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--emaer-azul-principal)', lineHeight: 1.1, margin: '10px 0' }}>
                    {fmt(valorFinalEditado)}
                  </div>
                </div>

                <button 
                  className="btn-primary" 
                  style={{ width: '100%', padding: 15, fontSize: 16, marginTop: 10 }}
                  onClick={handleAprovar}
                  disabled={!selectedProjectId}
                >
                  Aprovar → Pipeline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
