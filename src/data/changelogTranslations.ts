import changelogData from "./changelog.json";
import type { SupportedLocale } from "@/i18n";

type ChangelogEntry = (typeof changelogData)[number];
type TranslationMap = Partial<Record<ChangelogEntry["version"], string[]>>;

const en: TranslationMap = {
  "0.8.3": [
    "VERSION 0.8.3",
    "[IMPROVEMENT] Music player simplified on mobile to use less screen space.",
    "[FEATURE] Madoka can now be dragged around the screen and complains while being held.",
    "[FIX] Drag limits adjusted to keep Madoka visible on screen at all times.",
    "[IMPROVEMENT] The post editor toolbar now follows scrolling while writing.",
    "[IMPROVEMENT] The blog reading sidebar stays fixed on desktop and comfortable on mobile.",
    "[FEATURE] New Credits page with asset sources and project inspirations.",
    "[UI] Logo added to the site and integrated into mobile navigation with a home shortcut.",
    "[FEATURE] The comment moderation panel now shows every status and can query deleted comments.",
    "[IMPROVEMENT] Individual approve, reject, spam and delete actions update comments immediately.",
  ],
  "0.8.2": [
    "VERSION 0.8.2",
    "[UI] Calendar.exe redesigned with the Dark Purple palette and TheStarArt visual tokens.",
    "[IMPROVEMENT] Improved navigation, selection and current-day highlight states in the calendar.",
    "[FIX] Fixed small visual and responsive issues on the Diary page.",
  ],
  "0.8.1": [
    "VERSION 0.8.1",
    "[FEATURE] Optimistic UI likes implemented: heart and counter respond instantly.",
    "[IMPROVEMENT] Likes now have a synchronization queue, rapid-click debounce and automatic rollback on failure.",
    "[IMPROVEMENT] Added background sending with keepalive for synchronization attempts during navigation or page exit.",
    "[FEATURE] Added a discreet toast for like synchronization failures.",
    "[SECURITY] Authentication architecture refactored to use Vercel reverse proxy.",
    "[SECURITY] Production now consumes /api and /sanctum on the SPA domain, preserving Sanctum session, CSRF and HttpOnly cookies.",
    "[SECURITY] Removed the need for direct cross-domain communication for administrative login.",
    "[IMPROVEMENT] Local cache added for public Blog listings and posts.",
    "[IMPROVEMENT] Local cache added for music, with duplicate request prevention.",
    "[FIX] Music player remains active while navigating between public pages.",
    "[FIX] Fixed inconsistent clicks in administrative navigation.",
    "[TEST] Added tests for optimistic likes, post cache, API URL resolution and Sanctum sessions through the Vercel origin.",
  ],
  "0.8.0": [
    "VERSION 0.8",
    "[FEATURE] Smooth transition between pages implemented (RouterView + Transition).",
    "[IMPROVEMENT] Main layout restructured (Left / Content / Right) with better desktop organization.",
    "[IMPROVEMENT] Navbar adjusted for better visual consistency and header alignment.",
    "[IMPROVEMENT] Mobile responsiveness fixed (component order and grid layout).",
    "[IMPROVEMENT] General Blog adjustments (layout, spacing and rendering behavior).",
    "[FIX] Fixed visual behavior during page switching (white flash removal).",
  ],
  "0.7.3": [
    "[FEATURE] Layout and responsiveness fixes in the PostGrid.vue component.",
    "[FEATURE] Added pagination support and post loading through the API.",
  ],
  "0.7.2": [
    "[FEATURE] New Blog module — post creation and editing are now available for Admin.",
  ],
  "0.7.1": [
    "[FEATURE] New Diary page available.",
    "[FIX] Layout fixes, especially in the ChangeLog.vue component.",
  ],
  "0.7.0": [
    "[REFACTOR] Complete Navbar restructuring.",
    "[REFACTOR] Desktop and mobile navigation componentization.",
    "[UI] New mobile menu based on Shadcn Sheet.",
    "[UI] New visual atmosphere with a starry background.",
    "[UI] Visual consistency improvements across the homepage.",
    "[UI] Pixelify Sans typography fix.",
    "[UI] Playfair Display typography fix.",
    "[UI] Retro project identity adjustments.",
    "[FEATURE] Structure prepared for Shadcn Carousel.",
    "[STYLE] Global styles reorganized.",
    "[STYLE] Reduced custom CSS in favor of Tailwind.",
    "[STYLE] Reusable utilities created.",
    "[FIX] Fixed Google Fonts loading.",
    "[FIX] Fixed imports and style order.",
    "[PERF] Homepage simplified and visual complexity reduced.",
  ],
};

