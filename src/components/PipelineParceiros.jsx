import { useState } from 'react';
import { formatCurrency } from './ui/Shared';
import Modal from './ui/Modal';

const initialParceiros = [
  { 
    id: 1, nome: 'Igor Cabral', origem: 'Google', profissao: 'Arquiteto', 
    instagram: '@igorcabral', seguidores: '1.2k', obs: 'Interesse em estrutural', 
    cidade: 'Recife/PE', telefone: '(81) 99988-7766', etapa: 'Entrar em contato', 
    prioridade: 'Alta', dataPrimeiro: '20/04/26', dataUltimo: '22/04/26', proxima: '25/04/26'
  },
  { 
    id: 2, nome: 'Manuela arq', origem: 'Instagram', profissao: 'Arquiteto', 
    instagram: '@manuela.arq', seguidores: '5k', obs: 'Parceiro antigo', 
    cidade: 'Olinda/PE', telefone: '(81) 98877-6655', etapa: 'Reunião agendada', 
    prioridade: 'Média', dataPrimeiro: '15/04/26', dataUltimo: '18/04/26', proxima: '26/04/26'
  },
];

export default function PipelineParceiros() {
  const [parceiros, setParceiros] = useState(initialParceiros);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleSave = (formData) => {
    if (editingItem) setParceiros(prev => prev.map(p => p.id === editingItem.id ? { ...p, ...formData } : p));
    else setParceiros([...parceiros, { id: Date.now(), ...formData }]);
    setIsModalOpen(false);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div style={{ background: 'var(--emaer-red, #d32f2f)', color: '#fff', padding: '10px 20px', textAlign: 'center', fontWeight: 800, fontSize: 16, textTransform: 'uppercase', marginBottom: 20 }}>
          PROSPECÇÃO ATIVA
        </div>

        <div className="section-header" style={{ marginBottom: 20 }}>
          <div className="section-title">Parceiros em Prospecção</div>
          <button className="btn-primary" onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>+ Novo Parceiro</button>
        </div>

        <div className="table-container" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 1200 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th>Nome do Contato</th>
                <th>Origem</th>
                <th>Profissão</th>
                <th>@ Instagram</th>
                <th>Seguidores</th>
                <th>Obs. Lead</th>
                <th>Cidade/Estado</th>
                <th>Telefone/WA</th>
                <th>Etapa Atual</th>
                <th>Prioridade</th>
                <th>Próxima Ação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {parceiros.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.nome}</td>
                  <td>{p.origem}</td>
                  <td>{p.profissao}</td>
                  <td style={{ color: 'var(--emaer-azul-claro)' }}>{p.instagram}</td>
                  <td>{p.seguidores}</td>
                  <td style={{ fontSize: 11, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.obs}</td>
                  <td>{p.cidade}</td>
                  <td style={{ fontSize: 11 }}>{p.telefone}</td>
                  <td>
                    <span style={{ background: '#fff9c4', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{p.etapa}</span>
                  </td>
                  <td>
                    <span style={{ background: p.prioridade === 'Alta' ? '#ffebee' : '#f5f5f5', color: p.prioridade === 'Alta' ? '#d32f2f' : '#666', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{p.prioridade}</span>
                  </td>
                  <td style={{ color: 'var(--emaer-ambar)', fontWeight: 700 }}>{p.proxima}</td>
                  <td>
                    <button className="btn-secondary" style={{ padding: '2px 6px', fontSize: 10 }} onClick={() => { setEditingItem(p); setIsModalOpen(true); }}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          title={editingItem ? 'Editar Parceiro' : 'Novo Parceiro'}
          initialData={editingItem}
          fields={[
            { name: 'nome', label: 'Nome do Contato', type: 'text' },
            { name: 'profissao', label: 'Profissão', type: 'text' },
            { name: 'origem', label: 'Origem', type: 'text' },
            { name: 'instagram', label: '@ Instagram', type: 'text' },
            { name: 'seguidores', label: 'Seguidores', type: 'text' },
            { name: 'cidade', label: 'Cidade/Estado', type: 'text' },
            { name: 'telefone', label: 'Telefone/WhatsApp', type: 'text' },
            { name: 'etapa', label: 'Etapa Atual', type: 'text' },
            { name: 'prioridade', label: 'Prioridade', type: 'text' },
            { name: 'obs', label: 'Observações Lead', type: 'textarea' },
            { name: 'proxima', label: 'Próxima Ação', type: 'text' },
          ]}
        />
      )}
    </div>
  );
}
