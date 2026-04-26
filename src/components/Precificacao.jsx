import { useState, useMemo } from 'react';

const fmt = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function Precificacao({ projects, setProjects }) {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [activeTab, setActiveTab] = useState('hora_trabalhada');
  
  // -- EQUIPE --
  const [equipe, setEquipe] = useState([
    { id: 1, cargo: 'Engenheiro', horasMes: 160, salario: 15000, cFixo: 0 },
    { id: 2, cargo: 'Estagiário', horasMes: 120, salario: 1500, cFixo: 0 },
  ]);
  const addMembro = () => setEquipe([...equipe, { id: Date.now(), cargo: '', horasMes: 160, salario: 0, cFixo: 0 }]);
  const delMembro = (id) => setEquipe(equipe.filter(m => m.id !== id));

  // -- CUSTOS FIXOS --
  const [custosFixos, setCustosFixos] = useState([
    { id: 1, item: 'Aluguel', valor: 1500 },
    { id: 2, item: 'Luz', valor: 300 },
    { id: 3, item: 'Água', valor: 300 },
    { id: 4, item: 'Internet', valor: 150 },
    { id: 5, item: 'Licenças de Software', valor: 1000 },
    { id: 6, item: 'Marketing', valor: 1000 },
    { id: 7, item: 'CREA (Anuidade + 12)', valor: 200 },
  ]);
  const [horasBaseFixo, setHorasBaseFixo] = useState(160);
  const addCustoFixo = () => setCustosFixos([...custosFixos, { id: Date.now(), item: '', valor: 0 }]);
  const delCustoFixo = (id) => setCustosFixos(custosFixos.filter(c => c.id !== id));

  // -- LEVANTAMENTOS --
  const [levantamentos, setLevantamentos] = useState([
    { id: 1, etapa: 'Reunião de briefing', responsavelId: '', horas: 0 },
    { id: 2, etapa: 'Visita ao local', responsavelId: '', horas: 0 },
    { id: 3, etapa: 'Levantamentos In Loco', responsavelId: '', horas: 0 },
    { id: 4, etapa: 'Documentação', responsavelId: '', horas: 0 },
    { id: 5, etapa: 'Criação da proposta', responsavelId: '', horas: 0 },
  ]);
  const addLevantamento = () => setLevantamentos([...levantamentos, { id: Date.now(), etapa: '', responsavelId: '', horas: 0 }]);
  const delLevantamento = (id) => setLevantamentos(levantamentos.filter(l => l.id !== id));

  // -- PROJETO ESTRUTURAL --
  const [projetoEstrutural, setProjetoEstrutural] = useState([
    { id: 1, etapa: 'Concepção', responsavelId: '', horas: 0 },
    { id: 2, etapa: 'Modelagem', responsavelId: '', horas: 0 },
    { id: 3, etapa: 'Análise', responsavelId: '', horas: 0 },
    { id: 4, etapa: 'Dimensionamento', responsavelId: '', horas: 0 },
    { id: 5, etapa: 'Compatibilização', responsavelId: '', horas: 0 },
    { id: 6, etapa: 'Otimização', responsavelId: '', horas: 0 },
    { id: 7, etapa: 'Detalhamento', responsavelId: '', horas: 0 },
    { id: 8, etapa: 'Correção', responsavelId: '', horas: 0 },
    { id: 9, etapa: 'Plotagem', responsavelId: '', horas: 0 },
    { id: 10, etapa: 'Reunião de entrega', responsavelId: '', horas: 0 },
  ]);
  const addEstrutural = () => setProjetoEstrutural([...projetoEstrutural, { id: Date.now(), etapa: '', responsavelId: '', horas: 0 }]);
  const delEstrutural = (id) => setProjetoEstrutural(projetoEstrutural.filter(p => p.id !== id));

  // -- CUSTOS VARIÁVEIS --
  const [custosVariaveis, setCustosVariaveis] = useState([
    { id: 1, item: 'Renders', valor: 0 },
    { id: 2, item: 'Plotagens extras', valor: 0 },
  ]);
  const addVariavel = () => setCustosVariaveis([...custosVariaveis, { id: Date.now(), item: '', valor: 0 }]);
  const delVariavel = (id) => setCustosVariaveis(custosVariaveis.filter(v => v.id !== id));

  // -- MARGENS --
  const [margemLucro, setMargemLucro] = useState(30);
  const [tributacao, setTributacao] = useState(11);
  const [valorEditado, setValorEditado] = useState(0);

  // -- CALCULOS --
  const calcValorHoraMembro = (m) => (m.salario * (1 + m.cFixo/100)) / m.horasMes;
  const totalFixosMensal = custosFixos.reduce((a, b) => a + b.valor, 0);
  const custoFixoHoraEscritorio = totalFixosMensal / horasBaseFixo;

  const totalHorasProjeto = [...levantamentos, ...projetoEstrutural].reduce((a, b) => a + b.horas, 0);
  const custoFixoProjeto = totalHorasProjeto * custoFixoHoraEscritorio;

  const custoEquipe = [...levantamentos, ...projetoEstrutural].reduce((acc, curr) => {
    const membro = equipe.find(m => m.id === Number(curr.responsavelId));
    return acc + (curr.horas * (membro ? calcValorHoraMembro(membro) : 0));
  }, 0);

  const totalVariaveis = custosVariaveis.reduce((a, b) => a + b.valor, 0);
  const subtotalCustos = custoEquipe + custoFixoProjeto + totalVariaveis;

  const valorFinalAuto = subtotalCustos / (1 - (margemLucro + tributacao) / 100);
  const valorExibido = valorEditado > 0 ? valorEditado : valorFinalAuto;

  const lucroValor = valorExibido * (margemLucro / 100);
  const impostoValor = valorExibido * (tributacao / 100);

  const selectedProject = useMemo(() => 
    Object.values(projects).flat().find(p => p.id === Number(selectedProjectId))
  , [projects, selectedProjectId]);

  const handleAprovar = () => {
    if (!selectedProject) return;
    const next = { ...projects };
    Object.keys(next).forEach(col => {
      next[col] = next[col].map(p => p.id === selectedProject.id ? { ...p, valor: valorExibido, status: 'Precificado' } : p);
    });
    setProjects(next);
    alert('Proposta enviada ao Pipeline!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
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
                color: activeTab === t ? '#fff' : '#666', fontWeight: 600, fontSize: 12
              }}>{t.replace('_', ' ').toUpperCase()}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Gestão de Equipe */}
          <div className="card">
            <div className="card-body">
              <h4 style={{ marginBottom: 15, fontSize: 13, textTransform: 'uppercase' }}>Gestão de Equipe</h4>
              <table style={{ width: '100%' }}>
                <thead><tr><th>Cargo</th><th>H/Mês</th><th>Salário</th><th>% C.Fixo</th><th></th></tr></thead>
                <tbody>
                  {equipe.map((m, i) => (
                    <tr key={m.id}>
                      <td><input className="form-control" value={m.cargo} onChange={(e) => {
                        const n = [...equipe]; n[i].cargo = e.target.value; setEquipe(n);
                      }} /></td>
                      <td><input type="number" className="form-control" value={m.horasMes} onChange={(e) => {
                        const n = [...equipe]; n[i].horasMes = Number(e.target.value); setEquipe(n);
                      }} /></td>
                      <td><input type="number" className="form-control" value={m.salario} onChange={(e) => {
                        const n = [...equipe]; n[i].salario = Number(e.target.value); setEquipe(n);
                      }} /></td>
                      <td><input type="number" className="form-control" value={m.cFixo} onChange={(e) => {
                        const n = [...equipe]; n[i].cFixo = Number(e.target.value); setEquipe(n);
                      }} /></td>
                      <td><button onClick={()=>delMembro(m.id)} style={{border:'none',background:'none',cursor:'pointer'}}>🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn-secondary" style={{ marginTop: 10, fontSize: 11 }} onClick={addMembro}>+ Adicionar membro</button>
            </div>
          </div>

          {/* Custos Fixos Escritório */}
          <div className="card">
            <div className="card-body">
              <h4 style={{ marginBottom: 15, fontSize: 13, textTransform: 'uppercase' }}>Custos Fixos do Escritório</h4>
              <div style={{ display: 'flex', gap: 20, marginBottom: 15 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#999' }}>HORAS BASE (DIVISOR)</div>
                  <input type="number" className="form-control" value={horasBaseFixo} onChange={(e)=>setHorasBaseFixo(Number(e.target.value))} />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#999' }}>CUSTO/HORA</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{fmt(custoFixoHoraEscritorio)}/h</div>
                </div>
              </div>
              <table style={{ width: '100%' }}>
                <thead><tr><th>Item</th><th>R$/Mês</th><th></th></tr></thead>
                <tbody>
                  {custosFixos.map((c, i) => (
                    <tr key={c.id}>
                      <td><input className="form-control" value={c.item} onChange={(e) => {
                        const n = [...custosFixos]; n[i].item = e.target.value; setCustosFixos(n);
                      }} /></td>
                      <td><input type="number" className="form-control" value={c.valor} onChange={(e) => {
                        const n = [...custosFixos]; n[i].valor = Number(e.target.value); setCustosFixos(n);
                      }} /></td>
                      <td><button onClick={()=>delCustoFixo(c.id)} style={{border:'none',background:'none',cursor:'pointer'}}>🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn-secondary" style={{ marginTop: 10, fontSize: 11 }} onClick={addCustoFixo}>+ Adicionar item</button>
            </div>
          </div>

          {/* Levantamentos */}
          <div className="card">
            <div className="card-body">
              <h4 style={{ marginBottom: 15, fontSize: 13, textTransform: 'uppercase' }}>Levantamentos</h4>
              <table style={{ width: '100%' }}>
                <thead><tr><th>Etapa</th><th>Responsável</th><th>Horas</th><th></th></tr></thead>
                <tbody>
                  {levantamentos.map((l, i) => (
                    <tr key={l.id}>
                      <td><input className="form-control" value={l.etapa} onChange={(e) => {
                        const n = [...levantamentos]; n[i].etapa = e.target.value; setLevantamentos(n);
                      }} /></td>
                      <td><select className="form-control" value={l.responsavelId} onChange={(e) => {
                        const n = [...levantamentos]; n[i].responsavelId = e.target.value; setLevantamentos(n);
                      }}>
                        <option value="">─</option>
                        {equipe.map(m => <option key={m.id} value={m.id}>{m.cargo}</option>)}
                      </select></td>
                      <td><input type="number" className="form-control" value={l.horas} onChange={(e) => {
                        const n = [...levantamentos]; n[i].horas = Number(e.target.value); setLevantamentos(n);
                      }} /></td>
                      <td><button onClick={()=>delLevantamento(l.id)} style={{border:'none',background:'none',cursor:'pointer'}}>🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn-secondary" style={{ marginTop: 10, fontSize: 11 }} onClick={addLevantamento}>+ Adicionar etapa</button>
            </div>
          </div>

          {/* Projeto Estrutural */}
          <div className="card">
            <div className="card-body">
              <h4 style={{ marginBottom: 15, fontSize: 13, textTransform: 'uppercase' }}>Projeto Estrutural</h4>
              <table style={{ width: '100%' }}>
                <thead><tr><th>Etapa</th><th>Responsável</th><th>Horas</th><th>R$/Etapa</th><th></th></tr></thead>
                <tbody>
                  {projetoEstrutural.map((p, i) => {
                    const membro = equipe.find(m => m.id === Number(p.responsavelId));
                    const valorEtapa = p.horas * (membro ? calcValorHoraMembro(membro) : 0);
                    return (
                      <tr key={p.id}>
                        <td><input className="form-control" value={p.etapa} onChange={(e) => {
                          const n = [...projetoEstrutural]; n[i].etapa = e.target.value; setProjetoEstrutural(n);
                        }} /></td>
                        <td><select className="form-control" value={p.responsavelId} onChange={(e) => {
                          const n = [...projetoEstrutural]; n[i].responsavelId = e.target.value; setProjetoEstrutural(n);
                        }}>
                          <option value="">─</option>
                          {equipe.map(m => <option key={m.id} value={m.id}>{m.cargo}</option>)}
                        </select></td>
                        <td><input type="number" className="form-control" value={p.horas} onChange={(e) => {
                          const n = [...projetoEstrutural]; n[i].horas = Number(e.target.value); setProjetoEstrutural(n);
                        }} /></td>
                        <td style={{ fontSize: 12, fontWeight: 600 }}>{fmt(valorEtapa)}</td>
                        <td><button onClick={()=>delEstrutural(p.id)} style={{border:'none',background:'none',cursor:'pointer'}}>🗑️</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <button className="btn-secondary" style={{ marginTop: 10, fontSize: 11 }} onClick={addEstrutural}>+ Adicionar etapa</button>
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-body">
              <h4 style={{ marginBottom: 20, fontSize: 13, textTransform: 'uppercase' }}>Resumo - Método 2</h4>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}><span>Custo Equipe</span><span>{fmt(custoEquipe)}</span></div>
                <div style={{ display:'flex', justifyContent:'space-between' }}><span>Custo Fixo do Projeto</span><span>{fmt(custoFixoProjeto)}</span></div>
                <div style={{ display:'flex', justifyContent:'space-between' }}><span>Custos Variáveis</span><span>{fmt(totalVariaveis)}</span></div>
                <div style={{ display:'flex', justifyContent:'space-between', fontWeight: 800, borderTop: '1px solid #eee', paddingTop: 10 }}>
                  <span>Subtotal Custos</span><span>{fmt(subtotalCustos)}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                  <div className="form-group">
                    <label className="form-label">MARGEM (%)</label>
                    <input type="number" className="form-control" value={margemLucro} onChange={(e)=>setMargemLucro(Number(e.target.value))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">TRIBUTAÇÃO (%)</label>
                    <input type="number" className="form-control" value={tributacao} onChange={(e)=>setTributacao(Number(e.target.value))} />
                  </div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}><span>Lucro do Projeto ({margemLucro}%)</span><span>{fmt(lucroValor)}</span></div>
                <div style={{ display:'flex', justifyContent:'space-between' }}><span>Imposto ({tributacao}%)</span><span>{fmt(impostoValor)}</span></div>
                
                <div style={{ marginTop: 20, padding: 15, background: '#f9f9f9', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase' }}>Valor Final do Projeto</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#d32f2f' }}>{fmt(valorExibido)}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{totalHorasProjeto}h estimadas</div>
                </div>

                <div style={{ marginTop: 15 }}>
                  <label className="form-label">Editar valor antes de aprovar</label>
                  <input type="number" className="form-control" style={{ borderColor: '#d32f2f' }} value={valorEditado} onChange={(e)=>setValorEditado(Number(e.target.value))} />
                  <p style={{ fontSize: 10, color: '#aaa', marginTop: 4 }}>Calculado automaticamente • edite se necessário</p>
                </div>

                <button className="btn-primary" style={{ width: '100%', padding: 15, marginTop: 10, background: '#2E9E5B' }} onClick={handleAprovar} disabled={!selectedProjectId}>
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
