import { Vector2D } from '../common/lib/vector2d.js'
import { earcut } from '../common/lib/earcut.js'

const canvas = document.querySelector('canvas')
const gl = canvas.getContext('webgl')

// 1、创建 webGL 程序
const vertex = `
        #define PI 3.1415926535897932384626433832795
        attribute vec2 position;
        varying vec4 color;

        vec3 rgb2hsv(vec3 c){
          vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
          vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
          vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
          float d = q.x - min(q.w, q.y);
          float e = 1.0e-10;
          return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }
        
        vec3 hsv2rgb(vec3 c){
          vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
          rgb = rgb * rgb * (3.0 - 2.0 * rgb);
          return c.z * mix(vec3(1.0), rgb, c.y);
        }

        void main() {
          // 两个圆的圆心分别在 (-0.5, 0), (0.5, 0), 将其转到(0, 0)方便计算
          float x = position.x > 0.0 ? position.x - 0.5 : position.x + 0.5;
          float y = position.y;
        
          float hue = atan(y, x);
          if (0.0 > hue) {
            hue = PI * 2.0 + hue;
          }
        
          hue /= 2.0 * PI;
        
          float len = sqrt(x * x + y * y);
          // 判断是哪一个圆, 使用不同的颜色
          vec3 hsv = position.x > 0.0 ? vec3(hue, len, 1.0) : vec3(hue, 1.0, len);
          vec3 rgb = hsv2rgb(hsv);
          gl_PointSize = 1.0;
          color = vec4(rgb, 1.0);
          gl_Position = vec4(position, 1.0, 1.0);
        }
      `

const fragment = `
        precision mediump float;
        varying vec4 color;

        void main()
        {
          gl_FragColor = color;
        }    
      `

function circle(x, y, r = 0.5) {
  const points = []
  for (let i = 0; i < 50; i++) {
    const angle = 2 * Math.PI / 50 * i
    points.push(

      r * Math.cos(angle) + x,
      r * Math.sin(angle) + y,
    )
  }
  return points
}

const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vertex)
gl.compileShader(vertexShader)

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader, fragment)
gl.compileShader(fragmentShader)

const program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)
gl.useProgram(program)



function draw(points) {
  const cells = new Uint16Array(earcut(points))
  points = new Float32Array(points)
  console.log(cells, points)
  const bufferId = gl.createBuffer()
  
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)

  const vPosition = gl.getAttribLocation(program, 'position')
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vPosition)

  const cellsBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cellsBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cells, gl.STATIC_DRAW)

  // gl.clear(gl.COLOR_BUFFER_BIT)
  // gl.drawArrays(gl.LINE_LOOP, 0, points.length / 2)
  gl.drawElements(gl.TRIANGLES, cells.length, gl.UNSIGNED_SHORT, 0)
}

const circle1 = circle(-0.5, 0)
const circle2 = circle(0.5, -0)

draw(circle1)
draw(circle2)

