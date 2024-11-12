function main() {
  const canvas = document.querySelector("#c");
  const gl = canvas.getContext("webgl");

  if (!gl) {
    throw new Error("WebGL not supported");
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

  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  const n = 30;

  let time = 0;
  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    time += 0.05;
    const jump = Math.sin(time) * 0.05;

    // Animação dos cabelos
    const hairRadius = 0.15;
    const hairPositions = [
      [-0.35, 0.3], [-0.45, 0.1], [-0.4, -0.1], // Lado esquerdo
      [0.35, 0.3], [0.45, 0.1], [0.4, -0.1]     // Lado direito
    ];
    hairPositions.forEach(pos => {
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      setCircleVertices(gl, n, hairRadius, [pos[0], pos[1] + jump]);
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      setCircleColor(gl, n, [Math.random(), Math.random(), Math.random()]);
      gl.drawArrays(gl.TRIANGLES, 0, 3 * n);
    });

    // Cabeça do palhaço
    const faceCenter = [0.0, 0.0 + jump];
    const faceRadius = 0.4;
    const skinColor = [1.0, 0.8, 0.6];
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n, faceRadius, faceCenter);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, skinColor);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);

    // Boca do palhaço (semicírculo)
    const mouthCenter = [0.0, -0.15 + jump];
    const mouthRadius = 0.2;
    const mouthColor = [1.0, 0.0, 0.0];
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setSemiCircleVertices(gl, n, mouthRadius, mouthCenter, Math.PI);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n / 2, mouthColor);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n / 2);

    // Nariz do palhaço
    const noseCenter = [0.0, 0.05 + jump];
    const noseRadius = 0.13;
    const noseColor = [1.0, 0.0, 0.0];
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n, noseRadius, noseCenter);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, noseColor);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);

    // Olhos do palhaço
    const eyeRadius = 0.07;
    const eyeColor = [0.0, 0.0, 0.0];
    const leftEyeCenter = [-0.15, 0.2 + jump];
    const rightEyeCenter = [0.15, 0.2 + jump];
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n, eyeRadius, leftEyeCenter);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, eyeColor);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n, eyeRadius, rightEyeCenter);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, eyeColor);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
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

function setCircleVertices(gl, n, radius, center) {
  let vertexData = [];
  for (let i = 0; i < n; i++) {
      vertexData.push(...center);
      vertexData.push(center[0] + radius * Math.cos(i * (2 * Math.PI) / n), center[1] + radius * Math.sin(i * (2 * Math.PI) / n));
      vertexData.push(center[0] + radius * Math.cos((i + 1) * (2 * Math.PI) / n), center[1] + radius * Math.sin((i + 1) * (2 * Math.PI) / n));
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
}

function setSemiCircleVertices(gl, n, radius, center, angleOffset) {
  let vertexData = [];
  for (let i = 0; i < n / 2; i++) {
      vertexData.push(...center);
      vertexData.push(center[0] + radius * Math.cos(i * (Math.PI) / (n / 2) + angleOffset), center[1] + radius * Math.sin(i * (Math.PI) / (n / 2) + angleOffset));
      vertexData.push(center[0] + radius * Math.cos((i + 1) * (Math.PI) / (n / 2) + angleOffset), center[1] + radius * Math.sin((i + 1) * (Math.PI) / (n / 2) + angleOffset));
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
}

function setCircleColor(gl, n, color) {
  let colorData = [];
  for (let triangle = 0; triangle < n; triangle++) {
      for (let vertex = 0; vertex < 3; vertex++) {
          colorData.push(...color);
      }
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
}

main();
