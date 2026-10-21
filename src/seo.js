/* Metadatos por página. Los usan la app (título/etiquetas al navegar) y el plugin de build (HTML pre-renderizado, sitemap). */
export const DEFAULT_SITE_URL = 'https://colombiamods3d.com' // sobrescribe con VITE_SITE_URL

export const PAGES = {
  '/': {
    title: 'Colombia Mods 3D — Mods personalizados para American Truck Simulator',
    description: 'Mods personalizados de alta calidad para American Truck Simulator. Camiones, trailers y accesorios con cada detalle cuidado. Descarga el launcher oficial.',
  },
  '/nosotros': {
    title: 'Quiénes somos — Colombia Mods 3D',
    description: 'Conoce a Colombia Mods 3D: creamos mods y modelos 3D para simuladores de conducción, con creatividad y atención al detalle.',
  },
  '/catalogo': {
    title: 'Catálogo de mods — Colombia Mods 3D',
    description: 'Explora el catálogo de camiones, trailers y accesorios de Colombia Mods 3D para American Truck Simulator.',
  },
  '/launcher': {
    title: 'Launcher oficial — Colombia Mods 3D',
    description: 'Descarga el launcher oficial de Colombia Mods 3D: tienda de mods, garage, plugins, servidores y actualizaciones automáticas.',
  },
  '/contacto': {
    title: 'Contacto y soporte — Colombia Mods 3D',
    description: '¿Tienes una consulta sobre el catálogo o necesitas soporte? Escríbenos.',
  },
  '/terminos': {
    title: 'Términos y condiciones — Colombia Mods 3D',
    description: 'Términos y condiciones de uso del sitio, el launcher y el servicio de seguridad CM3D Guard.',
  },
  '/privacidad': {
    title: 'Política de privacidad — Colombia Mods 3D',
    description: 'Cómo trata Colombia Mods 3D tus datos personales en el sitio, el launcher y CM3D Guard.',
  },
}

export const NOT_FOUND = {
  title: 'Página no encontrada — Colombia Mods 3D',
  description: 'La página que buscas no existe o cambió de dirección.',
}
