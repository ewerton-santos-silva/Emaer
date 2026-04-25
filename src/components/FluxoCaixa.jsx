import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Area, AreaChart,
} from 'recharts';
import { fluxoCaixaData, fluxoMensalData } from '../data/mockData';
import { formatCurrency } from './ui/Shared';
import Modal from './ui/Modal';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff', border: '1px solid rgba(12,68,124,0.15)',
        borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 12px rgba(12,68,124,0.1)',
      }}>
        <p style={{ color: '#85B7EB', fontSize: 12, fontWeight: 700 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.color, fontWeight: 700, fontSize: 14 }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function FluxoCaixa() {
  const [lancamentos, setLancamentos] = useState(fluxoCaixaData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fields = [
    { name: 'data', label: 'Data', type: 'text' },
    { name: 'descricao', label: 'Descrição', type: 'text' },
    { name: 'tipo', label: 'Tipo', type: 'select', options: [
      { value: 'ENTRADA', label: 'Entrada' },
      { value: 'SAÍDA', label: 'Saída' },
    ]},
    { name: 'valor', label: 'Valor', type: 'number' },
  ];

  const handleSave = (formData) => {
    const valorNum = parseFloat(formData.valor);
    if (editingItem) {
      setLancamentos(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...formData, valor: valorNum } : item));
    } else {
      const novo = {
        id: Date.now(),
        ...formData,
        valor: valorNum,
        saldo: (lancamentos[lancamentos.length - 1]?.saldo || 0) + (formData.tipo === 'ENTRADA' ? valorNum : -valorNum)
      };
      setLancamentos([...lancamentos, novo]);
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const saldoAtual = lancamentos[lancamentos.length - 1]?.saldo || 0;
  const totalEntradas = lancamentos
    .filter(l => l.tipo === 'ENTRADA').reduce((a, l) => a + l.valor, 0);
  const totalSaidas = lancamentos
    .filter(l => l.tipo === 'SAÍDA').reduce((a, l) => a + l.valor, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title={editingItem ? 'Editar Lançamento' : 'Novo Lançamento'}
        initialData={editingItem}
        fields={fields}
      />

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {[
          { label: 'SALDO ATUAL', value: saldoAtual, color: '#0C447C', border: '#0C447C' },
          { label: 'ENTRADAS (ABR)', value: totalEntradas, color: '#2E9E5B', border: '#2E9E5B' },
          { label: 'SAÍDAS (ABR)', value: totalSaidas, color: '#EF9F27', border: '#EF9F27' },
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ borderTopColor: k.border }}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color: k.color, fontSize: 22 }}>
              {formatCurrency(k.value)}
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico mensal */}
      <div className="card">
        <div className="card-body">
          <div className="section-title" style={{ marginBottom: 4 }}>Fluxo Mensal</div>
          <p style={{ fontSize: 12, color: '#85B7EB', marginBottom: 18 }}>Entradas vs Saídas — últimos 6 meses</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={fluxoMensalData}>
              <defs>
                <linearGradient id="gradEntradas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#185FA5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#185FA5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradSaidas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#85B7EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#85B7EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(12,68,124,0.08)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: '#85B7EB', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#85B7EB', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="entradas" name="Entradas"
                stroke="#185FA5" strokeWidth={2.5} fill="url(#gradEntradas)" />
              <Area type="monotone" dataKey="saidas" name="Saídas"
                stroke="#85B7EB" strokeWidth={2} fill="url(#gradSaidas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela de lançamentos */}
      <div className="card">
        <div className="card-body">
          <div className="section-header" style={{ marginBottom: 16 }}>
            <div className="section-title">Lançamentos</div>
            <button className="btn-primary" onClick={openAdd}>+ Novo Lançamento</button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Saldo Acumulado</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {lancamentos.map((l) => (
                  <tr key={l.id}>
                    <td style={{ color: '#85B7EB', fontWeight: 600 }}>{l.data}</td>
                    <td>{l.descricao}</td>
                    <td>
                      <span className={`badge ${l.tipo === 'ENTRADA' ? 'badge-verde' : 'badge-ambar'}`}>
                        {l.tipo === 'ENTRADA' ? '↑ ' : '↓ '}{l.tipo}
                      </span>
                    </td>
                    <td style={{
                      fontWeight: 700,
                      color: l.tipo === 'ENTRADA' ? '#2E9E5B' : '#EF9F27',
                    }}>
                      {l.tipo === 'ENTRADA' ? '+' : '-'} {formatCurrency(l.valor)}
                    </td>
                    <td style={{ fontWeight: 700, color: '#0C447C' }}>
                      {formatCurrency(l.saldo)}
                    </td>
                    <td>
                      <button className="btn-secondary" onClick={() => openEdit(l)} style={{ padding: '2px 8px' }}>Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
