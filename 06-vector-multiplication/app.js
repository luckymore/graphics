import { Vector2D } from '../common/lib/vector2d.js'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const R = new Vector2D(200, 100)
const Q = new Vector2D(420, 300)
// const P = new Vector2D(10, 200)
let P = new Vector2D(110, 300)
// const P = new Vector2D(410, 500)
const QP = P.copy().sub(Q)
const RQ = Q.copy().sub(R)

function drawLine(start, end, color = 'black', lineDash = []) {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.setLineDash(lineDash)
  ctx.moveTo(...start)
  ctx.lineTo(...end)
  ctx.stroke()
  ctx.closePath()
}
function text(x, y, text) {
  ctx.font = '16px serif'
  ctx.fillText(text, x - 20, y + 10)
  ctx.beginPath()
  ctx.arc(x, y, 3, 0, Math.PI * 2)
  ctx.fill()
}

// todo: 未明白如何计算垂足坐标
const GetFootOfPerpendicular = (pt, begin, end) => {
  const dx = begin.x - end.x
  const dy = begin.y - end.y
  const EPS = 0.00000001

  //  确保两个点不是同一个点
  if (Math.abs(dx) < EPS && Math.abs(dy) < EPS) {
    return begin
  }

  //计算斜率
  let u = (pt.x - begin.x) * (begin.x - end.x) + (pt.y - begin.y) * (begin.y - end.y)
  u = u / (Math.pow(dx, 2) + Math.pow(dy, 2))

  console.log(u)
  // const r = Math.abs(u)
  if (u > 0) {
    return R
  } else if (u > -1) {
    return new Vector2D(begin.x + u * dx, begin.y + u * dy)
  } else return Q

}

function init() {
  drawLine(R, Q)
  text(...R, 'R')
  text(...Q, 'Q')
  text(...P, 'P')
  
  // 在RQ的方向上左右变换，得到虚线部分
  drawLine(R.copy().sub(RQ), R, '#111', [5, 5])
  drawLine(Q, Q.copy().add(RQ), '#111', [5, 5])
  
  const O = GetFootOfPerpendicular(P, R, Q)
  
  drawLine(O, P, 'red')
  if (O !== R && O !== Q) text(...O, 'O')
}

init()

canvas.onmousemove = e => {
  const { x, y } = e
  console.log(x, y)
  P = new Vector2D(x, y)
  ctx.clearRect(0, 0, 512, 512)
  init()
}
