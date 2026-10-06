# Portafolio LeFixYT

Portafolio personal de LeFix (Minecraft Developer) en HTML, CSS y JavaScript puro. Publicado con GitHub Pages.
https://lefixyt.github.io/lefixytportafolio.github.io/

## Estructura
```
index.html
assets/
  css/style.css
  js/app.js
  img/        imágenes (WebP con transparencia donde hace falta)
  audio/      música Chill y sonido de clic
  video/      tour-1.mp4, tour-2.mp4, tour-3.mp4 (opcionales)
tools/
  comprimir-video.bat   prepara los vídeos del tour
docs/
  VIDEOS.md             cómo añadir los vídeos
```

## Ver los cambios en local
Dentro de esta carpeta:
```
python -m http.server 8000 --bind 127.0.0.1
```
Abre http://localhost:8000 y recarga con Ctrl + Shift + R.

## Publicar
Sube el contenido de esta carpeta a la raíz del repositorio (`index.html` debe quedar en la raíz).

## Seguridad y rendimiento
- Política de seguridad (CSP) en `index.html`: scripts propios, fuentes de Google y vídeos de YouTube.
- Sin scripts ni eventos en línea; enlaces externos con `rel="noopener noreferrer"`.
- Imágenes con carga diferida, audio sin precarga, animaciones pausadas con la pestaña oculta.
- GitHub Pages no permite cabeceras HTTP propias (HSTS, X-Frame-Options).
