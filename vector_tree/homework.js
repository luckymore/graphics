import { Vector2D } from '../common/lib/vector2d.js'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

ctx.translate(0, canvas.height)
ctx.scale(1, -1)
ctx.lineCap = 'round'


/**
 * 绘制一颗随机树
 * context 是我们的 Canvas2D 上下文
 * v0 是起始向量
 * length 是当前树枝的长度
 * thickness 是当前树枝的粗细
 * dir 是当前树枝的方向，用与 x 轴的夹角表示，单位是弧度。
 * bias 是一个随机偏向因子，用来让树枝的朝向有一定的随机性
 */
function drawBranch(ctx, v0, length, thickness, dir, bias) {
  const v = new Vector2D(1, 0).rotate(dir).scale(length)
  const v1 = v.copy().add(v0)

  ctx.beginPath()
  ctx.moveTo(...v0)
  ctx.lineTo(...v1)
  ctx.lineWidth = thickness
  ctx.stroke()

  if (thickness > 2) {
    const left = Math.PI / 4 + 0.5 * (dir + 0.2) + bias * (Math.random() - 0.5);
    drawBranch(ctx, v1, length * 0.9, thickness * 0.8, left, bias * 0.9)

    const right = Math.PI / 4 + 0.5 * (dir - 0.2) + bias * (Math.random() - 0.5);
    drawBranch(ctx, v1, length * 0.9, thickness * 0.8, right, bias)
    // console.log(length, left, right)
  }

  if (thickness < 5 && Math.random() > 0.3) {
    ctx.beginPath()
    ctx.fillStyle = 'red'
    ctx.arc(...v1, 4 * Math.random(), 0, 2 * Math.PI)
    ctx.fill()
  }
}

const v0 = new Vector2D(256, 0);
console.log(v0)
drawBranch(ctx, v0, 50, 10, 1, 3);

let len = 50
// setInterval(() => {
//   len + 4
//   ctx.clearRect(0, 0, 521, 512)
//   drawBranch(ctx, v0, len, 10, 1, 3)
// }, 1000)
