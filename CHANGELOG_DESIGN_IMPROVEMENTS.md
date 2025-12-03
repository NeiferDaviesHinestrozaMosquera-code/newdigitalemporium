# Mejoras de Diseño y Aspecto (UX/UI)

Este documento resume las mejoras de diseño y experiencia de usuario (UX/UI) implementadas en el proyecto, siguiendo las solicitudes del cliente.

## Resumen de Implementaciones

| Característica Solicitada | Componentes Modificados/Añadidos | Descripción de la Mejora |
| :--- | :--- | :--- |
| **Efectos Parallax y Animaciones de Mouse** | `ParallaxHero.tsx` (Modificado), `ParallaxSection.tsx` (Nuevo) | Se mejoró el componente `ParallaxHero` con efectos de mouse (inclinación) y elementos flotantes animados. Se creó `ParallaxSection` para aplicar un sutil efecto parallax a cualquier sección de la página. |
| **Animaciones de Scroll (Scroll Reveal)** | `ScrollReveal.tsx` (Nuevo) | Se creó un componente `ScrollReveal` que utiliza `framer-motion` para animar la entrada de elementos (fade-in, slide-in) a medida que el usuario se desplaza por la página. Esto se aplicó a las secciones principales de `page.tsx`, `services/page.tsx`, `projects/page.tsx` y `projects/[slug]/page.tsx`. |
| **Carrusel de Imágenes de Servicios** | `ServiceCarousel.tsx` (Nuevo), `services/page.tsx` (Modificado) | Se implementó un carrusel de imágenes en la parte superior de la página de Servicios (`services/page.tsx`) utilizando **Embla Carousel** para mostrar imágenes relacionadas con los servicios. |
| **Tarjetas de Servicios Mejoradas** | `ServiceCard.tsx` (Modificado) | Se añadieron animaciones de hover (escala, sombra) a las tarjetas de servicio usando `framer-motion`. El botón "Learn More" ahora abre un **Modal/Dialog** (usando Radix UI) que muestra la descripción completa del servicio y un CTA para solicitar una cotización. |
| **Carrusel de Proyectos Mejorado** | `ProjectImageCarousel.tsx` (Modificado) | Se mejoró el carrusel de imágenes de proyectos con animaciones de navegación, indicadores de puntos y un contador de imágenes, ofreciendo una experiencia más pulida y animada. |

## Archivos Modificados

- `src/components/shared/ParallaxHero.tsx`: Mejoras en parallax y animaciones de mouse.
- `src/components/shared/ServiceCard.tsx`: Animaciones de hover y funcionalidad "Learn More" con `Dialog`.
- `src/components/projects/ProjectImageCarousel.tsx`: Mejoras visuales y animaciones.
- `src/components/shared/ParallaxSection.tsx`: **Nuevo** componente para efectos parallax en secciones.
- `src/components/shared/ScrollReveal.tsx`: **Nuevo** componente para animaciones de scroll.
- `src/components/shared/ServiceCarousel.tsx`: **Nuevo** componente para el carrusel de servicios.
- `src/app/[lang]/page.tsx`: Integración de `ParallaxSection` y `ScrollReveal` en las secciones principales.
- `src/app/[lang]/services/page.tsx`: Integración de `ServiceCarousel` y `ScrollReveal`.
- `src/app/[lang]/projects/page.tsx`: Integración de `ParallaxSection` y `ScrollReveal`.
- `src/app/[lang]/projects/[slug]/page.tsx`: Integración de `ParallaxSection` y `ScrollReveal`.

## Instrucciones para el Despliegue

Los cambios se han realizado en los archivos fuente del proyecto. Para ver las mejoras:

1.  Asegúrate de que tu repositorio local esté actualizado con estos cambios.
2.  Ejecuta la aplicación localmente (`npm run dev`) para previsualizar las animaciones.
3.  Realiza un nuevo despliegue en Vercel. Dado que el proyecto ya utiliza Next.js y las dependencias añadidas (`framer-motion`, `embla-carousel-react`) son compatibles con Vercel, el despliegue debería ser directo.