const es: TranslationMap = {
  "0.8.3": [
    "VERSIÓN 0.8.3",
    "[IMPROVEMENT] Reproductor de música simplificado en móvil para ocupar menos espacio en pantalla.",
    "[FEATURE] Madoka ahora puede arrastrarse por la pantalla y se queja mientras la sostienen.",
    "[FIX] Ajustados los límites de arrastre para mantener a Madoka siempre visible.",
    "[IMPROVEMENT] La barra de herramientas del editor de publicaciones ahora acompaña el desplazamiento durante la escritura.",
    "[IMPROVEMENT] La barra lateral de lectura del blog permanece fija en escritorio y cómoda en móvil.",
    "[FEATURE] Nueva página de Créditos con fuentes de assets e inspiraciones del proyecto.",
    "[UI] Logo añadido al sitio e integrado a la navegación móvil con acceso directo a inicio.",
    "[FEATURE] El panel de moderación de comentarios ahora muestra todos los estados y permite consultar comentarios eliminados.",
    "[IMPROVEMENT] Las acciones de aprobar, rechazar, marcar spam y eliminar actualizan los comentarios inmediatamente.",
  ],
  "0.8.2": [
    "VERSIÓN 0.8.2",
    "[UI] Rediseño de Calendar.exe con la paleta Dark Purple y los tokens visuales de TheStarArt.",
    "[IMPROVEMENT] Mejorados los estados de navegación, selección y destaque del día actual en el calendario.",
    "[FIX] Corregidos pequeños problemas visuales y de responsividad en la página del Diario.",
  ],
  "0.8.1": [
    "VERSIÓN 0.8.1",
    "[FEATURE] Implementado sistema de likes con UI optimista: corazón y contador responden al instante.",
    "[IMPROVEMENT] Los likes ahora tienen cola de sincronización, debounce contra clics rápidos y reversión automática ante fallos.",
    "[IMPROVEMENT] Añadado envío en segundo plano con keepalive durante navegación o salida de la página.",
    "[FEATURE] Añadido toast discreto para fallos de sincronización de likes.",
    "[SECURITY] Arquitectura de autenticación refactorizada para usar proxy inverso de Vercel.",
    "[SECURITY] Producción ahora consume /api y /sanctum en el dominio de la SPA, preservando sesión Sanctum, CSRF y cookies HttpOnly.",
    "[SECURITY] Eliminada la dependencia de comunicación directa entre dominios para el login administrativo.",
    "[IMPROVEMENT] Caché local añadida para listados y publicaciones públicas del Blog.",
    "[IMPROVEMENT] Caché local añadida para música, con prevención de solicitudes duplicadas.",
    "[FIX] El reproductor de música permanece activo al navegar entre páginas públicas.",
    "[FIX] Corregida la inconsistencia de clics en la navegación administrativa.",
    "[TEST] Añadidos tests para likes optimistas, caché de publicaciones, resolución de URLs de API y sesión Sanctum desde el origen de Vercel.",
  ],
  "0.8.0": [
    "VERSIÓN 0.8",
    "[FEATURE] Implementada transición suave entre páginas (RouterView + Transition).",
    "[IMPROVEMENT] Reestructurado el layout principal (Left / Content / Right) con mejor organización en escritorio.",
    "[IMPROVEMENT] Ajustes en la Navbar para mayor consistencia visual y alineación en el header.",
    "[IMPROVEMENT] Corregida la responsividad móvil (orden de componentes y grid layout).",
    "[IMPROVEMENT] Ajustes generales en el Blog (layout, espaciado y renderizado).",
    "[FIX] Corregido el comportamiento visual durante el cambio de páginas (eliminación de flash blanco).",
  ],
  "0.7.3": [
    "[FEATURE] Correcciones de layout y responsividad en el componente PostGrid.vue.",
    "[FEATURE] Añadido soporte para paginación y carga de publicaciones mediante la API.",
  ],
  "0.7.2": [
    "[FEATURE] Nuevo módulo de Blog — la creación y edición de publicaciones ya están disponibles para Admin.",
  ],
  "0.7.1": [
    "[FEATURE] Nueva página de Diario disponible.",
    "[FIX] Correcciones de layout, principalmente en el componente ChangeLog.vue.",
  ],
  "0.7.0": [
    "[REFACTOR] Reestructuración completa de la Navbar.",
    "[REFACTOR] Componentización de la navegación de escritorio y móvil.",
    "[UI] Nuevo menú móvil basado en Shadcn Sheet.",
    "[UI] Nueva ambientación visual con fondo estrellado.",
    "[UI] Mejoras de consistencia visual en toda la homepage.",
    "[UI] Corrección de la tipografía Pixelify Sans.",
    "[UI] Corrección de la tipografía Playfair Display.",
    "[UI] Ajustes de la identidad retro del proyecto.",
    "[FEATURE] Estructura preparada para Shadcn Carousel.",
    "[STYLE] Reorganización de los estilos globales.",
    "[STYLE] Reducción de CSS personalizado a favor de Tailwind.",
    "[STYLE] Creación de utilidades reutilizables.",
    "[FIX] Corregida la carga de Google Fonts.",
    "[FIX] Corregidas las importaciones y el orden de estilos.",
    "[PERF] Homepage simplificada y complejidad visual reducida.",
  ],
};

const translations: Partial<Record<SupportedLocale, TranslationMap>> = { en, es };

export const getLocalizedChangelog = (locale: string): ChangelogEntry[] => {
  const localizedChanges = translations[locale as SupportedLocale];

  return changelogData.map((entry) => ({
    ...entry,
    changes: localizedChanges?.[entry.version] ?? entry.changes,
  }));
};
