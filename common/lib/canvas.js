export class Polygon {
  constructor(ctx, points, options) {
    this.draw(ctx, points, options)
  }

  draw(context, points, { fillStyle = 'black', close = false, rule = 'nonzero' } = {}) {
    context.beginPath()
    context.moveTo(...points[0])
    for (let i = 1; i < points.length; i++) {
      context.lineTo(...points[i])
    }
    if (close) context.closePath()
    context.fillStyle = fillStyle
    context.fill(rule)
  }
}
