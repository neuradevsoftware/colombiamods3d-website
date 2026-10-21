#!/usr/bin/env node
/**
 * Comprime un modelo GLB para la web (geometría con meshopt, atributos cuantizados, sin UV si no hay texturas).
 * El GLB original del camión pesaba 20,3 MB; tras este proceso pesa ≈1,9 MB sin cambios visibles.
 *
 *   npm run optimize:model -- entrada.glb public/models/columbia.glb
 *
 * El cargador (GLTFLoader + MeshoptDecoder) ya está configurado en src/components/scene3d.
 */
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, prune, quantize, reorder, meshopt, weld } from '@gltf-transform/functions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'
import { statSync } from 'node:fs'

const [input, output] = process.argv.slice(2)
if (!input || !output) {
  console.error('Uso: npm run optimize:model -- <entrada.glb> <salida.glb>')
  process.exit(1)
}

await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready])
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder })

const doc = await io.read(input)

// Sin texturas, los UV solo ocupan espacio.
for (const mesh of doc.getRoot().listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    if (prim.getMaterial()?.listTextures().length) continue
    for (const semantic of prim.listSemantics()) if (semantic.startsWith('TEXCOORD_')) prim.setAttribute(semantic, null)
  }
}

await doc.transform(
  dedup(),
  prune(),
  weld(),
  quantize({ quantizePosition: 14, quantizeNormal: 10, quantizeColor: 8 }),
  reorder({ encoder: MeshoptEncoder }),
  meshopt({ encoder: MeshoptEncoder, level: 'high' }),
)
await io.write(output, doc)

const mb = (p) => (statSync(p).size / 1024 / 1024).toFixed(2) + ' MB'
console.log(`${input} (${mb(input)}) → ${output} (${mb(output)})`)
