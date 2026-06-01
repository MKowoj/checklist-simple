import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
export const getFromStorage = (key, defaultValue) => JSON.parse(localStorage.getItem(key)) || defaultValue;

export const exportToPDF = (metadata, checklist) => {
  const doc = new jsPDF();
  const fechaActual = new Date().toLocaleDateString('es-MX');

  doc.setFont("helvetica");
  
  // Título Principal del Reporte
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("INFORME DE AUDITORÍA - LFPDPP", 14, 20);

  // Tabla 1: Datos Generales (Encabezado superior)
  autoTable(doc, {
    startY: 28,
    head: [['Concepto', 'Información']],
    body: [
      ['Fecha de Emisión', fechaActual],
      ['Sitio Auditado', metadata.sitio || 'N/A'],
      ['Auditor Responsable', metadata.auditor || 'N/A'],
      ['Responsable del Área', metadata.responsable || 'N/A']
    ],
    theme: 'plain',
    styles: { font: 'helvetica', fontSize: 10, cellPadding: 4 },
    columnStyles: { 0: { fontStyle: 'bold', width: 50 } },
    lineColor: [220, 220, 220],
    lineWidth: 0.1
  });

  // Filtrar solo los reactivos que tienen hallazgos registrados
  const tableData = checklist
    .filter(item => item.hallazgo.trim() !== "")
    .map(item => [item.nombre, item.hallazgo]);

  // Tabla 2: Detalle de Hallazgos Operativos
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 12, // Se posiciona dinámicamente debajo de la tabla anterior
    head: [['Reactivo Evaluado', 'Descripción del Hallazgo']],
    body: tableData.length > 0 ? tableData : [['N/A', 'No se detectaron desviaciones ni hallazgos en esta auditoría.']],
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 5 },
    headStyles: { fillColor: [28, 28, 30], textColor: [255, 255, 255] } // Paleta macOS Dark neutra
  });

  // Ejecuta la descarga directa en el navegador
  doc.save(`Auditoria_${metadata.sitio || 'Reporte'}.pdf`);
};

export const exportToCSV = (metadata, checklist) => {
  const cabeceras = ["Reactivo", "Hallazgo"];
  const filas = checklist.map(item => [`"${item.nombre}"`, `"${item.hallazgo}"`]);
  const contenidoCSV = [cabeceras.join(","), ...filas.map(fila => fila.join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + contenidoCSV], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Auditoria_${metadata.sitio || 'Reporte'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const saveAuditToDashboard = (metadata, checklist) => {
  const history = getFromStorage('audit_history', []);
  const findingsCount = checklist.filter(c => c.hallazgo.trim() !== '').length;
  const newRecord = { id: Date.now(), ...metadata, hallazgos: findingsCount, fecha: new Date().toLocaleDateString('es-MX') };
  saveToStorage('audit_history', [...history, newRecord]);
};