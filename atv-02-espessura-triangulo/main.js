function main() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

  if (!gl) {
      throw new Error('WebGL not supported');
  }

  var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  var program = createProgram(gl, vertexShader, fragmentShader);

  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();
  const colorBuffer = gl.createBuffer();

  const positionLocation = gl.getAttribLocation(program, `position`);
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const colorLocation = gl.getAttribLocation(program, `color`);
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

  let pointsSize = 5.0;
  const pointSizeLocation = gl.getUniformLocation(program, 'pointSize');
  gl.uniform1f(pointSizeLocation, pointsSize);

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  canvas.addEventListener("mousedown", mouseClick, false);

  let points = [];
  let shapeMode = 0; // 0 para linhas, 1 para triângulos
  let mode = 'color'; // Inicialmente em modo cor

  function mouseClick(event) {
      if (points.length === 2 + shapeMode) points = [];

      let x = (2 / canvas.width * event.offsetX) - 1;
      let y = (-2 / canvas.height * event.offsetY) + 1;
      points.push([x, y]);
      drawShapes();
  }

  const bodyElement = document.querySelector("body");
  bodyElement.addEventListener("keydown", keyDown, false);

  let colorVector = [0.0, 0.0, 0.0];
  function keyDown(event) {
      switch (event.key) {
          case "0":
              if (mode === 'color') colorVector = [0.0, 0.0, 0.0];
              else pointsSize = 2.0;
              break;
          case "1":
              if (mode === 'color') colorVector = [1.0, 0.0, 0.0];
              else pointsSize = 3.0;
              break;
          case "2":
              if (mode === 'color') colorVector = [0.0, 1.0, 0.0];
              else pointsSize = 4.0;
              break;
          case "3":
              if (mode === 'color') colorVector = [0.0, 0.0, 1.0];
              else pointsSize = 5.0;
              break;
          case "4":
              if (mode === 'color') colorVector = [1.0, 1.0, 0.0];
              else pointsSize = 6.0;
              break;
          case "5":
              if (mode === 'color') colorVector = [0.0, 1.0, 1.0];
              else pointsSize = 7.0;
              break;
          case "6":
              if (mode === 'color') colorVector = [1.0, 0.0, 1.0];
              else pointsSize = 8.0;
              break;
          case "7":
              if (mode === 'color') colorVector = [1.0, 0.5, 0.5];
              else pointsSize = 9.0;
              break;
          case "8":
              if (mode === 'color') colorVector = [0.5, 1.0, 0.5];
              else pointsSize = 10.0;
              break;
          case "9":
              if (mode === 'color') colorVector = [0.5, 0.5, 1.0];
              else pointsSize = 11.0;
              break;
          case "r":
          case "R":
              gl.clear(gl.COLOR_BUFFER_BIT);
              points = [];
              shapeMode = 0;
              break;
          case "t":
          case "T":
              gl.clear(gl.COLOR_BUFFER_BIT);
              points = [];
              shapeMode = 1;
              break;
          case "k":
          case "K":
              mode = 'color';
              break;
          case "e":
          case "E":
              mode = 'thickness';
              break;
      }

      // Atualiza a espessura dos pontos
      gl.uniform1f(pointSizeLocation, pointsSize);
      drawShapes();
  }

  function drawLine() {
      if (points.length < 2) return;

      gl.clear(gl.COLOR_BUFFER_BIT);

      const [p1, p2] = points;
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...p1, ...p2]), gl.STATIC_DRAW);

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...colorVector, ...colorVector]), gl.STATIC_DRAW);

      gl.drawArrays(gl.LINES, 0, 2);
  }

  function drawShapes() {
      if (shapeMode === 1) {
          setTriangle(points);
      } else {
          gl.clear(gl.COLOR_BUFFER_BIT);
          bresenham(points[0], points[1]);
      }
  }

  function setTriangle(points) {
      if (points.length < 3) return;

      gl.clear(gl.COLOR_BUFFER_BIT);
      bresenham(points[0], points[1]);
      bresenham(points[2], points[1]);
      bresenham(points[2], points[0]);
  }

  function bresenham([x1, y1], [x2, y2]) {
      x1 = Math.round(x1 * canvas.width / 2 + canvas.width / 2);
      y1 = Math.round(y1 * canvas.height / 2 + canvas.height / 2);
      x2 = Math.round(x2 * canvas.width / 2 + canvas.width / 2);
      y2 = Math.round(y2 * canvas.height / 2 + canvas.height / 2);

      if (x1 > x2) {
          [x1, y1, x2, y2] = [x2, y2, x1, y1];
      }

      const dx = x2 - x1;
      const dy = Math.abs(y2 - y1);
      const sx = 1;
      const sy = y1 < y2 ? 1 : -1;

      let err = dx / 2;
      let x = x1;
      let y = y1;

      while (x <= x2) {
          const xGL = (x / (canvas.width / 2)) - 1;
          const yGL = (y / (canvas.height / 2)) - 1;

          gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([xGL, yGL]), gl.STATIC_DRAW);

          gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...colorVector]), gl.STATIC_DRAW);

          drawPoints();

          if (x === x2 && y === y2) break;

          const e2 = err;
          if (e2 > -dy) {
              err -= dy;
              x += sx;
          }
          if (e2 < dx) {
              err += dx;
              y += sy;
          }
      }
  }

  function drawPoints() {
      gl.drawArrays(gl.POINTS, 0, 1);
  }

  drawShapes();
}

  
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}
  
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}
  
main();