import { useState } from 'react';

const datosIniciales = [
  { id: 1, nombre: '1. Tiene aviso de privacidad', propiedad: 'Hallazgo' },
  { id: 2, nombre: '2. Aplica técnicas de borrado seguro lógico y físico', propiedad: 'Hallazgo' },
  { id: 3, nombre: '3. Aplica técnicas físicas de protección de datos', propiedad: 'Hallazgo' },
  { id: 4, nombre: '4. El personal tiene cursos de capacitación', propiedad: 'Hallazgo' },
  { id: 5, nombre: '5. Hay control de acceso físico y lógico', propiedad: 'Hallazgo' },
  { id: 6, nombre: '6. Se aplican los principios de protección de datos personales', propiedad: 'Hallazgo' },
  { id: 7, nombre: '7. Hay datos personales vulnerados', propiedad: 'Hallazgo' },
  { id: 8, nombre: '8. Tiene política de seguridad de la información', propiedad: 'Hallazgo' },
  { id: 9, nombre: '9. Tiene protocolo para gestiona incidentes de seguridad de información', propiedad: 'Hallazgo' },
  { id: 10, nombre: '10. Tiene procedimiento para gestionar los derechos ARCO', propiedad: 'Hallazgo' },
];
 
export default function ReactivoTable() {
  const [reactivos, setReactivos] = useState(datosIniciales);

  const modificarTexto = (id, campo, valor) => {
    const nuevos = reactivos.map(r => 
      r.id === id ? { ...r, [campo]: valor } : r
    );
    setReactivos(nuevos);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Reactivo</th>
          <th>Descripción del hallazgo</th>
        </tr>
      </thead>
      <tbody>
        {reactivos.map((r) => (
          <tr key={r.id}>
            <td>{r.nombre}</td>
            <td>
              <input
                type="text"
                value={r.propiedad}
                onChange={(e) => modificarTexto(r.id, 'propiedad', e.target.value)}
              />
            </td>
        
          </tr>
        ))}
      </tbody>
    </table>
  );
}