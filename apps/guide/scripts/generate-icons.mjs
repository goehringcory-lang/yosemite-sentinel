import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const sourcePath = join(publicDir, 'icon.svg')

const PAPER = '#f1ead6'

async function main() {
  const svgBuffer = await readFile(sourcePath)

  await sharp(svgBuffer, { density: 384 })
    .resize(192, 192)
    .png()
    .toFile(join(publicDir, 'icon-192.png'))

  await sharp(svgBuffer, { density: 384 })
    .resize(512, 512)
    .png()
    .toFile(join(publicDir, 'icon-512.png'))

  await sharp(svgBuffer, { density: 384 })
    .resize(180, 180)
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'))

  // Maskable: render the icon at 80% scale on a paper-colored full-bleed
  // background so Android adaptive-icon mask doesn't crop the letterform.
  const inner = await sharp(svgBuffer, { density: 384 })
    .resize(410, 410)
    .png()
    .toBuffer()

  await sharp({
    create: { width: 512, height: 512, channels: 4, background: PAPER },
  })
    .composite([{ input: inner, top: 51, left: 51 }])
    .png()
    .toFile(join(publicDir, 'icon-maskable.png'))

  console.log('Generated: icon-192, icon-512, icon-maskable, apple-touch-icon')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
