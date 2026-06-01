import { useState, useCallback } from 'react';
import { saveToStorage, getFromStorage, saveAuditToDashboard } from '../models/auditModel';

const reactivosIniciales = [
  // ---------------------------------------------------------
  // 1. CUMPLIMIENTO Y PROTECCIÓN DE DATOS (Tarjetas de Crédito)
  // ---------------------------------------------------------
  { id: 1, nombre: '¿La base de datos en Azure que almacena los números de tarjeta de crédito cuenta con cifrado en reposo (ej. TDE - Transparent Data Encryption)?', hallazgo: '', isOpen: false },
  { id: 2, nombre: '¿Los números de tarjeta se muestran enmascarados (ocultando todos los dígitos excepto los últimos 4) en las pantallas de los sistemas de Servicio al Cliente y Ventas?', hallazgo: '', isOpen: false },
  { id: 3, nombre: '¿El tráfico de datos entre la plataforma de e-commerce, las sucursales y Azure viaja a través de canales cifrados (TLS 1.2 o superior)?', hallazgo: '', isOpen: false },
  { id: 4, nombre: '¿Existe un procedimiento estricto para la rotación periódica de las llaves criptográficas utilizadas para cifrar la base de datos de tarjetas?', hallazgo: '', isOpen: false },
  { id: 5, nombre: '¿El entorno de base de datos que procesa tarjetas (CDE) está segregado lógicamente del resto de los servidores corporativos en Azure mediante Virtual Networks (VNet) y Network Security Groups (NSG)?', hallazgo: '', isOpen: false },

  // ---------------------------------------------------------
  // 2. GESTIÓN DE PROVEEDORES (Nube y GPS Tercerizado)
  // ---------------------------------------------------------
  { id: 6, nombre: '¿El contrato con la empresa que monitorea el GPS incluye una cláusula de "Derecho a Auditoría" (Right to Audit) para validar sus propios controles de seguridad?', hallazgo: '', isOpen: false },
  { id: 7, nombre: '¿Se restringe el acceso de la empresa proveedora de GPS exclusivamente a los datos de telemetría, asegurando que no tengan visibilidad de la base de clientes o inventario de alto valor?', hallazgo: '', isOpen: false },
  { id: 8, nombre: '¿Se revisan anualmente los reportes de cumplimiento (ej. SOC 2, ISO 27001) del proveedor de GPS y de Microsoft Azure para validar que su infraestructura es segura?', hallazgo: '', isOpen: false },
  { id: 9, nombre: '¿Los administradores de TI internos requieren Autenticación Multifactor (MFA) obligatoria para acceder al panel de administración y consola de Microsoft Azure?', hallazgo: '', isOpen: false },

  // ---------------------------------------------------------
  // 3. SEGURIDAD FÍSICA Y OPERATIVA (Tiendas y CEDIS)
  // ---------------------------------------------------------
  { id: 10, nombre: '¿Las 500 sucursales cuentan con inspecciones físicas trimestrales para detectar dispositivos de clonación (skimmers) conectados en las terminales de punto de venta (POS)?', hallazgo: '', isOpen: false },
  { id: 11, nombre: '¿El acceso a los "site" de comunicaciones en los 3 CEDIS está restringido mediante controles biométricos o tarjetas de proximidad, y se revisan las bitácoras de acceso mensualmente?', hallazgo: '', isOpen: false },
  { id: 12, nombre: '¿Las cámaras de circuito cerrado (CCTV) en CEDIS y tiendas cubren los accesos a los cuartos de servidores y conservan las grabaciones por un mínimo de 90 días?', hallazgo: '', isOpen: false },
  { id: 13, nombre: '¿Se ejecutan pruebas semestrales a las plantas de energía de emergencia y sistemas UPS en los CEDIS para garantizar la continuidad ante cortes de luz?', hallazgo: '', isOpen: false },

  // ---------------------------------------------------------
  // 4. CONTROL DE ACCESOS LÓGICOS Y RRHH (10,000 Colaboradores)
  // ---------------------------------------------------------
  { id: 14, nombre: '¿Se realiza una comprobación de antecedentes penales y referencias laborales a todo el personal con acceso a los CEDIS y a los administradores de sistemas?', hallazgo: '', isOpen: false },
  { id: 15, nombre: '¿Las bajas de personal en tiendas y corporativo se notifican a TI en menos de 24 horas para la revocación inmediata de sus usuarios en SAP, Active Directory y correos?', hallazgo: '', isOpen: false },
  { id: 16, nombre: '¿Existe una revisión formal cada 6 meses de los perfiles de SAP para garantizar la "Segregación de Funciones" (ej. que quien da de alta un proveedor no pueda autorizarle pagos)?', hallazgo: '', isOpen: false },
  { id: 17, nombre: '¿Las cuentas de usuario genéricas o compartidas (ej. cajero1) en las tiendas tienen controles compensatorios para identificar al empleado físico que las utilizó en un turno específico?', hallazgo: '', isOpen: false },
  { id: 18, nombre: '¿Todo el personal de nuevo ingreso firma un Acuerdo de Confidencialidad (NDA) y una Política de Uso Aceptable de los recursos informáticos antes de recibir su equipo de cómputo?', hallazgo: '', isOpen: false },

  // ---------------------------------------------------------
  // 5. REDES Y PUESTOS DE TRABAJO
  // ---------------------------------------------------------
  { id: 19, nombre: '¿La red de las terminales de punto de venta (POS) en las sucursales está físicamente o lógicamente separada de la red Wi-Fi pública ofrecida a los clientes?', hallazgo: '', isOpen: false },
  { id: 20, nombre: '¿Los puertos USB de las computadoras en corporativo y tiendas están bloqueados por directiva de grupo (GPO) para evitar la extracción de datos en memorias externas?', hallazgo: '', isOpen: false },
  { id: 21, nombre: '¿Todos los equipos portátiles (laptops) asignados a gerencia y corporativo tienen el cifrado de disco duro activado (BitLocker/FileVault)?', hallazgo: '', isOpen: false },
  { id: 22, nombre: '¿Se encuentra instalado y activo un software antivirus (o EDR) administrado de forma centralizada en todos los equipos y servidores del retail?', hallazgo: '', isOpen: false },
  { id: 23, nombre: '¿Existe un filtro de contenido web corporativo que bloquee el acceso a sitios maliciosos, redes sociales no autorizadas o almacenamiento en la nube personal?', hallazgo: '', isOpen: false },

  // ---------------------------------------------------------
  // 6. GESTIÓN DE VULNERABILIDADES Y DESARROLLO
  // ---------------------------------------------------------
  { id: 24, nombre: '¿Se aplican los parches de seguridad críticos emitidos por los fabricantes (Microsoft, SAP, etc.) en un plazo no mayor a 30 días tras su liberación?', hallazgo: '', isOpen: false },
  { id: 25, nombre: '¿Se ejecutan escaneos de vulnerabilidades periódicos a la plataforma de e-commerce, especialmente antes de eventos de alto tráfico (ej. Buen Fin, Hot Sale)?', hallazgo: '', isOpen: false },
  { id: 26, nombre: '¿Los desarrolladores tienen prohibido utilizar la base de datos de producción (con números de tarjeta reales) para realizar pruebas de software en el entorno de calidad (QA)?', hallazgo: '', isOpen: false },
  { id: 27, nombre: '¿Los ambientes de Desarrollo, Pruebas y Producción en Azure se encuentran alojados en servidores o contenedores completamente separados?', hallazgo: '', isOpen: false },

  // ---------------------------------------------------------
  // 7. RESPUESTA A INCIDENTES Y CONTINUIDAD DEL NEGOCIO
  // ---------------------------------------------------------
  { id: 28, nombre: '¿La organización tiene un Plan de Respuesta a Incidentes documentado que describa paso a paso cómo actuar ante una filtración de datos de tarjetas o un ataque de Ransomware?', hallazgo: '', isOpen: false },
  { id: 29, nombre: '¿Se generan logs (registros de auditoría) inalterables que registren quién accedió a la base de datos de tarjetas, a qué hora y qué consulta realizó?', hallazgo: '', isOpen: false },
  { id: 30, nombre: '¿Los respaldos (backups) de SAP y de la plataforma de e-commerce se replican en una zona geográfica distinta dentro de Azure para protegerlos contra desastres regionales?', hallazgo: '', isOpen: false },
  { id: 31, nombre: '¿Se realizan pruebas de restauración completa de los respaldos de bases de datos críticas al menos una vez al año?', hallazgo: '', isOpen: false },
  { id: 32, nombre: '¿Existe un canal de comunicación oficial (ej. correo de "Phishing" o línea telefónica) para que los 10,000 colaboradores reporten correos sospechosos o incidentes de seguridad en tiendas?', hallazgo: '', isOpen: false }
];

