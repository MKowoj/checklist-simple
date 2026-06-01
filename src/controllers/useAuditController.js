import { useState, useEffect } from 'react';

const initialChecklist = [
  // 1. SEGURIDAD FÍSICA Y ENTORNO
  { id: 101, categoria: 'Seguridad Física y Entorno', nombre: '¿Existe una bitácora de control de acceso físico en recepción para registrar la entrada y salida de todos los visitantes?', hallazgo: '', isOpen: false },
  { id: 102, categoria: 'Seguridad Física y Entorno', nombre: '¿Se entrega un gafete visible a los invitados y se les exige identificación oficial para ingresar a áreas restringidas (como el SITE)?', hallazgo: '', isOpen: false },
  { id: 103, categoria: 'Seguridad Física y Entorno', nombre: '¿Se cumple la política de "Escritorio Limpio", asegurando que no existan contraseñas anotadas en Post-its adheridos a los monitores?', hallazgo: '', isOpen: false },
  { id: 104, categoria: 'Seguridad Física y Entorno', nombre: '¿Los servidores físicos en las sucursales operativas cuentan con protección física (ej. rack con llave, cuarto de acceso restringido)?', hallazgo: '', isOpen: false },
  { id: 105, categoria: 'Seguridad Física y Entorno', nombre: '¿Las cámaras de circuito cerrado (CCTV) en CEDIS y tiendas cubren los accesos a los cuartos de servidores y conservan grabaciones por 90 días?', hallazgo: '', isOpen: false },

  // 2. PUESTOS DE TRABAJO Y REDES
  { id: 201, categoria: 'Puestos de Trabajo y Redes', nombre: '¿Los puertos USB de las computadoras corporativas están bloqueados por directiva para evitar la extracción de información en memorias externas?', hallazgo: '', isOpen: false },
  { id: 202, categoria: 'Puestos de Trabajo y Redes', nombre: '¿Todos los equipos y servidores cuentan con un software antivirus instalado, activo y con firmas actualizadas?', hallazgo: '', isOpen: false },
  { id: 203, categoria: 'Puestos de Trabajo y Redes', nombre: '¿La red perimetral está protegida por un Firewall con reglas de filtrado vigentes y revisadas periódicamente?', hallazgo: '', isOpen: false },
  { id: 204, categoria: 'Puestos de Trabajo y Redes', nombre: '¿Las laptops del personal remoto utilizan una VPN configurada y funcionando correctamente para acceder a los recursos internos?', hallazgo: '', isOpen: false },
  { id: 205, categoria: 'Puestos de Trabajo y Redes', nombre: '¿La red Wi-Fi utilizada por las terminales de punto de venta (POS) en sucursales está aislada de la red pública ofrecida a clientes?', hallazgo: '', isOpen: false },

  // 3. CONTROL DE ACCESOS LÓGICOS Y RRHH
  { id: 301, categoria: 'Control de Accesos Lógicos y RRHH', nombre: '¿Se realiza una comprobación de antecedentes penales y referencias laborales a todo el personal con acceso a los CEDIS y a sistemas críticos?', hallazgo: '', isOpen: false },
  { id: 302, categoria: 'Control de Accesos Lógicos y RRHH', nombre: '¿Las bajas de personal se notifican a TI en menos de 24 horas para la revocación inmediata de sus usuarios en el ERP, Active Directory y correos?', hallazgo: '', isOpen: false },
  { id: 303, categoria: 'Control de Accesos Lógicos y RRHH', nombre: '¿Todo el personal de nuevo ingreso firma un Acuerdo de Confidencialidad (NDA) antes de recibir sus accesos y equipo de cómputo?', hallazgo: '', isOpen: false },

  // 4. GESTIÓN DE VULNERABILIDADES Y CONTINUIDAD
  { id: 401, categoria: 'Gestión de Vulnerabilidades', nombre: '¿Se aplican los parches de seguridad críticos emitidos por los fabricantes en un plazo no mayor a 30 días tras su liberación?', hallazgo: '', isOpen: false },
  { id: 402, categoria: 'Gestión de Vulnerabilidades', nombre: '¿Se generan logs (registros de auditoría) inalterables que registren quién accedió a bases de datos críticas, a qué hora y qué acción realizó?', hallazgo: '', isOpen: false },
  { id: 403, categoria: 'Gestión de Vulnerabilidades', nombre: '¿Se realizan pruebas de restauración completa de los respaldos de información (backups) al menos una vez al trimestre?', hallazgo: '', isOpen: false },

  // 5. NUBE Y PROVEEDORES TERCERIZADOS
  { id: 501, categoria: 'Nube y Proveedores Tercerizados', nombre: '¿Los administradores de TI internos requieren Autenticación Multifactor (MFA) obligatoria para acceder a la consola de Microsoft Azure?', hallazgo: '', isOpen: false },
  { id: 502, categoria: 'Nube y Proveedores Tercerizados', nombre: '¿El contrato con la empresa externa de GPS incluye una cláusula de "Derecho a Auditoría" (Right to Audit) para validar sus controles de seguridad?', hallazgo: '', isOpen: false },
  { id: 503, categoria: 'Nube y Proveedores Tercerizados', nombre: '¿Se restringe el acceso del proveedor de GPS exclusivamente a los datos de telemetría, sin visibilidad del inventario de alto valor?', hallazgo: '', isOpen: false },

  // 6. PROTECCIÓN DE DATOS (TARJETAS DE CRÉDITO)
  { id: 601, categoria: 'Protección de Datos PCI', nombre: '¿La base de datos en Azure que almacena números de tarjeta de crédito cuenta con cifrado en reposo (ej. TDE)?', hallazgo: '', isOpen: false },
  { id: 602, categoria: 'Protección de Datos PCI', nombre: '¿Los números de tarjeta se muestran enmascarados (ocultando dígitos) en las pantallas de los sistemas de Servicio al Cliente y Ventas?', hallazgo: '', isOpen: false },
  { id: 603, categoria: 'Protección de Datos PCI', nombre: '¿El entorno de base de datos que procesa tarjetas está segregado lógicamente del resto de los servidores en Azure mediante Virtual Networks?', hallazgo: '', isOpen: false }
];

