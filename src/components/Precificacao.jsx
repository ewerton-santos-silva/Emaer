import { useState, useMemo } from 'react';

const tiposServico = [
  { label: 'Projeto Arquitetônico',   custoBase: 110 },
  { label: 'Projeto Hidrossanitário', custoBase: 85  },
  { label: 'Projeto Elétrico',        custoBase: 90  },
  { label: 'Execução de Obra',        custoBase: 650 },
  { label: 'Projeto Residencial',     custoBase: 120 },
  { label: 'Projeto Comercial',       custoBase: 150 },
  { label: 'Projeto Industrial',      custoBase: 180 },
  { label: 'Projeto Estrutural',      custoBase: 140 },
  { label: 'Consultoria',             custoBase: 95  },
  { label: 'Laudo Técnico',           custoBase: 80  },
];

const fmt = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

// Grouped for display in select
const grupos = [
  {
    label: '── Projetos de Engenharia ──',
    items: [0, 1, 2, 3, 7],  // indices
  },
  {
    label: '── Projetos Gerais ──',
    items: [4, 5, 6],
  },
  {
    label: '── Serviços ──',
    items: [8, 9],
  },
];

export default function Precificacao() {
  const [area, setArea]       = useState(150);
  const [tipoIdx, setTipoIdx] = useState(0);
  const [margem, setMargem]   = useState(30);
  const [desconto, setDesconto] = useState(0);

  const tipo = tiposServico[tipoIdx];

  const resultado = useMemo(() => {
    const custoBase       = area * tipo.custoBase;
    const comMargem       = custoBase * (1 + margem / 100);
    const total           = comMargem * (1 - desconto / 100);
    const economiaDesconto = comMargem - total;
    const lucro           = total - custoBase;
    return { custoBase, comMargem, total, economiaDesconto, lucro };
  }, [area, tipoIdx, margem, desconto]);

  // Badge for tipo category
  const getCatBadge = (idx) => {
    if ([0,1,2,3,7].includes(idx)) return { label:'Engenharia', color:'#0C447C', bg:'#EBF3FB' };
    if ([4,5,6].includes(idx))     return { label:'Geral',      color:'#185FA5', bg:'#EBF3FB' };
    return                                  { label:'Serviço',   color:'#EF9F27', bg:'#FFF8EC' };
  };
  const cat = getCatBadge(tipoIdx);

  return (
    <div className="two-col-grid">
      {/* ── Formulário ── */}
      <div className="card">
        <div className="card-body">
          <div className="section-title" style={{ marginBottom:22 }}>🧮 Calculadora de Proposta</div>

          {/* Tipo de projeto */}
          <div className="form-group">
            <label className="form-label">Tipo de Projeto / Serviço</label>
            <select
              className="form-control"
              value={tipoIdx}
              onChange={e => setTipoIdx(Number(e.target.value))}
            >
              {tiposServico.map((t, i) => (
                <option key={i} value={i}>{t.label}</option>
              ))}
            </select>

            {/* Category badge */}
            <div style={{ marginTop:8 }}>
              <span style={{
                background:cat.bg, color:cat.color, fontSize:11, fontWeight:700,
                padding:'3px 10px', borderRadius:12,
              }}>
                {cat.label}
              </span>
              <span style={{ fontSize:12, color:'#85B7EB', marginLeft:10 }}>
                Custo base: <strong>{fmt(tipo.custoBase)}/m²</strong>
              </span>
            </div>
          </div>

          {/* Área */}
          <div className="form-group">
            <label className="form-label">Área / Unidade (m²)</label>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <input
                type="number" className="form-control" value={area} min={1}
                onChange={e => setArea(Number(e.target.value))}
                style={{ flex:1 }}
              />
              <span style={{ fontSize:13, color:'#85B7EB', fontWeight:600, whiteSpace:'nowrap' }}>
                m²
              </span>
            </div>
          </div>

          {/* Custo Base - readonly */}
          <div className="form-group">
            <label className="form-label">Custo Base Total</label>
            <input
              type="text" className="form-control"
              value={fmt(resultado.custoBase)} readOnly
              style={{ background:'#f9f9f9', color:'#185FA5', fontWeight:700, cursor:'default' }}
            />
          </div>

          {/* Margem */}
          <div className="form-group">
            <label className="form-label">Margem de Lucro — {margem}%</label>
            <input
              type="range" min={0} max={100} value={margem}
              onChange={e => setMargem(Number(e.target.value))}
              style={{ width:'100%', accentColor:'#185FA5', cursor:'pointer' }}
            />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#85B7EB', marginTop:4 }}>
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>

          {/* Desconto */}
          <div className="form-group">
            <label className="form-label">Desconto Comercial — {desconto}%</label>
            <input
              type="range" min={0} max={50} value={desconto}
              onChange={e => setDesconto(Number(e.target.value))}
              style={{ width:'100%', accentColor:'#EF9F27', cursor:'pointer' }}
            />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#85B7EB', marginTop:4 }}>
              <span>0%</span><span>25%</span><span>50%</span>
            </div>
          </div>

          <button
            className="btn-primary"
            style={{ width:'100%', justifyContent:'center', marginTop:8, padding:13, fontSize:15 }}
          >
            📄 Gerar Proposta PDF
          </button>
        </div>
      </div>

      {/* ── Resultado ── */}
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

        {/* Total em destaque */}
        <div style={{
          background:'linear-gradient(135deg, #0C447C 0%, #185FA5 100%)',
          borderRadius:16, padding:28, textAlign:'center',
          boxShadow:'0 10px 30px rgba(12,68,124,0.3)',
        }}>
          <div style={{ color:'rgba(255,255,255,0.65)', fontSize:11, fontWeight:700,
            textTransform:'uppercase', letterSpacing:2, marginBottom:10 }}>
            Valor Total da Proposta
          </div>
          <div style={{ color:'#fff', fontSize:44, fontWeight:800, lineHeight:1 }}>
            {fmt(resultado.total)}
          </div>
          <div style={{ color:'rgba(255,255,255,0.55)', fontSize:13, marginTop:10 }}>
            {area} m² · {tipo.label}
          </div>

          {desconto > 0 && (
            <div style={{
              background:'rgba(239,159,39,0.18)',border:'1px solid rgba(239,159,39,0.4)',
              borderRadius:8,padding:'8px 14px',marginTop:14,
              color:'#EF9F27',fontSize:13,fontWeight:600,
            }}>
              💰 Economia do cliente: {fmt(resultado.economiaDesconto)}
            </div>
          )}
        </div>

        {/* Breakdown */}
        <div className="card">
          <div className="card-body">
            <div className="section-title" style={{ marginBottom:16 }}>Detalhamento</div>

            {[
              { label:`Custo Base (${area}m² × ${fmt(tipo.custoBase)})`, value:resultado.custoBase, color:'#444441' },
              { label:`Margem de Lucro (${margem}%)`,                    value:resultado.comMargem - resultado.custoBase, color:'#185FA5' },
              { label:`Desconto Comercial (${desconto}%)`,               value:-resultado.economiaDesconto, color:'#EF9F27', neg:true },
            ].map((row) => (
              <div key={row.label} style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'10px 0', borderBottom:'1px solid rgba(12,68,124,0.06)',
              }}>
                <span style={{ fontSize:13, color:'#444441' }}>{row.label}</span>
                <span style={{ fontWeight:700, color:row.color, fontSize:14 }}>
                  {row.neg
                    ? (resultado.economiaDesconto > 0 ? `- ${fmt(resultado.economiaDesconto)}` : '—')
                    : fmt(row.value)
                  }
                </span>
              </div>
            ))}

            {/* Lucro líquido */}
            <div style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'10px 0', borderBottom:'1px solid rgba(12,68,124,0.06)',
            }}>
              <span style={{ fontSize:13, color:'#444441' }}>Lucro Líquido</span>
              <span style={{ fontWeight:700, color:'#2E9E5B', fontSize:14 }}>
                {fmt(resultado.lucro)}
              </span>
            </div>

            <div style={{
              display:'flex', justifyContent:'space-between', paddingTop:14,
              fontWeight:800, color:'#0C447C', fontSize:19,
            }}>
              <span>Total Final</span>
              <span>{fmt(resultado.total)}</span>
            </div>
          </div>
        </div>

        {/* Resumo rápido */}
        <div className="card">
          <div className="card-body" style={{ padding:16 }}>
            <div style={{ fontSize:11, color:'#85B7EB', fontWeight:700,
              textTransform:'uppercase', letterSpacing:1.5, marginBottom:12 }}>
              Resumo Rápido
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                { label:'Tipo',      value:tipo.label },
                { label:'Área',      value:`${area} m²` },
                { label:'Custo/m²', value:fmt(tipo.custoBase) },
                { label:'Margem',   value:`${margem}%` },
                { label:'Desconto', value:`${desconto}%` },
                { label:'Lucro',    value:fmt(resultado.lucro) },
              ].map(item => (
                <div key={item.label} style={{
                  background:'#EBF3FB', borderRadius:8, padding:'8px 12px',
                }}>
                  <div style={{ fontSize:10, color:'#85B7EB', fontWeight:700,
                    textTransform:'uppercase', letterSpacing:1 }}>{item.label}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#0C447C',
                    marginTop:2, wordBreak:'break-word' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
