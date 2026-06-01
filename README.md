## Arquitectura y Manejo de Datos

Esta herramienta está construida bajo una arquitectura **100% Frontend (Local-First)**. Fue diseñada intencionalmente sin un backend centralizado para ofrecer una herramienta de productividad ligera, rápida y que garantice la privacidad absoluta de la información.

* **Privacidad por diseño:** Ningún dato ingresado en esta aplicación viaja a través de internet ni es almacenado en servidores de terceros.
* **Persistencia local:** El historial del tablero se guarda exclusivamente en el `localStorage` del dispositivo del usuario.
* **Aviso de Volatilidad:** Debido a su naturaleza local, los datos son temporales. Si el usuario borra la memoria caché de su navegador o utiliza el Modo Incógnito, el historial de auditorías se perderá de forma permanente. Se recomienda exportar siempre el informe final en formato PDF o CSV al finalizar el flujo de trabajo.

* [🔗 Ver sitio web en vivo](https://checklist-simple-iso27001.vercel.app)