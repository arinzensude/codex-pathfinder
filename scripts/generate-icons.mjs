// Dependency-free PNGs for the small, code-drawn path symbol in favicon.svg.
import { mkdirSync, writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

function crc32(bytes) {
  let crc = 0xffffffff
  for (const byte of bytes) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
  }
  return (crc ^ 0xffffffff) >>> 0
}
function chunk(name, data) {
  const body = Buffer.concat([Buffer.from(name), data])
  const length = Buffer.alloc(4); length.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}
function png(size) {
  const rows = Buffer.alloc(size * (size * 3 + 1))
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const px = x * 512 / size, py = y * 512 / size
    const start = Math.hypot(px - 170, py - 348) <= 28
    const end = Math.hypot(px - 342, py - 164) <= 28
    const path = (Math.abs(px - 170) <= 16 && py >= 272 && py <= 348) ||
      (Math.abs(py - 222) <= 16 && px >= 220 && px <= 292) ||
      (Math.abs(px - 342) <= 16 && py >= 164 && py <= 172) ||
      (px <= 220 && py <= 272 && Math.abs(Math.hypot(px - 220, py - 272) - 50) <= 16) ||
      (px >= 292 && py >= 172 && Math.abs(Math.hypot(px - 292, py - 172) - 50) <= 16)
    const color = start ? [153, 246, 228] : end || path ? [255, 255, 255] : [15, 118, 110]
    const offset = y * (size * 3 + 1) + 1 + x * 3
    rows.set(color, offset)
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0); header.writeUInt32BE(size, 4)
  header[8] = 8; header[9] = 2
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header), chunk('IDAT', deflateSync(rows)), chunk('IEND', Buffer.alloc(0))])
}
const directory = new URL('../public/icons/', import.meta.url)
mkdirSync(directory, { recursive: true })
for (const [name, size] of [['pwa-192.png', 192], ['pwa-512.png', 512], ['pwa-maskable-512.png', 512]]) {
  writeFileSync(new URL(name, directory), png(size))
}
