import { useState } from 'react';
import { parceirosAtivosData } from '../data/mockData';
import { StatusBadge } from './ui/Shared';
import Modal from './ui/Modal';

export default function ParceirosAtivos() {
  const [parceiros, setParceiros] = useState(parceirosAtivosData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fields = [
    { name: 'nome', label: 'Nome do Parceiro', type: 'text' },
    { name: 'tipo', label: 'Tipo de Empresa', type: 'text' },
    { name: 'comissao', label: 'Comissão (%)', type: 'number' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'ATIVO', label: 'Ativo' },
      { value: 'PENDENTE', label: 'Pendente' },
      { value: 'INATIVO', label: 'Inativo' },
    ]},
  ];

  const handleSave = (formData) => {
    const comissaoNum = parseFloat(formData.comissao);
    if (editingItem) {
      setParceiros(prev => prev.map(p => p.id === editingItem.id ? { ...p, ...formData, comissao: comissaoNum } : p));
    } else {
      const novo = {
        id: Date.now(),
        ...formData,
        comissao: comissaoNum,
        projetos: 0
      };
      setParceiros([...parceiros, novo]);
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingItem(p);
    setIsModalOpen(true);
  };

  return (
    <div className="card">
      <div className="card-body">
        <Modal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          title={editingItem ? 'Editar Parceiro' : 'Novo Parceiro'}
          initialData={editingItem}
          fields={fields}
        />

        <div className="section-header" style={{ marginBottom: 20 }}>
          <div className="section-title">
            Parceiros Ativos
            <span className="badge badge-azul">
              {parceiros.filter(p => p.status === 'ATIVO').length} ativos
            </span>
          </div>
          <button className="btn-primary" onClick={openAdd}>+ Novo Parceiro</button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Comissão %</th>
                <th>Projetos Vinculados</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {parceiros.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: '#0C447C' }}>{p.nome}</td>
                  <td>
                    <span style={{
                      background: '#EBF3FB', color: '#185FA5',
                      padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                    }}>{p.tipo}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: p.comissao > 0 ? '#EF9F27' : '#aaa' }}>
                      {p.comissao > 0 ? `${p.comissao}%` : '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{p.projetos}</span>
                    <span style={{ color: '#aaa', fontSize: 12, marginLeft: 4 }}>
                      {p.projetos === 1 ? 'projeto' : 'projetos'}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button 
                        onClick={() => openEdit(p)}
                        style={{
                          background: '#EBF3FB', border: 'none', borderRadius: 6,
                          padding: '5px 10px', color: '#185FA5', cursor: 'pointer',
                          fontSize: 12, fontWeight: 600,
                        }}>Editar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
