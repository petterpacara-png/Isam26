# ESEN – Sistema de Actividades Extracurriculares

Aplicación web para el registro y consulta de actividades extracurriculares, desarrollada con HTML, CSS y JavaScript vanilla (sin frameworks ni dependencias de build). Listo para desplegar en cualquier servidor estático.

## Características

| Módulo | Descripción |
|---|---|
| Autenticación | Login con roles Administrador / Estudiante |
| Dashboard | Métricas en tiempo real: actividades, horas, estudiantes |
| Actividades | CRUD completo + filtros por tipo, fecha y resolución |
| Estudiantes | CRUD con cálculo de horas acumuladas |
| Reportes | Resumen por tipo y por estudiante + exportar CSV |
| Mis Actividades | Vista del estudiante con horas acumuladas |
| Mi Historial | Historial completo de participación |

## Credenciales de demo

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `1234` | Administrador |
| `estudiante01` | `1234` | Estudiante (Luis García) |
| `estudiante02` | `1234` | Estudiante (Ana Quispe) |

## Estructura del proyecto

```
esen-actividades/
├── index.html          # Punto de entrada
├── favicon.svg
├── css/
│   └── main.css        # Estilos globales + variables CSS
└── js/
    ├── data.js         # Capa de datos (localStorage)
    ├── auth.js         # Autenticación
    ├── ui.js           # Helpers de interfaz
    ├── actividades.js  # CRUD actividades
    ├── estudiantes.js  # CRUD estudiantes
    ├── reportes.js     # Reportes + vistas del estudiante
    └── app.js          # Controlador principal y router
```

## Despliegue

### GitHub Pages (recomendado)

1. Sube el repositorio a GitHub.
2. Ve a **Settings → Pages**.
3. En *Source* selecciona `Deploy from a branch` → `main` → `/ (root)`.
4. La URL quedará: `https://<usuario>.github.io/<repo>/`

### Netlify (alternativa)

1. Arrastra la carpeta del proyecto al dashboard de Netlify.  
   O conecta el repositorio de GitHub y Netlify lo despliega automáticamente.

### Servidor Apache / Nginx

Copia todos los archivos al directorio público del servidor (ej. `/var/www/html/esen/`).  
No requiere configuración especial porque es una SPA con rutas manejadas por JS.

### Vercel

```bash
npm i -g vercel
vercel --prod
```

## Personalización

- **Credenciales**: edita el objeto `CREDENTIALS` en `js/auth.js`.
- **Paleta de colores**: modifica las variables CSS en `:root` dentro de `css/main.css`.
- **Datos iniciales**: edita `defaultActivities` y `defaultStudents` en `js/data.js`.
- **Back-end real**: reemplaza las funciones de `DB` en `js/data.js` con llamadas `fetch()` a tu API REST.

## Requerimientos cubiertos

| RF | Descripción |
|---|---|
| RF01 | Inicio de sesión con usuario y contraseña |
| RF02 | Registro de nuevas actividades extracurriculares |
| RF03 | Selección de categoría predefinida |
| RF04 | Modificación de datos registrados |
| RF05 | Eliminación de registros |
| RF06 | Consulta con filtros por fecha, tipo y resolución |
| RF07 | Relación de estudiantes por actividad con horas |
| RF08 | Generación de reportes (pantalla + CSV) |
| RF09 | Visualización de actividades por el estudiante |
| RF10 | Historial de participación con horas acumuladas |
| RNF01 | Interfaz visualmente agradable |
| RNF02 | Interfaz intuitiva y fácil de usar |
| RNF03 | Disponible 24/7 (hosting estático) |
