import { useState } from 'react';
import { formatCurrency } from './ui/Shared';
import Modal from './ui/Modal';

const initialParceiros = [
  { id: 1, nome: 'Manuela Arquiteta', especialidade: 'Arquitetura Residencial', contato: '(81) 98877-6655', status: 'Ativo', valorPotencial: 45000, origem: 'Instagram' },
  { id: 2, nome: 'Pedro Estrutural', especialidade: 'Projetos Complementares', contato: '(81) 97766-5544', status: 'Prospecção', valorPotencial: 12000, origem: 'Indicação' },
  { id: 3, nome: 'Construtora Silva', especialidade: 'Execução de Obras', contato: '(81) 96655-4433', status: 'Parceiro Estratégico', valorPotencial: 150000, origem: 'Google' },
];

export default function PipelineParceiros() {
  const [parceiros, setParceiros] = useState(initialParceiros);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fields = [
    { name: 'nome', label: 'Nome do Parceiro', type: 'text' },
    { name: 'especialidade', label: 'Especialidade', type: 'text' },
    { name: 'contato', label: 'Contato', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'Prospecção', label: 'Prospecção' },
      { value: 'Ativo', label: 'Ativo' },
      { value: 'Parceiro Estratégico', label: 'Parceiro Estratégico' },
      { value: 'Inativo', label: 'Inativo' },
    ]},
    { name: 'valorPotencial', label: 'Valor Potencial (R$)', type: 'number' },
    { name: 'origem', label: 'Origem', type: 'text' },
  ];

  const handleSave = (formData) => {
    if (editingItem) {
      setParceiros(prev => prev.map(p => p.id === editingItem.id ? { ...p, ...formData } : p));
    } else {
      setParceiros([...parceiros, { id: Date.now(), ...formData }]);
    }
  };

  const openAdd = () => { setEditingItem(null); setIsModalOpen(true); };
  const openEdit = (p) => { setEditingItem(p); setIsModalOpen(true); };

  return (
    <div className="card">
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title={editingItem ? 'Editar Parceiro' : 'Novo Parceiro'}
        initialData={editingItem}
        fields={fields}
      />
      <div className="card-body">
        <div className="section-header" style={{ marginBottom: 20 }}>
          <div className="section-title" style={{ color: 'var(--emaer-azul-principal)' }}>Planilha de Prospecção de Parceiros</div>
          <button className="btn-primary" onClick={openAdd}>+ Novo Parceiro</button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome do Parceiro</th>
                <th>Especialidade</th>
                <th>Contato</th>
                <th>Status</th>
                <th>Valor Potencial</th>
                <th>Origem</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {parceiros.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: 'var(--emaer-azul-principal)' }}>{p.nome}</td>
                  <td>{p.especialidade}</td>
                  <td style={{ fontSize: 13 }}>{p.contato}</td>
                  <td>
                    <span className="badge" style={{ 
                      background: p.status === 'Ativo' ? 'var(--emaer-verde-light)' : 'var(--emaer-ambar-light)',
                      color: p.status === 'Ativo' ? 'var(--emaer-verde)' : 'var(--emaer-ambar)'
                    }}>{p.status}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{formatCurrency(p.valorPotencial)}</td>
                  <td style={{ fontSize: 12, color: 'var(--emaer-azul-claro)' }}>{p.origem}</td>
                  <td>
                    <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => openEdit(p)}>Editar</button>
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
