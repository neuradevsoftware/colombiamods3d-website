import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// Tipografías alojadas en el propio sitio (sin Google Fonts)
import '@fontsource/oswald/latin-400.css'
import '@fontsource/oswald/latin-500.css'
import '@fontsource/oswald/latin-600.css'
import '@fontsource/oswald/latin-700.css'
import '@fontsource/rajdhani/latin-400.css'
import '@fontsource/rajdhani/latin-500.css'
import '@fontsource/rajdhani/latin-600.css'
import '@fontsource/rajdhani/latin-700.css'
import '@fontsource/share-tech-mono/latin-400.css'
import './index.css'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
addEventListener('pageshow', () => scrollTo({ top: 0, behavior: 'instant' }))

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
