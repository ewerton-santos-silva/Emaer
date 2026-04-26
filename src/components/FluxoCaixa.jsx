import { useState } from 'react';
import { formatCurrency } from './ui/Shared';

const initialLancamentos = [
  { id: 1, data: '05/04/2026', descricao: 'Projeto Casa Resilla - 1ª Parcela', categoria: 'Projetos', tipo: 'ENTRADA', valor: 5500, status: 'Recebido' },
  { id: 2, data: '08/04/2026', descricao: 'Aluguel Escritório', categoria: 'Fixo', tipo: 'SAÍDA', valor: 2200, status: 'Pago' },
  { id: 3, data: '12/04/2026', descricao: 'Projeto Edifício Sky - Parcela Final', categoria: 'Projetos', tipo: 'ENTRADA', valor: 12000, status: 'Pendente' },
];

export default function FluxoCaixa() {
  const [lancamentos, setLancamentos] = useState(initialLancamentos);

  const totalEntradas = lancamentos.filter(l => l.tipo === 'ENTRADA').reduce((a, b) => a + b.valor, 0);
  const totalSaidas = lancamentos.filter(l => l.tipo === 'SAÍDA').reduce((a, b) => a + b.valor, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15 }}>
        <div className="card" style={{ padding: 20, borderLeft: '5px solid green' }}>
          <div style={{ fontSize: 11, fontWeight: 700 }}>ENTRADAS</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{formatCurrency(totalEntradas)}</div>
        </div>
        <div className="card" style={{ padding: 20, borderLeft: '5px solid red' }}>
          <div style={{ fontSize: 11, fontWeight: 700 }}>SAÍDAS</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{formatCurrency(totalSaidas)}</div>
        </div>
        <div className="card" style={{ padding: 20, borderLeft: '5px solid blue' }}>
          <div style={{ fontSize: 11, fontWeight: 700 }}>SALDO</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{formatCurrency(totalEntradas - totalSaidas)}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="section-header">
            <h3>Planilha de Fluxo de Caixa</h3>
            <button className="btn-primary">+ Novo Lançamento</button>
          </div>
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f5f5f5' }}>
                <tr>
                  <th style={{ padding: 12 }}>DATA</th>
                  <th style={{ padding: 12 }}>DESCRIÇÃO</th>
                  <th style={{ padding: 12 }}>CATEGORIA</th>
                  <th style={{ padding: 12 }}>TIPO</th>
                  <th style={{ padding: 12 }}>VALOR</th>
                  <th style={{ padding: 12 }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {lancamentos.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 12 }}>{l.data}</td>
                    <td style={{ padding: 12 }}>{l.descricao}</td>
                    <td style={{ padding: 12 }}>{l.categoria}</td>
                    <td style={{ padding: 12, color: l.tipo === 'ENTRADA' ? 'green' : 'red', fontWeight: 700 }}>{l.tipo}</td>
                    <td style={{ padding: 12, fontWeight: 700 }}>{formatCurrency(l.valor)}</td>
                    <td style={{ padding: 12 }}>
                      <span className="badge" style={{ background: l.status === 'Pendente' ? '#fff4e5' : '#e6f7ee', color: l.status === 'Pendente' ? '#ef9f27' : '#2e9e5b' }}>{l.status}</span>
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
