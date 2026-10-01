# 🎮 **Portafolio de Plugins Minecraft** por Lefiyt

¡Hola! 👋 Soy **Lefiyt**, desarrollador de **plugins personalizados para Minecraft** desde Rubí, Cataluña. 

Aquí encontrarás todos mis **plugins premium y gratuitos** para **Spigot/Paper** con código optimizado, documentación completa y soporte activo.

[![GitHub followers](https://img.shields.io/github/followers/lefiyt?style=for-the-badge&logo=github)](https://github.com/LeFixYT)
[![Discord](https://img.shields.io/badge/Discord-Contacto%20Programador-blue?style=for-the-badge&logo=discord)](https://discord.gg/k8aFvCtwkY)

🤝 Contáctame

<div align="center">
⭐ Si te gusta mi trabajo, deja una estrella al repositorio
¡Gracias por apoyar el desarrollo independiente! 🎉

</div>

---
## Cambios recientes
- Tour: usa `video/tour.mp4` si existe (sin anuncios); si no, YouTube como antes; y si YouTube falla, imagen animada + música Chill local.
- Eliminado `youtube.com/iframe_api` de la carga inicial (no se usaba).
- Imágenes convertidas a WebP conservando la transparencia; audio con `preload="none"`.
- Arreglado el menú móvil (`initMobileMenu` no existía y el botón no hacía nada).

## Seguridad y rendimiento
- Política de seguridad (CSP) en `index.html`: solo permite scripts propios, fuentes de Google y vídeos de YouTube. Sin scripts ni eventos en línea.
- Enlaces externos con `rel="noopener noreferrer"`.
- El enlace de YouTube del easter egg solo acepta identificadores con formato válido; la lista de pistas se crea sin `innerHTML`.
- Las estrellas del fondo se pausan con la pestaña oculta y respetan «reducir movimiento».
- Imágenes con carga diferida (`loading="lazy"`), avatar precargado y una fuente menos.
- Limitación: GitHub Pages no permite cabeceras HTTP (HSTS, X-Frame-Options, etc.). Para eso hace falta poner Cloudflare delante o alojarlo en un servidor propio.
