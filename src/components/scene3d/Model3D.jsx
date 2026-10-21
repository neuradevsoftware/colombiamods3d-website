import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { blobShadow, hideGroundSlabs, visibleBox } from '../../lib/three-utils'

// Colores del modo malla: líneas cian sobre un relleno casi del color del fondo
const WIRE_COLOR = 0x35d3ff
const FILL_COLOR = 0x0b0f13

// Cámara: vista 3/4 frontal (el frente del modelo apunta a -Z), algo elevada. FILL = fracción del encuadre que ocupa el modelo.
const START_DIR = new THREE.Vector3(0.8, 0.3, -0.85).normalize()
const FILL = 0.88
const RESUME_MS = 1200 // espera tras soltar el modelo antes de que retome el giro automático

/**
 * Modelo 3D (GLB) sin interfaz. Por defecto sólido, con sus materiales y texturas originales;
 * con `wireframe` se muestra solo la malla (aristas de los triángulos) en cian sobre relleno oscuro, estilo plano técnico.
 * Arrastrar gira el modelo; la rueda del ratón NO hace zoom para no bloquear el scroll de la página.
 */
export default function Model3D({ src, className = '', label = 'Modelo 3D', wireframe = false }) {
  const host = useRef(null)

  useEffect(() => {
    const el = host.current
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) }
    catch { return } // sin WebGL: el modelo es decorativo, la página sigue funcionando
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.5
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.className = 'block size-full cursor-grab touch-pan-y active:cursor-grabbing'
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envScene = new RoomEnvironment()
    const envTex = pmrem.fromScene(envScene, 0.04).texture
    scene.environment = envTex
    const sun = new THREE.DirectionalLight(0xffffff, 2.2)
    sun.position.set(6, 12, 8)
    scene.add(sun)

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200)
    const controls = new OrbitControls(camera, renderer.domElement)
    Object.assign(controls, { enableDamping: true, enableZoom: false, enablePan: false, autoRotate: !reduced, autoRotateSpeed: 1.2, maxPolarAngle: Math.PI * 0.495 })
    // Al arrastrar se pausa el giro automático; al soltar, vuelve a girar solo tras una breve pausa
    let resume
    controls.addEventListener('start', () => { clearTimeout(resume); controls.autoRotate = false })
    controls.addEventListener('end', () => { clearTimeout(resume); if (!reduced) resume = setTimeout(() => { controls.autoRotate = true }, RESUME_MS) })

    let model, shadow, box, center, disposed = false, visible = true
    // Aleja la cámara lo justo para que el modelo quepa entero desde CUALQUIER ángulo de la órbita
    // (se prueban 24 azimuts a la elevación actual) y lo deja centrado. Se repite al cambiar el tamaño del contenedor.
    const fit = () => {
      if (!box) return
      const corners = []
      for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) corners.push(new THREE.Vector3(x, y, z))
      const cur = camera.position.clone().sub(center)
      const elev = Math.asin(THREE.MathUtils.clamp(cur.y / cur.length(), -1, 1)), az0 = Math.atan2(cur.x, cur.z)
      const p = new THREE.Vector3(), dir = new THREE.Vector3()
      let worst = 0
      for (let k = 0; k < 24; k++) {
        const az = az0 + (k * Math.PI * 2) / 24
        dir.set(Math.sin(az) * Math.cos(elev), Math.sin(elev), Math.cos(az) * Math.cos(elev))
        let d = box.getSize(new THREE.Vector3()).length() * 2
        for (let i = 0; i < 5; i++) {
          camera.position.copy(center).addScaledVector(dir, d); camera.lookAt(center); camera.updateMatrixWorld(true)
          let m = 0
          for (const c of corners) { p.copy(c).project(camera); m = Math.max(m, Math.abs(p.x), Math.abs(p.y)) }
          d *= m / FILL
        }
        worst = Math.max(worst, d)
      }
      const start = Math.atan2(cur.x, cur.z)
      dir.set(Math.sin(start) * Math.cos(elev), Math.sin(elev), Math.cos(start) * Math.cos(elev))
      camera.position.copy(center).addScaledVector(dir, worst)
      controls.update()
    }
    const resize = (entries) => {
      const cr = entries?.[0]?.contentRect
      const w = cr ? cr.width : el.clientWidth, h = cr ? cr.height : el.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      fit()
    }
    const ro = new ResizeObserver(resize); ro.observe(el); resize()
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(el)

    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(src, (gltf) => {
      if (disposed) return
      model = gltf.scene
      hideGroundSlabs(model) // antes de crear la malla, para que la losa oculta no cuente en el encuadre
      const meshes = []
      model.traverse((o) => { if (o.isMesh) meshes.push(o) })
      for (const o of meshes) {
        if (wireframe && o.visible) {
          // Relleno oscuro (oculta la malla de atrás) + malla de color encima, sin texturas ni mezcla aditiva
          const old = [].concat(o.material)
          o.material = new THREE.MeshBasicMaterial({ color: FILL_COLOR, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1, toneMapped: false })
          o.add(new THREE.Mesh(o.geometry, new THREE.MeshBasicMaterial({ color: WIRE_COLOR, wireframe: true, toneMapped: false })))
          old.forEach((m) => { Object.values(m).forEach((v) => v?.isTexture && v.dispose()); m.dispose() })
        } else {
          ;[].concat(o.material).forEach((m) => { if (m.transparent) m.depthWrite = m.alphaTest > 0 })
        }
      }
      scene.add(model)
      box = visibleBox(model)
      const size = box.getSize(new THREE.Vector3())
      center = box.getCenter(new THREE.Vector3())
      if (!wireframe) {
        shadow = blobShadow(size.x * 1.7, size.z * 1.2)
        shadow.position.set(center.x, box.min.y + 0.02, center.z)
        scene.add(shadow)
      }
      camera.far = size.length() * 20
      camera.position.copy(center).add(START_DIR.clone().multiplyScalar(size.length() * 2))
      controls.target.copy(center)
      fit()
      el.dataset.ready = '1'
    }, undefined, (err) => console.error('No se pudo cargar el modelo 3D:', err))

    renderer.setAnimationLoop(() => { if (!visible) return; controls.update(); renderer.render(scene, camera) })

    return () => {
      disposed = true
      clearTimeout(resume)
      renderer.setAnimationLoop(null); ro.disconnect(); io.disconnect(); controls.dispose()
      model?.traverse((o) => {
        if (!o.isMesh) return
        o.geometry.dispose()
        ;[].concat(o.material).forEach((m) => { Object.values(m).forEach((v) => v?.isTexture && v.dispose()); m.dispose() })
      })
      if (shadow) { shadow.material.map.dispose(); shadow.material.dispose(); shadow.geometry.dispose() }
      envTex.dispose(); envScene.dispose?.(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove()
    }
  }, [src, wireframe])

  return <div ref={host} role="img" aria-label={label} className={`opacity-0 transition-opacity duration-700 data-[ready]:opacity-100 ${className}`} />
}
