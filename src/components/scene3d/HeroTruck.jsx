import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { blobShadow, frameModel, hideGroundSlabs, visibleBox } from '../../lib/three-utils'

// Piezas que forman las 6 ruedas (llanta, rin, tapa y buje). three.js quita los puntos de los nombres: embetunada.001 -> embetunada001
const WHEEL = /^(embetunada|bocin_f2|rin_10_huecos|copas_f|embetunada_r|bocin_r|rin_7_huecos_r|copas_r2)(\d{3})?$/
const REV_SECONDS = 1.35 // una vuelta de rueda
const BOUNCE = { amp: 0.016, half: 0.42 } // vibración de la carrocería (unidades del modelo, segundos por tramo)
const TAU = Math.PI * 2

/**
 * Camión 3D del hero: va "en marcha" (ruedas girando y suspensión vibrando) pero no reacciona al puntero.
 * El frente del modelo apunta a +Z negativo; se mira desde su lado derecho para que avance hacia la derecha de la pantalla.
 */
export default function HeroTruck({ src, className = '', onReady }) {
  const host = useRef(null)

  useEffect(() => {
    const el = host.current
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) }
    catch (err) {
      console.error('No se pudo inicializar WebGL para el camión 3D:', err)
      onReady?.()
      return
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.35
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.className = 'block size-full'
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envScene = new RoomEnvironment()
    const envTex = pmrem.fromScene(envScene, 0.04).texture
    scene.environment = envTex
    scene.environmentIntensity = 0.75
    const key = new THREE.DirectionalLight(0xffd7a8, 2.6); key.position.set(8, 10, -5) // luz cálida del atardecer
    const rim = new THREE.DirectionalLight(0x7fb0ff, 0.9); rim.position.set(-6, 5, 7)  // contraluz frío para separarlo del fondo
    scene.add(key, rim)

    const camera = new THREE.PerspectiveCamera(18, 1.9, 0.1, 200)
    const yaw = THREE.MathUtils.degToRad(0), pitch = THREE.MathUtils.degToRad(2) // perfil: se mira desde el lado derecho del camión
    const dir = new THREE.Vector3(Math.cos(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.sin(yaw) * Math.cos(pitch)).normalize()

    let model, shadow, box, disposed = false, visible = true, last = 0, spin = 0
    const wheels = []
    const draw = () => renderer.render(scene, camera)
    const resize = (entries) => {
      const cr = entries?.[0]?.contentRect
      const w = cr ? cr.width : el.clientWidth, h = cr ? cr.height : el.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      if (box) { frameModel(camera, box, dir); if (reduced) draw() }
    }
    const ro = new ResizeObserver(resize); ro.observe(el)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }); io.observe(el)

    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(src, (gltf) => {
      if (disposed) return
      model = gltf.scene
      model.traverse((o) => {
        if (WHEEL.test(o.name)) wheels.push(o)
        if (o.isMesh) [].concat(o.material).forEach((m) => { if (m.transparent) m.depthWrite = m.alphaTest > 0 })
      })
      hideGroundSlabs(model)
      scene.add(model)
      box = visibleBox(model)
      const size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3())
      shadow = blobShadow(size.x * 1.5, size.z * 1.25)
      shadow.position.set(center.x, box.min.y + 0.02, center.z)
      scene.add(shadow)
      camera.far = size.length() * 20
      resize()
      el.dataset.ready = '1'
      if (reduced) draw()
      onReady?.()
    }, undefined, (err) => {
      console.error('No se pudo cargar el camión 3D:', err)
      onReady?.()
    })

    if (!reduced) {
      renderer.setAnimationLoop((ms) => {
        const t = ms / 1000, dt = Math.min(t - last, 0.05); last = t
        if (!model || !visible) return
        spin = (spin + (TAU / REV_SECONDS) * dt) % TAU
        for (const w of wheels) w.rotation.x = -spin // avanzar hacia -Z = girar en sentido negativo sobre X
        model.position.y = BOUNCE.amp * (0.5 - 0.5 * Math.cos((t * Math.PI) / BOUNCE.half))
        draw()
      })
    }

    return () => {
      disposed = true
      renderer.setAnimationLoop(null); ro.disconnect(); io.disconnect()
      model?.traverse((o) => {
        if (!o.isMesh) return
        o.geometry.dispose()
        ;[].concat(o.material).forEach((m) => { Object.values(m).forEach((v) => v?.isTexture && v.dispose()); m.dispose() })
      })
      shadow?.material.map.dispose(); shadow?.material.dispose(); shadow?.geometry.dispose()
      envTex.dispose(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove()
    }
  }, [src, onReady])

  return (
    <div ref={host} aria-hidden="true"
      className={`absolute right-[1%] bottom-0 aspect-[1.9] w-[min(60%,calc(min(100svh,900px)*1.2))] opacity-0 [transform:translateX(7%)] transition-[opacity,transform] duration-[1400ms] ease-soft data-[ready]:opacity-100 data-[ready]:[transform:none] motion-reduce:!opacity-100 motion-reduce:![transform:none] max-[760px]:-right-[16%] max-[760px]:w-[135%] ${className}`} />
  )
}
