import { useState } from 'react';
import Modal from './ui/Modal';

const profissoes = [
  'Arquiteto', 'Engenheiro', 'Construtora/Incorporadora', 'Mestre de Obra', 'Empreiteiro', 'Outros'
];

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
  const [filterProfissao, setFilterProfissao] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const filtered = parceiros.filter(p => filterProfissao === 'Todas' || p.profissao === filterProfissao);

  const handleSave = (formData) => {
    if (editingItem) setParceiros(prev => prev.map(p => p.id === editingItem.id ? { ...p, ...formData } : p));
    else setParceiros([...parceiros, { id: Date.now(), ...formData }]);
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Filters & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--emaer-azul-claro)' }}>FILTRAR PROFISSÃO:</label>
          <select 
            className="form-control" style={{ width: 220 }}
            value={filterProfissao} onChange={(e) => setFilterProfissao(e.target.value)}
          >
            <option value="Todas">Todas as Profissões</option>
            {profissoes.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <button className="btn-primary" onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>+ Novo Parceiro</button>
      </div>

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {filtered.map(p => (
          <div key={p.id} className="card" style={{ borderTop: `4px solid ${p.prioridade === 'Alta' ? '#ff4444' : 'var(--emaer-azul-medio)'}` }}>
            <div className="card-body" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--emaer-azul-principal)' }}>{p.nome}</div>
                <span className="badge" style={{ background: 'var(--emaer-azul-light)', color: 'var(--emaer-azul-medio)' }}>{p.etapa}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12, color: '#666' }}>
                <div><strong>Profissão:</strong> {p.profissao}</div>
                <div><strong>Origem:</strong> {p.origem}</div>
                <div><strong>Instagram:</strong> {p.instagram}</div>
                <div><strong>Seguidores:</strong> {p.seguidores}</div>
                <div><strong>Local:</strong> {p.cidade}</div>
                <div><strong>WhatsApp:</strong> {p.telefone}</div>
              </div>

              <div style={{ marginTop: 15, padding: 10, background: '#f5f5f5', borderRadius: 8, fontSize: 12 }}>
                <strong>Observações:</strong> {p.obs}
              </div>

              <div style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#999', borderTop: '1px solid #eee', paddingTop: 10 }}>
                <div>Último: {p.dataUltimo}</div>
                <div style={{ color: 'var(--emaer-ambar)', fontWeight: 700 }}>Próxima: {p.proxima}</div>
              </div>

              <button className="btn-secondary" style={{ width: '100%', marginTop: 15, fontSize: 12, padding: '6px' }}
                onClick={() => { setEditingItem(p); setIsModalOpen(true); }}>Editar Detalhes</button>
            </div>
          </div>
        ))}
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
            { name: 'profissao', label: 'Profissão', type: 'select', options: profissoes.map(p => ({ value: p, label: p })) },
            { name: 'origem', label: 'Origem', type: 'text' },
            { name: 'instagram', label: 'Instagram', type: 'text' },
            { name: 'seguidores', label: 'Seguidores', type: 'text' },
            { name: 'cidade', label: 'Cidade/Estado', type: 'text' },
            { name: 'telefone', label: 'Telefone/WhatsApp', type: 'text' },
            { name: 'etapa', label: 'Etapa Atual', type: 'text' },
            { name: 'prioridade', label: 'Prioridade', type: 'text' },
            { name: 'obs', label: 'Observações Lead', type: 'textarea' },
          ]}
        />
      )}
    </div>
  );
}