export const useAuditController = () => {
  const [checklist, setChecklist] = useState(() => getFromStorage('current_checklist', reactivosIniciales));
  const [metadata, setMetadata] = useState(() => getFromStorage('current_metadata', { auditor: '', responsable: '', sitio: '' }));
  const [status, setStatus] = useState('');
  const [showMetadataForm, setShowMetadataForm] = useState(() => getFromStorage('show_meta', false));

  const autoSave = useCallback((newChecklist, newMetadata, newShowMeta) => {
    setStatus('Guardando...');
    saveToStorage('current_checklist', newChecklist);
    saveToStorage('current_metadata', newMetadata);
    saveToStorage('show_meta', newShowMeta);
    setTimeout(() => setStatus('Autoguardado'), 800);
  }, []);

  const toggleInput = (id) => {
    const updated = checklist.map(item => item.id === id ? { ...item, isOpen: !item.isOpen } : item);
    setChecklist(updated);
  };

  const updateHallazgo = (id, text) => {
    const updated = checklist.map(item => item.id === id ? { ...item, hallazgo: text } : item);
    setChecklist(updated);
    autoSave(updated, metadata, showMetadataForm);
  };

  const updateMetadata = (field, value) => {
    const updated = { ...metadata, [field]: value };
    setMetadata(updated);
    autoSave(checklist, updated, showMetadataForm);
  };

  const enableMetadataForm = () => {
    setShowMetadataForm(true);
    autoSave(checklist, metadata, true);
  };

  const isMetadataComplete = metadata.auditor && metadata.responsable && metadata.sitio;

  const resetAudit = () => {
    saveAuditToDashboard(metadata, checklist);
    setChecklist(reactivosIniciales);
    setMetadata({ auditor: '', responsable: '', sitio: '' });
    setShowMetadataForm(false);
    setStatus('');
    localStorage.removeItem('current_checklist');
    localStorage.removeItem('current_metadata');
    localStorage.removeItem('show_meta');
  };

  return { checklist, metadata, status, showMetadataForm, isMetadataComplete, toggleInput, updateHallazgo, updateMetadata, enableMetadataForm, resetAudit };
};