import { Component } from 'react'

/** Evita la pantalla en blanco si una página lanza un error inesperado. Se reinicia al cambiar de ruta. */
export default class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error, info) { console.error('Error en la interfaz:', error, info.componentStack) }
  componentDidUpdate(prev) { if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null }) }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <section role="alert" className="pad grid flex-1 place-items-center py-[calc(var(--hh)+60px)] text-center">
        <div className="max-w-[46ch]">
          <h1 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold uppercase">Algo salió mal</h1>
          <p className="mt-3 mb-6 text-steel-light">Ocurrió un error inesperado al mostrar esta página. Recarga e inténtalo de nuevo; si persiste, escríbenos a soporte.</p>
          <a href="/" className="inline-flex h-12 items-center rounded-[7px] border border-amber px-6 font-display text-sm uppercase tracking-[1.5px] text-amber transition-colors hover:bg-amber hover:text-[#1a1206]">Volver al inicio</a>
        </div>
      </section>
    )
  }
}
