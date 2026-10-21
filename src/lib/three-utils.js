import * as THREE from 'three'

/** Sombra de contacto suave bajo el vehículo (plano con degradado radial). */
export function blobShadow(w, d) {
  const c = document.createElement('canvas'); c.width = c.height = 256
  const g = c.getContext('2d')
  const gr = g.createRadialGradient(128, 128, 10, 128, 128, 128)
  gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256)
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }))
  m.rotation.x = -Math.PI / 2
  return m
}

/**
 * El GLB incluye una losa plana pegada al suelo, más ancha que el propio camión
 * (se ve como una plataforma negra o como rectángulos en malla). La ocultamos.
 */
export function hideGroundSlabs(root) {
  const b = new THREE.Box3(), s = new THREE.Vector3()
  root.updateMatrixWorld(true)
  root.traverse((o) => {
    if (!o.isMesh) return
    b.setFromObject(o); b.getSize(s)
    if (s.x * s.z > 15 && s.y < 0.3 && b.min.y < 0.15) o.visible = false
  })
}

/** Caja visible del modelo (ignora lo oculto). */
export function visibleBox(root) {
  const box = new THREE.Box3(), b = new THREE.Box3()
  root.updateMatrixWorld(true)
  root.traverse((o) => { if (o.isMesh && o.visible) box.union(b.setFromObject(o)) })
  return box
}

/**
 * Coloca la cámara mirando al modelo desde la dirección `dir` y lo encuadra:
 * centrado en horizontal, apoyado abajo con un margen y ocupando `fill` del ancho.
 */
export function frameModel(camera, box, dir, { fill = 0.94, bottom = 0.06, top = 0.04 } = {}) {
  const size = box.getSize(new THREE.Vector3()), target = box.getCenter(new THREE.Vector3())
  const corners = []
  for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) corners.push(new THREE.Vector3(x, y, z))
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)
  const right = new THREE.Vector3(), camUp = new THREE.Vector3(), p = new THREE.Vector3()
  let dist = size.length() * 2.5
  for (let i = 0; i < 8; i++) {
    camera.position.copy(target).addScaledVector(dir, dist)
    camera.lookAt(target); camera.updateMatrixWorld(true); camera.updateProjectionMatrix()
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
    for (const c of corners) { p.copy(c).project(camera); minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y) }
    dist *= Math.max((maxX - minX) / 2 / fill, (maxY - minY) / 2 / (1 - bottom - top))
    const halfH = tanHalf * dist, halfW = halfH * camera.aspect
    right.setFromMatrixColumn(camera.matrixWorld, 0); camUp.setFromMatrixColumn(camera.matrixWorld, 1)
    target.addScaledVector(right, ((minX + maxX) / 2) * halfW).addScaledVector(camUp, (minY - (-1 + 2 * bottom)) * halfH)
  }
  camera.position.copy(target).addScaledVector(dir, dist)
  camera.lookAt(target); camera.updateMatrixWorld(true); camera.updateProjectionMatrix()
}
