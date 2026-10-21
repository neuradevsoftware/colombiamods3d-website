/** Contenedor de pantalla (.screen.active): entra con animación al cambiar de ruta. */
export default function Screen({ label, children }) {
  return <section aria-label={label} className="flex-1 animate-scr">{children}</section>
}
