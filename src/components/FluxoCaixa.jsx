import { useState } from 'react';
import { formatCurrency } from './ui/Shared';
import Modal from './ui/Modal';

const initialLancamentos = [
  { id: 1, data: '05/04/2026', descricao: 'Projeto Casa Resilla - 1ª Parcela', categoria: 'Projetos', tipo: 'ENTRADA', valor: 5500, status: 'Recebido' },
  { id: 2, data: '08/04/2026', descricao: 'Aluguel Escritório', categoria: 'Fixo', tipo: 'SAÍDA', valor: 2200, status: 'Pago' },
  { id: 3, data: '10/04/2026', descricao: 'Software AltoQi - Assinatura', categoria: 'Software', tipo: 'SAÍDA', valor: 450, status: 'Pago' },
  { id: 4, data: '12/04/2026', descricao: 'Projeto Edifício Sky - Parcela Final', categoria: 'Projetos', tipo: 'ENTRADA', valor: 12000, status: 'Pendente' },
];

export default function FluxoCaixa() {
  const [lancamentos, setLancamentos] = useState(initialLancamentos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fields = [
    { name: 'data', label: 'Data', type: 'text' },
    { name: 'descricao', label: 'Descrição', type: 'text' },
    { name: 'categoria', label: 'Categoria', type: 'text' },
    { name: 'tipo', label: 'Tipo', type: 'select', options: [
      { value: 'ENTRADA', label: 'Entrada' },
      { value: 'SAÍDA', label: 'Saída' },
    ]},
    { name: 'valor', label: 'Valor (R$)', type: 'number' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'Pendente', label: 'Pendente' },
      { value: 'Pago/Recebido', label: 'Pago/Recebido' },
    ]},
  ];

  const handleSave = (formData) => {
    if (editingItem) {
      setLancamentos(prev => prev.map(l => l.id === editingItem.id ? { ...l, ...formData } : l));
    } else {
      setLancamentos([...lancamentos, { id: Date.now(), ...formData }]);
    }
  };

  const totalEntradas = lancamentos.filter(l => l.tipo === 'ENTRADA').reduce((a, b) => a + Number(b.valor), 0);
  const totalSaidas = lancamentos.filter(l => l.tipo === 'SAÍDA').reduce((a, b) => a + Number(b.valor), 0);
  const saldo = totalEntradas - totalSaidas;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Financial Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15 }}>
        <div className="card" style={{ padding: 20, borderLeft: '5px solid var(--emaer-verde)' }}>
          <div style={{ fontSize: 11, color: 'var(--emaer-verde)', fontWeight: 700 }}>ENTRADAS TOTAIS</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--emaer-azul-principal)' }}>{formatCurrency(totalEntradas)}</div>
        </div>
        <div className="card" style={{ padding: 20, borderLeft: '5px solid #ff4444' }}>
          <div style={{ fontSize: 11, color: '#ff4444', fontWeight: 700 }}>SAÍDAS TOTAIS</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--emaer-azul-principal)' }}>{formatCurrency(totalSaidas)}</div>
        </div>
        <div className="card" style={{ padding: 20, borderLeft: '5px solid var(--emaer-azul-medio)' }}>
          <div style={{ fontSize: 11, color: 'var(--emaer-azul-medio)', fontWeight: 700 }}>SALDO ATUAL</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--emaer-azul-principal)' }}>{formatCurrency(saldo)}</div>
        </div>
      </div>

      <div className="card">
        <Modal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          title={editingItem ? 'Editar Lançamento' : 'Novo Lançamento'}
          initialData={editingItem}
          fields={fields}
        />
        <div className="card-body">
          <div className="section-header" style={{ marginBottom: 20 }}>
            <div className="section-title" style={{ color: 'var(--emaer-azul-principal)' }}>Planilha de Fluxo de Caixa</div>
            <button className="btn-primary" onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>+ Novo Lançamento</button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {lancamentos.map(l => (
                  <tr key={l.id}>
                    <td style={{ color: 'var(--emaer-azul-claro)', fontWeight: 600 }}>{l.data}</td>
                    <td>{l.descricao}</td>
                    <td style={{ fontSize: 12 }}>{l.categoria}</td>
                    <td>
                      <span style={{ 
                        color: l.tipo === 'ENTRADA' ? 'var(--emaer-verde)' : '#ff4444',
                        fontWeight: 700, fontSize: 11
                      }}>{l.tipo}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: l.tipo === 'ENTRADA' ? 'var(--emaer-verde)' : 'var(--emaer-grafite)' }}>
                      {l.tipo === 'ENTRADA' ? '+' : '-'} {formatCurrency(l.valor)}
                    </td>
                    <td>
                      <span className="badge" style={{ 
                        background: l.status === 'Recebido' || l.status === 'Pago' ? 'var(--emaer-verde-light)' : 'var(--emaer-ambar-light)',
                        color: l.status === 'Recebido' || l.status === 'Pago' ? 'var(--emaer-verde)' : 'var(--emaer-ambar)'
                      }}>{l.status}</span>
                    </td>
                    <td>
                      <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => { setEditingItem(l); setIsModalOpen(true); }}>Editar</button>
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
