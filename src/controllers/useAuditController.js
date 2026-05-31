import { useState, useCallback } from 'react';
import { saveToStorage, getFromStorage, saveAuditToDashboard } from '../models/auditModel';

const reactivosIniciales = [
  { id: 1, nombre: '1. Tiene aviso de privacidad', hallazgo: '', isOpen: false },
  { id: 2, nombre: '2. Aplica técnicas de borrado seguro', hallazgo: '', isOpen: false },
  { id: 3, nombre: '3. Aplica técnicas de protección', hallazgo: '', isOpen: false }
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