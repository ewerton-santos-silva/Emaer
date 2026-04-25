const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const statusConfig = {
  PENDENTE:       { cls: 'badge-ambar',     label: 'Pendente' },
  PARCIAL:        { cls: 'badge-azul-claro',label: 'Parcial' },
  PAGO:           { cls: 'badge-verde',     label: 'Pago' },
  ATIVO:          { cls: 'badge-azul',      label: 'Ativo' },
  INATIVO:        { cls: 'badge-inativo',   label: 'Inativo' },
  'EM ANDAMENTO': { cls: 'badge-azul-claro',label: 'Em Andamento' },
  'EM NEGOCIAÇÃO':{ cls: 'badge-ambar',     label: 'Em Negociação' },
  PROSPECT:       { cls: 'badge-inativo',   label: 'Prospect' },
};

export function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { cls: 'badge-inativo', label: status };
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}

export function CurrencyValue({ value, color }) {
  return (
    <span style={color ? { color } : {}}>
      {formatCurrency(value)}
    </span>
  );
}

export { formatCurrency };
