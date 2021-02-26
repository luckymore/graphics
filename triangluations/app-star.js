// https://github.com/gltjk/learn-visualization/blob/65d2b107a9/common/lib/Canvas.js
import { Vector2D } from '../common/lib/vector2d.js'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

function initCoordinates() {
  ctx.translate(256, 256)
  ctx.scale(1, -1)
  ctx.beginPath()
  ctx.strokeStyle = '#666'
  ctx.moveTo(0, 256)
  ctx.lineTo(0, -256)
  ctx.moveTo(-256, 0)
  ctx.lineTo(256, 0)
  ctx.stroke()
  ctx.closePath()
}

function drawPolygon(points, { fillStyle = 'black', close = true, rule = 'nonzero', filled = false } = {}) {
  ctx.beginPath()
  // ctx.moveTo(...points[0])
  // points.slice(1).forEach((v, i) => ctx.lineTo(...v))
  points.forEach(v => ctx.arc(...v, 1, 0, Math.PI * 2))
  // if (close) ctx.closePath()
  ctx.fillStyle = fillStyle
  filled ? ctx.fill(rule) : ctx. stroke()
}

function getQuarterCircle() {
  // 圆（第一象限）
  const quarterCircle = [new Vector2D(100, 0)]
  for (let angle = 10; angle < 100; angle  += 10) {
    const t = angle / 180 * Math.PI
    quarterCircle.push(quarterCircle[0].copy().rotate(t))
  }

  console.log(quarterCircle)
  return quarterCircle
}
// drawPolygon(quarterCircle, { filled: false, fillStyle: 'red', rule: undefined })

// 好看的菱形星星
const betterSparkle = []
const translation = [
  [-100, -100],
  [-100, 100],
  [100, 100],
  [100, -100]
]
for (let i = 0; i <= 3; i++) {
  const rotated = getQuarterCircle().map(x => x.copy().rotate(i * Math.PI * -0.5).translate(translation[i]))
  betterSparkle.push(...rotated)
}
console.log(betterSparkle)

initCoordinates()

drawPolygon(betterSparkle, { filled: false, fillStyle: 'red', rule: undefined })
