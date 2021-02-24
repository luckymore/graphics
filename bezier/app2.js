import {parametric} from '../common/lib/parametric.js';
import {Vector2D} from '../common/lib/vector2d.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const {width, height} = canvas;
const w = 0.5 * width,
  h = 0.5 * height;
ctx.translate(w, h);
ctx.scale(1, -1);

function drawAxis() {
  ctx.save();
  ctx.strokeStyle = '#ccc';
  ctx.beginPath();
  ctx.moveTo(-w, 0);
  ctx.lineTo(w, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -h);
  ctx.lineTo(0, h);
  ctx.stroke();
  ctx.restore();
}

drawAxis();

const cubicBezier = parametric(
  (t, [{x: x0}, {x: x1}, {x: x2}, {x: x3}]) => (1 - t) ** 3 * x0 + 3 * t * (1 - t) ** 2 * x1 + 3 * (1 - t) * t ** 2 * x2 + t ** 3 * x3,
  (t, [{y: y0}, {y: y1}, {y: y2}, {y: y3}]) => (1 - t) ** 3 * y0 + 3 * t * (1 - t) ** 2 * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3 * y3,
);

const p0 = new Vector2D(0, 0);
const p1 = new Vector2D(100, 0);
p1.rotate(0.35);
const p2 = new Vector2D(150, 0);
p2.rotate(-0.63);
const p3 = new Vector2D(200, 0);
const count = 3;
for(let i = 0; i < count; i++) {
  p1.rotate(2 / count * Math.PI);
  p2.rotate(2 / count * Math.PI);
  p3.rotate(2 / count * Math.PI);
  cubicBezier(0, 1, 100, [
    p0,
    p1,
    p2,
    p3,
  ]).draw(ctx);
}
