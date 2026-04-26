import { useState, useMemo, useEffect } from 'react';

const fmt = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const responsaveis = [
  { id: 'eng_dono', label: 'Engenheiro - Dono', valorHora: 150 },
  { id: 'eng_colab', label: 'Engenheiro - colaborador', valorHora: 100 },
  { id: 'estagiario_1', label: 'Estagiário 1', valorHora: 45 },
  { id: 'estagiario_2', label: 'Estagiário 2', valorHora: 35 },
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
  
  // Method 2 State
  const [levantamentos, setLevantamentos] = useState(defaultLevantamentos);
  const [projetoEstrutural, setProjetoEstrutural] = useState(defaultProjetoEstrutural);
  const [custosVariaveis, setCustosVariaveis] = useState({
    renders: 0, plotagens: 0, taxas: 0, placa: 0, brindes: 0, art: 0
  });
  const [combustivel, setCombustivel] = useState({ visitas: 0, distancia: 0, precoL: 0 });
  const [margemLucro, setMargemLucro] = useState(30);
  const [tributacao, setTributacao] = useState(11);
  const [valorFinalEditado, setValorFinalEditado] = useState(0);

  // Method 1 State (Complexidade) - Mocking some factors based on Image 4 details
  const [area, setArea] = useState(100);
  const [complexidadeFator, setComplexidadeFator] = useState(28.8); // R$/m²

  const selectedProject = useMemo(() => 
    Object.values(projects).flat().find(p => p.id === Number(selectedProjectId))
  , [projects, selectedProjectId]);

  useEffect(() => {
    if (selectedProject) {
      setArea(selectedProject.area || 100);
    }
  }, [selectedProject]);

  const calcCustoEtapa = (etapas) => {
    return etapas.reduce((acc, curr) => {
      const resp = responsaveis.find(r => r.id === curr.responsavelId);
      return acc + (curr.horas * (resp ? resp.valorHora : 0));
    }, 0);
  };

  const custoEquipe = calcCustoEtapa(levantamentos) + calcCustoEtapa(projetoEstrutural);
  const totalVariaveis = Object.values(custosVariaveis).reduce((a, b) => a + b, 0);
  const totalCombustivel = (combustivel.distancia + 7) * combustivel.visitas * 2.2 * combustivel.precoL;
  const subtotalCustos = custoEquipe + totalVariaveis + totalCombustivel;
  
  const lucroProjeto = subtotalCustos * (margemLucro / 100);
  const imposto = (subtotalCustos + lucroProjeto) * (tributacao / 100);
  const valorFinalMetodo2 = subtotalCustos + lucroProjeto + imposto;

  const valorFinalMetodo1 = area * complexidadeFator;
  const mediaNacional = area * 15.2; // Based on Image 4 "Média de Mercado"

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
    
    // Move from "A PRECIFICAR" to "A APRESENTAR" if possible
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
      {/* Header with Project Selection and Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <label style={{ fontSize: 12, color: 'var(--emaer-text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Projeto:</label>
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
        </div>

        <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.05)', padding: 4, borderRadius: 8 }}>
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
                background: activeTab === t.id ? 'var(--emaer-red)' : 'transparent',
                color: '#fff', fontWeight: 600, fontSize: 13, transition: 'var(--transition)'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="two-col-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
        {/* Left Column: Inputs based on Tab */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {activeTab === 'hora_trabalhada' && (
            <>
              {/* LEVANTAMENTOS */}
              <div className="card">
                <div className="card-body">
                  <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginBottom: 15 }}>Levantamentos</h3>
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
                        const resp = responsaveis.find(r => r.id === item.responsavelId);
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
                                {responsaveis.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
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
                            <td style={{ color: 'var(--emaer-text-dim)', fontSize: 13 }}>{fmt(item.horas * (resp ? resp.valorHora : 0))}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PROJETO ESTRUTURAL */}
              <div className="card">
                <div className="card-body">
                  <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginBottom: 15 }}>Projeto Estrutural</h3>
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
                        const resp = responsaveis.find(r => r.id === item.responsavelId);
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
                                {responsaveis.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
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
                            <td style={{ color: 'var(--emaer-text-dim)', fontSize: 13 }}>{fmt(item.horas * (resp ? resp.valorHora : 0))}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CUSTOS VARIÁVEIS */}
              <div className="card">
                <div className="card-body">
                  <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginBottom: 15 }}>Custos Variáveis do Projeto</h3>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {Object.entries({
                      renders: 'Renders', plotagens: 'Plotagens', taxas: 'Taxas de Prefeitura',
                      placa: 'Placa de Obra', brindes: 'Brindes', art: 'ART'
                    }).map(([key, label]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13 }}>{label}</span>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 10, top: 10, fontSize: 12, color: 'var(--emaer-text-dim)' }}>R$</span>
                          <input 
                            type="number" className="form-control" style={{ width: 120, paddingLeft: 30 }}
                            value={custosVariaveis[key]}
                            onChange={(e) => setCustosVariaveis(p => ({ ...p, [key]: Number(e.target.value) }))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--emaer-border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--emaer-text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Combustível — Auto-calculado</div>
                    <div style={{ display: 'grid', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13 }}>Qtd. Visitas à obra</span>
                        <input 
                          type="number" className="form-control" style={{ width: 120 }}
                          value={combustivel.visitas}
                          onChange={(e) => setCombustivel(p => ({ ...p, visitas: Number(e.target.value) }))}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13 }}>Distância ao local (km)</span>
                        <input 
                          type="number" className="form-control" style={{ width: 120 }}
                          value={combustivel.distancia}
                          onChange={(e) => setCombustivel(p => ({ ...p, distancia: Number(e.target.value) }))}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13 }}>R$/litro combustível</span>
                        <input 
                          type="number" className="form-control" style={{ width: 120 }}
                          value={combustivel.precoL}
                          onChange={(e) => setCombustivel(p => ({ ...p, precoL: Number(e.target.value) }))}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 13, fontWeight: 700 }}>
                        <span style={{ color: 'var(--emaer-text-dim)', fontSize: 11 }}>Combustível total (km+7 × visitas × 2,2 × R$/L)</span>
                        <span>{fmt(totalCombustivel)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'complexidade' && (
            <div className="card">
              <div className="card-body">
                <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginBottom: 20 }}>Cálculo por Complexidade</h3>
                <div className="form-group">
                  <label className="form-label">Área do Projeto (m²)</label>
                  <input 
                    type="number" className="form-control" 
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Complexidade (R$/m²)</label>
                  <select 
                    className="form-control"
                    value={complexidadeFator}
                    onChange={(e) => setComplexidadeFator(Number(e.target.value))}
                  >
                    <option value={15.2}>Baixa (R$ 15,20/m²)</option>
                    <option value={22.5}>Média (R$ 22,50/m²)</option>
                    <option value={28.8}>Alta (R$ 28,80/m²)</option>
                    <option value={35.0}>Premium (R$ 35,00/m²)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparativo' && (
            <div className="card">
              <div className="card-body">
                <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginBottom: 20 }}>Comparativo de Métodos</h3>
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
                      <td style={{ color: 'var(--emaer-cyan)', fontWeight: 600 }}>Complexidade</td>
                      <td style={{ fontWeight: 700 }}>{fmt(valorFinalMetodo1)}</td>
                      <td style={{ fontSize: 12, color: 'var(--emaer-text-dim)' }}>R$ {complexidadeFator}/m²</td>
                    </tr>
                    <tr>
                      <td style={{ color: 'var(--emaer-red)', fontWeight: 600 }}>Hora Trabalhada</td>
                      <td style={{ fontWeight: 700 }}>{fmt(valorFinalMetodo2)}</td>
                      <td style={{ fontSize: 12, color: 'var(--emaer-text-dim)' }}>{levantamentos.reduce((a,b)=>a+b.horas,0) + projetoEstrutural.reduce((a,b)=>a+b.horas,0)}h estimadas</td>
                    </tr>
                    <tr>
                      <td style={{ color: 'var(--emaer-green)', fontWeight: 600 }}>Média dos Métodos</td>
                      <td style={{ fontWeight: 700 }}>{fmt((valorFinalMetodo1 + valorFinalMetodo2) / 2)}</td>
                      <td style={{ fontSize: 12, color: 'var(--emaer-text-dim)' }}>Sugerido</td>
                    </tr>
                    <tr>
                      <td style={{ color: 'var(--emaer-yellow)', fontWeight: 600 }}>Média de Mercado (Nacional)</td>
                      <td style={{ fontWeight: 700 }}>{fmt(mediaNacional)}</td>
                      <td style={{ fontSize: 12, color: 'var(--emaer-text-dim)' }}>R$ 15,2/m² - fonte AltoQi</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Summary and Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ position: 'sticky', top: 20 }}>
            <div className="card-body">
              <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginBottom: 20 }}>Resumo — {activeTab === 'hora_trabalhada' ? 'Método 2' : 'Método 1'}</h3>
              
              <div style={{ display: 'grid', gap: 15 }}>
                {activeTab === 'hora_trabalhada' ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--emaer-text-dim)' }}>Custo Equipe</span>
                      <span>{fmt(custoEquipe)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--emaer-text-dim)' }}>Custo Fixo do Projeto</span>
                      <span>{fmt(0)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--emaer-text-dim)' }}>Custos Variáveis</span>
                      <span>{fmt(totalVariaveis + totalCombustivel)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--emaer-border)', paddingTop: 10, fontWeight: 700 }}>
                      <span>Subtotal Custos</span>
                      <span>{fmt(subtotalCustos)}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>Subtotal (Área × Fator)</span>
                    <span>{fmt(valorFinalMetodo1)}</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 10 }}>Margem de Lucro (%)</label>
                    <input type="number" className="form-control" value={margemLucro} onChange={(e)=>setMargemLucro(Number(e.target.value))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 10 }}>Tributação (%)</label>
                    <input type="number" className="form-control" value={tributacao} onChange={(e)=>setTributacao(Number(e.target.value))} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--emaer-text-dim)' }}>
                  <span>Lucro do Projeto ({margemLucro}%)</span>
                  <span>{fmt(lucroProjeto)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--emaer-text-dim)' }}>
                  <span>Imposto ({tributacao}%)</span>
                  <span>{fmt(imposto)}</span>
                </div>

                <div style={{ textAlign: 'left', marginTop: 20 }}>
                  <div style={{ fontSize: 11, color: 'var(--emaer-text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Valor Final do Projeto</div>
                  <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--emaer-red)', lineHeight: 1.1, margin: '10px 0' }}>
                    {fmt(valorFinalEditado)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--emaer-text-dim)' }}>
                    R$ {(valorFinalEditado / area).toFixed(2)}/m² · {activeTab === 'hora_trabalhada' ? 'h estimadas' : 'fator fixo'}
                  </div>
                </div>

                <div style={{ marginTop: 20 }}>
                  <label className="form-label">Editar valor antes de aprovar</label>
                  <input 
                    type="number" className="form-control" 
                    style={{ border: '1px solid var(--emaer-red)', background: 'rgba(211, 47, 47, 0.05)' }}
                    value={valorFinalEditado}
                    onChange={(e) => setValorFinalEditado(Number(e.target.value))}
                  />
                  <p style={{ fontSize: 10, color: 'var(--emaer-text-dim)', marginTop: 5 }}>Calculado automaticamente · edite se necessário</p>
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