export const useAuditController = () => {
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('audit_in_progress');
    return saved ? JSON.parse(saved) : initialChecklist;
  });

  const [metadata, setMetadata] = useState(() => {
    const saved = localStorage.getItem('audit_metadata');
    return saved ? JSON.parse(saved) : { auditor: '', responsable: '', sitio: '' };
  });

  const [showMetadataForm, setShowMetadataForm] = useState(false);
  
  // Nuevo Estado: Controla qué categorías están abiertas o cerradas.
  // Por defecto, abrimos solo la primera tarjeta para no saturar.
  const [expandedCategories, setExpandedCategories] = useState({
    'Seguridad Física y Entorno': true 
  });

  useEffect(() => {
    localStorage.setItem('audit_in_progress', JSON.stringify(checklist));
    localStorage.setItem('audit_metadata', JSON.stringify(metadata));
  }, [checklist, metadata]);

  // Función para abrir/cerrar un bloque de categoría
  const toggleCategory = (categoria) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoria]: !prev[categoria]
    }));
  };

  const toggleInput = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, isOpen: !item.isOpen } : item));
  };

  const updateHallazgo = (id, text) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, hallazgo: text } : item));
  };

  const updateMetadata = (field, value) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  const resetAudit = () => {
    const history = JSON.parse(localStorage.getItem('audit_history')) || [];
    const findingsCount = checklist.filter(c => c.hallazgo.trim() !== '').length;
    const newRecord = { id: Date.now(), ...metadata, hallazgos: findingsCount, fecha: new Date().toLocaleDateString('es-MX') };
    localStorage.setItem('audit_history', JSON.stringify([...history, newRecord]));
    
    setChecklist(initialChecklist);
    setMetadata({ auditor: '', responsable: '', sitio: '' });
    setShowMetadataForm(false);
    setExpandedCategories({ 'Seguridad Física y Entorno': true }); // Resetea las tarjetas
  };

  const enableMetadataForm = () => setShowMetadataForm(true);
  const isMetadataComplete = metadata.auditor.trim() !== '' && metadata.responsable.trim() !== '' && metadata.sitio.trim() !== '';
  const answeredCount = checklist.filter(item => item.hallazgo.trim() !== '').length;
  const status = `Reactivos con hallazgos: ${answeredCount} / ${checklist.length}`;

  return {
    checklist, metadata, status, showMetadataForm, isMetadataComplete,
    expandedCategories, toggleCategory, // Exportamos los nuevos métodos
    toggleInput, updateHallazgo, updateMetadata, enableMetadataForm, resetAudit
  };
};