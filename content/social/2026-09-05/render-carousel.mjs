import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const sharp = require('sharp')

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'assets', 'instagram-carousel')

const slides = [
  ['UST PLACEMENT GUIDE', 'Will your UST projector actually fit the cabinet?', 'Five measurements to take before you buy.', '⌂'],
  ['01 — SCREEN SIZE', 'Choose the screen size first', 'The same projector needs a different position for a 100-inch and a 120-inch image.', '↔'],
  ['02 — TWO DISTANCES', 'Check distance and vertical offset', 'Measure from the screen surface to the model-specific reference point—then check the image height.', '↕'],
  ['03 — THE WHOLE CABINET', 'Width and depth are not enough', 'Include cabinet height, rear cable space and the expanding light path above the projector.', '▱'],
  ['04 — COMPLETE SYSTEM', 'Plan audio and ventilation', 'A soundbar, centre speaker or enclosed shelf can interfere with the image or airflow.', '◫'],
  ['05 — PHYSICAL FIT FIRST', 'Do not fix furniture mistakes with keystone', 'Digital correction is for final alignment—not incorrect projector placement.', '◇'],
  ['SEND THESE DETAILS', 'Get a compatibility check before you buy', 'Projector model · Screen model · Target size · Cabinet dimensions · Front and side photos', '✓'],
]

const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

function wrap(text, max = 28) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > max && line) {
      lines.push(line)
      line = word
    } else line = next
  }
  if (line) lines.push(line)
  return lines
}

function textLines(lines, x, y, size, weight, fill, gap = 1.08) {
  return lines.map((line, index) => `<text x="${x}" y="${y + index * size * gap}" font-size="${size}" font-weight="${weight}" fill="${fill}">${escape(line)}</text>`).join('')
}

function svgFor([eyebrow, title, body, icon], index) {
  const titleLines = wrap(title, 27)
  const bodyLines = wrap(body, 54)
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
    <rect width="1080" height="1350" fill="#0B1A40"/>
    <rect width="24" height="1350" fill="#00D4FF"/>
    <circle cx="1000" cy="65" r="245" fill="#13244D"/>
    <circle cx="840" cy="675" r="190" fill="none" stroke="#24365E" stroke-width="2"/>
    <g font-family="Arial, Helvetica, sans-serif">
      <text x="80" y="108" font-size="30" font-weight="700" fill="#FFFFFF">REACH PROJECTOR</text>
      <text x="930" y="108" font-size="28" text-anchor="end" fill="#A7B3CB">${index + 1}/7</text>
      <text x="80" y="228" font-size="24" font-weight="700" letter-spacing="1.5" fill="#00D4FF">${escape(eyebrow)}</text>
      ${textLines(titleLines, 80, 335, 63, 700, '#FFFFFF', 1.08)}
      <circle cx="255" cy="760" r="118" fill="none" stroke="#FFC857" stroke-width="8"/>
      <text x="255" y="797" text-anchor="middle" font-size="108" font-weight="700" fill="#FFC857">${escape(icon)}</text>
      ${textLines(bodyLines, 80, 1030, 34, 400, '#D6DDEC', 1.35)}
      <line x1="80" y1="1230" x2="1000" y2="1230" stroke="#3B4C70" stroke-width="2"/>
      <text x="80" y="1287" font-size="24" font-weight="700" fill="#A7B3CB">Measure first. Buy with confidence.</text>
    </g>
  </svg>`
}

await fs.mkdir(outDir, { recursive: true })

for (let index = 0; index < slides.length; index += 1) {
  const filename = `${String(index + 1).padStart(2, '0')}-ust-cabinet.png`
  await sharp(Buffer.from(svgFor(slides[index], index))).png().toFile(path.join(outDir, filename))
}

console.log(`Rendered ${slides.length} slides to ${outDir}`)
