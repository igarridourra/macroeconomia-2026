# Material de Ayudantía

Portal académico estático para centralizar el material de la ayudantía del curso de **Macroeconomía**, **Universidad de Concepción**, **semestre 2026-2**: apuntes, ejercicios, controles, certámenes, presentaciones, material complementario y videos de clases.

Creado por **Ignacio Garrido & Alex Fierro**.

---

## ¿Qué es?

Es un sitio 100% estático (HTML, CSS y JavaScript vanilla, sin frameworks, sin backend, sin base de datos, sin login) pensado para alojarse gratis en **GitHub Pages**.

Todo el contenido (títulos, descripciones, categorías, fechas, archivos disponibles) vive en dos archivos JSON: `data/material.json` y `data/videos.json`. El diseño (CSS) y el código (JS) nunca se tocan para agregar contenido nuevo — solo se edita el JSON y se suben los archivos.

---

## Estructura

```
/
├── index.html              # Landing page
├── material.html           # Biblioteca completa (buscador, filtros, orden)
├── material-detalle.html   # Vista de detalle de un material (usa ?id=...)
├── videos.html              # Repositorio de videos de YouTube
├── about.html               # Sobre el proyecto, creadores, uso responsable
├── README.md
├── .gitignore
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # Publica el sitio automáticamente en GitHub Pages
│
├── assets/
│   ├── css/
│   │   └── style.css        # Todo el diseño del sitio (claro y oscuro)
│   │
│   ├── js/
│   │   ├── app.js               # Tema claro/oscuro, menú móvil, año del footer
│   │   ├── data.js               # Utilidades compartidas (carga JSON, tarjetas)
│   │   ├── home.js               # Lógica de index.html
│   │   ├── material.js           # Lógica de material.html (buscador/filtros/orden)
│   │   ├── material-detalle.js   # Lógica de material-detalle.html
│   │   └── videos.js             # Lógica de videos.html
│   │
│   ├── img/
│   │   └── favicon.svg
│   │
│   └── material/
│       ├── ayudantia-01/
│       │   ├── ayudantia-01.pdf   ⟵ tú subes estos archivos
│       │   ├── ayudantia-01.tex
│       │   └── ayudantia-01.zip
│       ├── ayudantia-02/
│       └── ayudantia-03/
│
└── data/
    ├── material.json        # Un objeto por cada material publicado
    └── videos.json           # Un objeto por cada video de YouTube
```

> Los archivos `README.md` dentro de `assets/material/ayudantia-XX/` son solo marcadores de posición: bórralos cuando subas los archivos reales.

---

## Cómo agregar una ayudantía (flujo completo)

1. Crea una carpeta nueva dentro de `assets/material/`, por ejemplo `assets/material/ayudantia-04/`.
2. Sube ahí el PDF y, si corresponde, el `.tex` y/o un `.zip` con los archivos fuente.
3. Abre `data/material.json` y agrega un nuevo objeto al arreglo (recuerda la coma antes del nuevo bloque):

   ```json
   {
     "id": "ayudantia-04",
     "title": "Ayudantía 04 — Política monetaria",
     "description": "Herramientas de política monetaria y su efecto sobre la inflación.",
     "category": "Ayudantías",
     "date": "2026-04-06",
     "authors": ["Ignacio Garrido", "Alex Fierro"],
     "topics": ["Política monetaria", "Banco Central"],
     "files": {
       "pdf": "assets/material/ayudantia-04/ayudantia-04.pdf",
       "latex": "assets/material/ayudantia-04/ayudantia-04.tex"
     }
   }
   ```

4. Haz commit y push. GitHub Pages actualiza el sitio solo (ver sección de despliegue).

Reglas importantes:

- `id` debe ser único y sin espacios (se usa en la URL `material-detalle.html?id=...`).
- `date` va en formato `AAAA-MM-DD`.
- `category` debe ser exactamente uno de los valores que existen en los filtros (ver "Cómo modificar categorías").
- En `files`, solo agrega las claves de los formatos que realmente tengas. Si un material no tiene LaTeX, simplemente no incluyas la clave `"latex"` — el sitio no mostrará ese botón.

---

## Cómo agregar PDF

1. Copia el archivo `.pdf` dentro de la carpeta del material correspondiente, por ejemplo `assets/material/ayudantia-04/ayudantia-04.pdf`.
2. En `data/material.json`, agrega o revisa la clave `"pdf"` dentro de `files` con esa misma ruta.
3. El sitio mostrará automáticamente los botones **Ver PDF** y **Descargar PDF**, y una previsualización embebida en la página de detalle.

---

## Cómo agregar LaTeX

1. Copia el archivo `.tex` en la misma carpeta del material, por ejemplo `assets/material/ayudantia-04/ayudantia-04.tex`.
2. Agrega la clave `"latex"` dentro de `files` en `data/material.json` apuntando a esa ruta.
3. Aparecerá automáticamente el botón **Descargar LaTeX**.

Si además tienes otros archivos fuente (imágenes, bibliografía, etc.), agrúpalos en un `.zip` y usa la clave `"source"` — se mostrará como **Descargar archivos fuente**.

---

## Cómo agregar videos

1. Abre `data/videos.json`.
2. Agrega un nuevo objeto al arreglo con el enlace de YouTube del video (no se sube ni se descarga ningún archivo de video):

   ```json
   {
     "id": "clase-04",
     "title": "Clase 04 — Política monetaria",
     "professor": "Nombre del profesor",
     "topic": "Política monetaria",
     "description": "Clase sobre las herramientas de política monetaria.",
     "youtube": "https://www.youtube.com/watch?v=ABC12345678"
   }
   ```

