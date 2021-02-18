const dataSource = 'https://s5.ssl.qhres.com/static/b0695e2dd30daa64.json'

/* globals d3 */
;(async function () {
  const data = await (await fetch(dataSource)).json()
  const regions = d3
    .hierarchy(data)
    .sum((d) => 1)
    .sort((a, b) => b.value - a.value)

  const pack = d3.pack().size([1600, 1600]).padding(3)

  const root = pack(regions)
  console.log('root', root)

  CanvasRenderingContext2D.prototype.clearCircle = function (x, y, r) {
    this.save()
    this.fillStyle = 'rgba(255,255,255,255)'
    this.beginPath()
    this.arc(x, y, r, 0, TAU)
    this.fill()
    this.restore()
  }

  const canvas = document.querySelector('canvas')
  const context = canvas.getContext('2d')
  const TAU = 2 * Math.PI

  function draw(ctx, node, { fillStyle = 'rgba(0, 0, 0, 0.2)', textColor = 'white' } = {}) {
    const children = node.children
    const { x, y, r } = node
    ctx.fillStyle = fillStyle
    ctx.beginPath()
    ctx.arc(x, y, r, 0, TAU)
    ctx.fill()
    if (children) {
      for (let i = 0; i < children.length; i++) {
        draw(context, children[i])
      }
    } else {
      const name = node.data.name
      ctx.fillStyle = textColor
      ctx.font = '1.5rem Arial'
      ctx.textAlign = 'center'
      ctx.fillText(name, x, y)
    }
  }

  // 自己实现一遍
  function draw2(ctx, node, { fillStyle = 'rgba(0, 0, 0, 0.2)', textColor = 'white' } = {}) {
    const { x, y, r, data, children } = node
    const TAU = 2 * Math.PI

    ctx.fillStyle = fillStyle
    ctx.beginPath()
    ctx.arc(x, y, r, 0, TAU)
    ctx.fill()

    // 有 children 只画圈，否则才画文字
    if (children) children.forEach(child => draw2(ctx, child))
    else {
      ctx.fillStyle = textColor
      ctx.font = '1.5rem Arial'
      ctx.textAlign = 'center'
      ctx.fillText(data.name, x, y)
    }
  }

  const redraw = () => {
    context.clearRect(0, 0, 1600, 1600)
    draw(context, root)
  }

  function isInCircle(node, mx, my) {
    const { children, data, x, y, r } = node
    if (children) {
      children.find((v) => isInCircle(v, mx, my))
    } else if ((mx - x) * (mx - x) + (my - y) * (my - y) < r * r) {
      redraw()
      draw(context, node, { fillStyle: 'rgba(255,0,0,0.2)' })
      return data
    }
  }

  function bindMouseEvent() {
    canvas.onmousemove = (e) => {
      let { x, y } = e
      //! 注意画布宽高、样式宽高的比例
      x = x * 2
      y = y * 2
      const current = isInCircle(root, x, y)
      if (current) {
        console.log('In Circle', current)
      }
    }
  }

  draw2(context, root)
  bindMouseEvent()
})()
