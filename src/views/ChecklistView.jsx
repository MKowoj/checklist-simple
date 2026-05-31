import { useAuditController } from '../controllers/useAuditController';
import { exportToPDF, exportToCSV } from '../models/auditModel';

export default function ChecklistView() {
  const { checklist, metadata, status, showMetadataForm, isMetadataComplete, toggleInput, updateHallazgo, updateMetadata, enableMetadataForm, resetAudit } = useAuditController();

  const handleEmail = () => {
    const subject = `Auditoría - ${metadata.sitio}`;
    const body = `Se adjuntan los hallazgos de la auditoría realizada por ${metadata.auditor}.`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleReset = () => {
    if(window.confirm("¿Iniciar nueva auditoría? Esto guardará el log actual en el tablero y limpiará la pantalla.")) {
      resetAudit();
    }
  };

  return (
    <div className="container">
      <div className="status-text">{status}</div>
      
      <div className="fieldset-container">
        <fieldset className="fieldset">
          <legend>Hallazgos Operativos</legend>
          {checklist.map((item) => (
            <div key={item.id} className="reactivo-item">
              <button className="reactivo-btn" onClick={() => toggleInput(item.id)}>
                {item.nombre} <span>{item.hallazgo ? '✓' : '+'}</span>
              </button>
              {item.isOpen && (
                <input type="text" placeholder="Describa el hallazgo..." value={item.hallazgo} onChange={(e) => updateHallazgo(item.id, e.target.value)} />
              )}
            </div>
          ))}
        </fieldset>
      </div>

      {!showMetadataForm ? (
        <button className="btn" onClick={enableMetadataForm}>Ingresar datos generales</button>
      ) : (
        <fieldset className="fieldset" style={{ maxWidth: '100%' }}>
          <legend>Cierre de Auditoría</legend>
          <div className="form-grid">
            <input type="text" placeholder="Nombre del Auditor" value={metadata.auditor} onChange={(e) => updateMetadata('auditor', e.target.value)} />
            <input type="text" placeholder="Responsable del Área" value={metadata.responsable} onChange={(e) => updateMetadata('responsable', e.target.value)} />
            <input type="text" placeholder="Sitio Auditado" value={metadata.sitio} onChange={(e) => updateMetadata('sitio', e.target.value)} />
          </div>
          
          <div className="actions-bar">
            <button className="btn" onClick={() => exportToCSV(metadata, checklist)} disabled={!isMetadataComplete}>Descargar CSV</button>
            <button className="btn" onClick={() => exportToPDF(metadata, checklist)} disabled={!isMetadataComplete}>Descargar PDF</button>
            <button className="btn" onClick={handleEmail} disabled={!isMetadataComplete}>Enviar por Correo</button>
            <button className="btn btn-primary" onClick={handleReset}>Iniciar nueva auditoría</button>
          </div>
        </fieldset>
      )}
    </div>
  );
}