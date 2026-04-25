import { useState, useEffect } from 'react';

export default function Modal({ isOpen, onClose, onSave, title, initialData, fields }) {
  const [formData, setFormData] = useState(initialData || {});

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(12, 68, 124, 0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      padding: '20px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <div className="card-body">
          <div className="section-header" style={{ marginBottom: 20 }}>
            <div className="section-title">{title}</div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#85B7EB' }}>✕</button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {fields.map(field => (
              <div className="form-group" key={field.name}>
                <label className="form-label">{field.label}</label>
                {field.type === 'select' ? (
                  <select 
                    className="form-control" 
                    name={field.name} 
                    value={formData[field.name] || ''} 
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione...</option>
                    {field.options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type={field.type || 'text'} 
                    className="form-control" 
                    name={field.name} 
                    value={formData[field.name] || ''} 
                    onChange={handleChange}
                    required
                  />
                )}
              </div>
            ))}
            
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>Salvar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
