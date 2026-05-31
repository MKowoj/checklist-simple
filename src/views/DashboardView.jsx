import { getFromStorage } from '../models/auditModel';

export default function DashboardView() {
  const history = getFromStorage('audit_history', []);

  return (
    <div className="container">
      <fieldset className="fieldset" style={{ maxWidth: '100%' }}>
        <legend>Log de Auditorías Realizadas</legend>
        {history.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No hay auditorías registradas.</p> : (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Sitio</th>
                <th>Auditor</th>
                <th>Responsable</th>
                <th>Hallazgos</th>
              </tr>
            </thead>
            <tbody>
              {history.map(record => (
                <tr key={record.id}>
                  <td>{record.fecha}</td>
                  <td>{record.sitio}</td>
                  <td>{record.auditor}</td>
                  <td>{record.responsable}</td>
                  <td>{record.hallazgos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </fieldset>
    </div>
  );
}