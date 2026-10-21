import launcherShot from './assets/launcher.webp'
import launcher640 from './assets/launcher-640.webp'
import launcher960 from './assets/launcher-960.webp'
import launcher1280 from './assets/launcher-1280.webp'

/* =====================================================================
   CONFIGURACIÓN DE SERVICIOS
   ===================================================================== */
export const CONFIG = {
  launcher: {
    // Enlace del botón "Descargar launcher"
    downloadUrl: 'https://www.dropbox.com/scl/fi/9ppuom939c3ssmwl891vg/Launcher-CM3D.rar?rlkey=odk3zcdt58qp61z249xohj6zl&dl=1',
    version: '',
    os: 'Windows',
    requirements: '',
    screenshots: [
      { src: launcherShot, srcSet: `${launcher640} 640w, ${launcher960} 960w, ${launcher1280} 1280w, ${launcherShot} 1919w`, width: 1919, height: 1012, label: 'Inicio', alt: 'Pantalla de inicio del launcher de Colombia Mods 3D con el mod destacado y los próximos lanzamientos' },
    ], // [{ src, label, alt, hotspots: [{ x, y, label, text }] }]
    features: [
      'Tienda de mods', 'Garage', 'Plugins', 'Encuestas', 'Servidores',
      'Descarga de la Base y el Activador', 'Inicio de sesión local o con Gmail', 'Actualización automática',
    ],
  },
  discordUrl: 'https://discord.gg/ssPbZwxSJQ', // Cada mod puede traer su propio buyUrl
  contact: {
    email: 'support@colombiamods3d.com',
    endpoint: import.meta.env.VITE_CONTACT_ENDPOINT || `${(import.meta.env.VITE_BACKEND_URL || 'https://backendmods.colombiamods3d.com').replace(/\/+$/, '')}/api/contact`,
  },
  // Datos del responsable del tratamiento (Ley 1581 de 2012). Completa razón social, NIT, dirección y teléfono: se muestran en la Política de privacidad solo si tienen valor.
  legal: { company: 'Colombia Mods 3D', nit: '', address: '', phone: '', updated: '13 de octubre de 2026' },
  businessEmail: 'business@colombiamods3d.com',
  social: [
    { name: 'Discord', url: 'https://discord.gg/ssPbZwxSJQ' },
    { name: 'YouTube', url: 'https://www.youtube.com/@Medinacm3D' },
    { name: 'Instagram', url: 'https://www.instagram.com/cm3dcol/' },
    { name: 'Facebook', url: 'https://www.facebook.com/colombiamods3d' },
  ],
  // Los mods se cargan desde el backend. Este debe permitir CORS para el dominio de la página.
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'https://backendmods.colombiamods3d.com',
  // Modelo 3D (GLB) de Inicio
  modelUrl: `${import.meta.env.BASE_URL}models/columbia.glb`,
}

export const CATS = [
  ['camion', 'Camiones'],
  ['trailer', 'Trailers'],
  ['accesorio', 'Accesorios'],
  ['proximamente', 'Próximamente'],
]
export const CAT_LABEL = { camion: 'Camión', trailer: 'Trailer', accesorio: 'Accesorio', proximamente: 'Próximamente' }
export const SIMNAME = { ETS2: 'Euro Truck Simulator 2', ATS: 'American Truck Simulator' }

export const MSG = {
  launcher: 'El enlace de descarga del launcher aún no está configurado (CONFIG.launcher.downloadUrl).',
  discord: 'El enlace de Discord aún no está configurado (CONFIG.discordUrl o buyUrl del mod).',
}
