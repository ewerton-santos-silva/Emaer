import { useState } from 'react';
import { carteiraClientesData } from '../data/mockData';
import { StatusBadge, formatCurrency } from './ui/Shared';
import Modal from './ui/Modal';

export default function CarteiraClientes() {
  const [clientes, setClientes] = useState(carteiraClientesData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fields = [
    { name: 'nome', label: 'Nome do Cliente', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'ATIVO', label: 'Ativo' },
      { value: 'EM NEGOCIAÇÃO', label: 'Em Negociação' },
      { value: 'PROSPECT', label: 'Prospect' },
    ]},
    { name: 'totalFaturado', label: 'Total Faturado (R$)', type: 'number' },
    { name: 'ultimoContato', label: 'Último Contato (dd/mm/aaaa)', type: 'text' },
  ];

  const handleSave = (formData) => {
    const faturadoNum = parseFloat(formData.totalFaturado);
    if (editingItem) {
      setClientes(prev => prev.map(c => c.id === editingItem.id ? { ...c, ...formData, totalFaturado: faturadoNum } : c));
    } else {
      const novo = {
        id: Date.now(),
        ...formData,
        totalFaturado: faturadoNum,
        projetos: 0
      };
      setClientes([...clientes, novo]);
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingItem(c);
    setIsModalOpen(true);
  };

  const totalFaturado = clientes.reduce((a, c) => a + c.totalFaturado, 0);
  const totalClientes = clientes.length;
  const ativos = clientes.filter(c => c.status === 'ATIVO').length;

  return (
    <>
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title={editingItem ? 'Editar Cliente' : 'Novo Cliente'}
        initialData={editingItem}
        fields={fields}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 22 }}>
        {[
          { label: 'TOTAL CLIENTES', value: totalClientes, isNum: true, color: '#0C447C', border: '#0C447C' },
          { label: 'FATURAMENTO TOTAL', value: formatCurrency(totalFaturado), isNum: false, color: '#185FA5', border: '#185FA5' },
          { label: 'CLIENTES ATIVOS', value: ativos, isNum: true, color: '#2E9E5B', border: '#2E9E5B' },
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ borderTopColor: k.border }}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color: k.color, fontSize: k.isNum ? 36 : 22 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-body">
          <div className="section-header" style={{ marginBottom: 16 }}>
            <div className="section-title">Base de Clientes</div>
            <button className="btn-primary" onClick={openAdd}>+ Novo Cliente</button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Total Faturado</th>
                  <th>Projetos</th>
                  <th>Último Contato</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #0C447C, #185FA5)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
                        }}>
                          {c.nome.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 600, color: '#0C447C' }}>{c.nome}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: c.totalFaturado > 0 ? '#185FA5' : '#aaa' }}>
                      {c.totalFaturado > 0 ? formatCurrency(c.totalFaturado) : '—'}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700 }}>{c.projetos}</span>
                    </td>
                    <td style={{ color: '#85B7EB', fontWeight: 600 }}>{c.ultimoContato}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>
                      <button className="btn-secondary" onClick={() => openEdit(c)} style={{ padding: '2px 8px' }}>Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
