# Issue tracker: GitHub

Repositorio: `IanCastillo19/Race-Circuit`.
Las tareas y especificaciones se publican en GitHub Issues.
Desde un clon, usar `gh`; mediante una integración, verificar siempre que el destino sea este repositorio.

## Operaciones

- Crear: `gh issue create --title "..." --body-file <archivo>`.
- Leer: `gh issue view <n> --json number,title,body,labels,comments`.
- Listar: `gh issue list --state open --json number,title,body,labels`.
- Comentar y cerrar: `gh issue comment <n> --body "..."`; después, `gh issue close <n>`.
- Relacionar subtareas con la issue principal mediante sub-issues. Si no están disponibles, usar `Part of #<n>` en la subtarea.
- Registrar dependencias nativas cuando estén disponibles. Si no, usar `Blocked by: #<n>` en el cuerpo.
- Las PR no son solicitudes para clasificar como tareas.

## Wayfinder

Una issue `wayfinder:map` agrupa las subtareas. Elegir la primera subtarea abierta, sin responsable ni bloqueos abiertos; asignarla al comenzar y documentar la resolución antes de cerrarla.
