/**
 * 1. Tess2 如何使用
 * 2. 三角剖分有一个不是三角形
 * 3. 
 */
import {earcut} from '../common/lib/earcut.js';
import { $, $$ } from '../common/lib/utils.js'
import { Vector2D } from '../common/lib/vector2d.js'

// 凸多边形 - 定点
const vertices = [
  [-0.7, 0.5],
  [-0.4, 0.3],
  [-0.25, 0.71],
  [-0.1, 0.56],
  [-0.1, 0.13],
  [0.4, 0.21],
  [0, -0.6],
  [-0.3, -0.3],
  [-0.6, -0.3],
  [-0.45, 0.0],
];
const ConcavePolygon = vertices.map(([x, y]) => [x * 256, y * 256]);

// 正五边形
const RegularPentagon = [new Vector2D(0, 100)];
for(let i = 1; i <= 4; i++) {
  const p = RegularPentagon[0].copy().rotate(i * Math.PI * 0.4);
  RegularPentagon.push(p);
}

// 星星
const star = [
  RegularPentagon[0],
  RegularPentagon[2],
  RegularPentagon[4],
  RegularPentagon[1],
  RegularPentagon[3],
]

// 圆（第一象限）
const quarterCircle = [new Vector2D(100, 0)]
for (let angle = 10; angle <= 90; angle += 10) {
  const t = angle / 180 * Math.PI
  quarterCircle.push(quarterCircle[0].copy().rotate(t))
}

// 假圆（40个折线）
const circle = []
for (let i = 0; i <= 3; i++) {
  circle.push(...quarterCircle.map(p => p.copy().rotate(Math.PI / 2 * i)))
}

// 菱形星星
const translation = [
  [-100, -100],
  [100, -100],
  [100, 100],
  [-100, 100]
]
const sparkles = []
for (let i = 0; i <= 3; i++) {
  sparkles.push(...quarterCircle.map(p => p.copy().rotate(Math.PI / 2 * i).translate(translation[i])))
}

// 椭圆（极坐标法）
const a = 200, b = 100
const TAU_SEGMENTS = 60;
const TAU = Math.PI * 2;
function ellipse(x0, y0, radiusX, radiusY, startAng = 0, endAng = Math.PI * 2) {
  const ang = Math.min(TAU, endAng - startAng);
  const ret = ang === TAU ? [] : [[x0, y0]];
  const segments = Math.round(TAU_SEGMENTS * ang / TAU);
  for(let i = 0; i <= segments; i++) {
    const x = x0 + radiusX * Math.cos(startAng + ang * i / segments);
    const y = y0 + radiusY * Math.sin(startAng + ang * i / segments);
    ret.push([x, y]);
  }
  return ret;
}
const ellipsePoints = ellipse(0, 0, a, b)

// 椭圆（圆拉伸法）
const ellipsePoints1 = [new Vector2D(a, 0)]
for (let angle = 1; angle < 360; angle += 5) {
  const t = angle / 180 * Math.PI
  ellipsePoints1.push(ellipsePoints1[0].copy().rotate(t))
}
ellipsePoints1.forEach((x, i) => x.x = x.x / a * b)

// 抛物线
const LINE_SEGMENTS = 60;
function parabola(x0, y0, p, min, max) {
  const ret = [];
  for(let i = 0; i <= LINE_SEGMENTS; i++) {
    const s = i / 60;
    const t = min * (1 - s) + max * s;
    const x = x0 + 2 * p * t ** 2;
    const y = y0 + 2 * p * t;
    ret.push(new Vector2D(x, y).rotate(Math.PI / -2));
  }
  return ret;
}

const parabolaPoints = parabola(0, 0, 6.5, -5, 5)

function initCoordinates(ctx) {
  ctx.beginPath()
  ctx.strokeStyle = '#666'
  ctx.moveTo(0, 256)
  ctx.lineTo(0, -256)
  ctx.moveTo(-256, 0)
  ctx.lineTo(256, 0)
  ctx.stroke()
  ctx.closePath()
}

function draw(points, strokeStyle = 'black', fillStyle = null) {
  ctx.strokeStyle = strokeStyle;
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for(let i = 1; i < points.length; i++) {
    ctx.lineTo(...points[i]);
  }
  ctx.closePath();
  if(fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill('evenodd');
  }
  ctx.stroke();
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const { width, height } = canvas;

ctx.translate(0.5 * width, 0.5 * height);
ctx.scale(1, -1);

initCoordinates(ctx)

const buttons = [
  { title: '正五边形', points: RegularPentagon },
  { title: '复杂多边形 - 星星', points: star },
  { title: 'nonezero星星', points: star, fillStyle: 'red' },
  { title: '凸多边形', points: ConcavePolygon },
  { title: '¼圆（第一象限）', points: quarterCircle },
  { title: '假圆（40个折线）', points: circle },
  { title: '菱形星星✦', points: sparkles, fillStyle: 'yellow' },
  { title: '椭圆（极坐标法）', points: ellipsePoints },
  { title: '椭圆（圆拉伸法）', points: ellipsePoints1 },
  { title: '抛物线', points: parabolaPoints },
]

buttons.map(b => {
  const $button = document.createElement('button')
  $button.innerHTML = b.title
  $button.onclick = e => {
    ctx.clearRect(-256, -256, 512, 512)
    
    initCoordinates(ctx)
    console.log(b.points)
    draw(b.points, 'black', b.fillStyle)
  }
  $('.buttons').appendChild($button)
})
