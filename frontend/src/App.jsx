import React, { useEffect, useState } from 'react';

export default function App() {
  const [alerts, setAlerts] = useState([]);
  const [message, setMessage] = useState('');

  const loadAlerts = () => {
    fetch('http://localhost:8080/api/v1/inventory/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.error(err));
  };

  const handleSeed = () => {
    fetch('http://localhost:8080/api/v1/inventory/seed', { method: 'POST' })
      .then(res => res.json())
      .then(res => {
        setMessage(res.message);
        loadAlerts();
      });
  };

  const handleApprove = (sku, action) => {
    fetch('http://localhost:8080/api/v1/inventory/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, action, approvedBy: 'GerenteOperaciones' })
    })
      .then(res => res.json())
      .then(data => {
        setMessage(`${data.message} para SKU: ${sku}`);
        loadAlerts();
      });
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontFamily: 'sans-serif' }}>
      <h2>Monitor de Riesgo de Quiebre de Inventario</h2>
      <p style={{ color: '#666' }}>Sistema de recomendación y aprobación de transferencias y compras automáticas.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleSeed} style={{ padding: '8px 16px', background: '#0052cc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
          Sembrar Stock Inicial
        </button>
        <button onClick={loadAlerts} style={{ padding: '8px 16px', background: '#ebecf0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
          Refrescar Alertas
        </button>
      </div>

      {message && <div style={{ padding: '10px', background: '#e3fcef', color: '#006644', borderRadius: '4px', marginBottom: '15px' }}>{message}</div>}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ background: '#f4f5f7', textAlign: 'left', borderBottom: '2px solid #dfe1e6' }}>
            <th style={{ padding: '12px' }}>SKU</th>
            <th style={{ padding: '12px' }}>Bodega</th>
            <th style={{ padding: '12px' }}>Stock Actual</th>
            <th style={{ padding: '12px' }}>Umbral</th>
            <th style={{ padding: '12px' }}>Acción Recomendada</th>
            <th style={{ padding: '12px' }}>Decisión</th>
          </tr>
        </thead>
        <tbody>
          {alerts.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                No existen alertas activas. Presiona "Sembrar Stock Inicial" para cargar datos de prueba.
              </td>
            </tr>
          ) : (
            alerts.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #ebecf0' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.sku}</td>
                <td style={{ padding: '12px' }}>{item.warehouse}</td>
                <td style={{ padding: '12px', color: '#de350b', fontWeight: 'bold' }}>{item.currentStock}</td>
                <td style={{ padding: '12px' }}>{item.threshold}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: item.action === 'COMPRA_URGENTE' ? '#ffebe6' : '#fff0b3', color: item.action === 'COMPRA_URGENTE' ? '#bf2600' : '#172b4d' }}>
                    {item.action}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => handleApprove(item.sku, item.action)} style={{ padding: '6px 12px', background: '#36b37e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Aprobar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