3. Guarda, haz commit y push. La tarjeta se genera sola, con miniatura de YouTube incluida.

Los dos videos que vienen por defecto están marcados con `[Ejemplo]` y usan `VIDEO_ID` como marcador de posición — reemplázalos o elimínalos cuando tengas los enlaces reales.

---

## Cómo modificar categorías

Las categorías disponibles hoy son: `Ayudantías`, `Apuntes`, `Ejercicios`, `Controles`, `Certámenes`, `Presentaciones`, `Complementario`.

Para agregar, quitar o renombrar una categoría hay que actualizarla en dos lugares:

1. **`assets/js/material.js`** — el arreglo `CATEGORIES` al inicio del archivo (controla los chips de filtro de `material.html`).
2. **`assets/js/data.js`** — el objeto `CATEGORY_CLASS` (asocia cada categoría a un color) y, si agregas una categoría nueva, define su color en **`assets/css/style.css`** dentro de `:root` (junto a `--cat-ayudantias`, `--cat-apuntes`, etc.) y en el bloque `[data-theme="dark"]` para que también tenga un color adecuado en modo oscuro.

Después, usa exactamente ese mismo nombre de categoría en el campo `"category"` de `data/material.json`.

---

## Cómo modificar autores

Los nombres de los creadores (**Ignacio Garrido & Alex Fierro**) aparecen escritos directamente en:

- `index.html`, `material.html`, `material-detalle.html`, `videos.html`, `about.html` — en la marca del encabezado (`site-brand`) y en el footer.
- `about.html` — en la sección "Creadores" (`.creator-list`), donde puedes también agregar una descripción breve para cada persona.

Busca el texto `Ignacio Garrido` y `Alex Fierro` en esos archivos y reemplázalo. El campo `"authors"` de cada entrada en `data/material.json` es independiente y se puede ajustar material por material si distintas ayudantías tienen distintos autores.

---

## Cómo cambiar colores

Todos los colores están centralizados como variables CSS en `assets/css/style.css`, dentro de `:root` (modo claro) y `[data-theme="dark"]` / `@media (prefers-color-scheme: dark)` (modo oscuro). No es necesario tocar ningún otro archivo.

Las variables más relevantes:

```css
--color-paper       /* fondo principal */
--color-ink         /* color de texto principal */
--color-accent       /* color de énfasis (enlaces, botón principal) */
--color-warm         /* color secundario (usado en la curva de oferta del hero) */
```

Y los colores por categoría (`--cat-ayudantias`, `--cat-apuntes`, `--cat-ejercicios`, `--cat-controles`, `--cat-certamenes`, `--cat-presentaciones`, `--cat-complementario`), usados en los bordes y etiquetas de las tarjetas.

---

## Cómo desplegar en GitHub Pages

Este repositorio incluye `.github/workflows/deploy.yml`, que publica el sitio automáticamente cada vez que haces push a la rama `main`.

Pasos para activarlo la primera vez:

1. Sube este proyecto a un repositorio de GitHub.
2. Ve a **Settings → Pages** en el repositorio.
3. En "Build and deployment", selecciona **Source: GitHub Actions**.
4. Haz push a `main` (o ejecuta el workflow manualmente desde la pestaña **Actions**).
5. GitHub Pages entregará una URL del tipo `https://TU-USUARIO.github.io/TU-REPOSITORIO/`.

Si tu rama principal se llama `master` en vez de `main`, edita esa palabra en `.github/workflows/deploy.yml` (línea `branches: ["main"]`).

**Despliegue manual alternativo** (sin GitHub Actions): en **Settings → Pages**, selecciona **Source: Deploy from a branch**, elige la rama `main` y la carpeta `/ (root)`. No requiere ningún paso de build porque el sitio ya es HTML/CSS/JS puro.

Todas las rutas del proyecto son relativas, por lo que el sitio funciona igual tanto en la raíz de un dominio como en un repositorio de proyecto (`usuario.github.io/repositorio/`).

---

## Qué debes configurar manualmente

- **Enlaces del footer**: en cada archivo `.html`, reemplaza `https://github.com/USUARIO/REPOSITORIO`, `https://www.linkedin.com/in/PERFIL` y `correo@ejemplo.com` por los enlaces reales.
- **Semestre**: el texto "semestre 2026-2" aparece en `index.html` (hero), `about.html` (párrafo introductorio) y en el footer de las cinco páginas. Cuando cambie el semestre, busca y reemplaza ese texto en esos archivos.
- **Material de ejemplo**: los tres materiales y los dos videos de ejemplo en `data/material.json` y `data/videos.json` deben reemplazarse por contenido real (o eliminarse) antes de compartir el sitio ampliamente.
- **Archivos reales**: sube los `.pdf`, `.tex` y `.zip` reales a `assets/material/ayudantia-XX/` — actualmente esas carpetas solo tienen un `README.md` de marcador de posición.

---

## Uso responsable

Este proyecto nace con fines académicos y educativos. El material disponible busca facilitar el aprendizaje, la organización y el acceso a recursos utilizados en la ayudantía. Se invita a utilizarlo de forma responsable, respetando la autoría de quienes participaron en su elaboración y evitando cualquier uso comercial o fraudulento. Más detalles en la página [Sobre el proyecto](./about.html).
