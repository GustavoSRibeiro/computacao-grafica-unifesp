function main() {
  const canvas = document.querySelector("#c");
  const gl = canvas.getContext('webgl');

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
  const center = [0.0, 0.3];
  const flowerRadius = 0.3;
  const petalCount = 8;
  const petalDistance = 0.4;
  const petalRadius = 0.15;
  let angle = 0;
  let potVerticalSpeed = 0.003; // Velocidade do vaso
  let potPositionOffset = 0.0; // Offset vertical do vaso

  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Desenha o caule
    const green = [0.0, 1.0, 0.0];
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangleVertices(gl, [-0.05, -0.5], [0.05, -0.5], [-0.05, 0.1], [0.05, 0.1]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl, green);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Atualiza a posição do vaso para subir e descer
    potPositionOffset += potVerticalSpeed;
    if (potPositionOffset > 0.1 || potPositionOffset < -0.1) {
      potVerticalSpeed = -potVerticalSpeed; // Inverte a direção do movimento
    }

    // Desenha o vaso com offset vertical
    const potColor = [0.8, 0.5, 0.2];
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangleVertices(gl, [-0.2, -0.8 + potPositionOffset], [0.2, -0.8 + potPositionOffset], [-0.3, -0.4 + potPositionOffset], [0.3, -0.4 + potPositionOffset]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl, potColor);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    

    // Desenha as pétalas girando em torno do centro
    angle += 0.02; // Incrementa o ângulo para a rotação
    for (let i = 0; i < petalCount; i++) {
      const baseAngle = i * (2 * Math.PI / petalCount);
      const petalCenter = [
        center[0] + petalDistance * Math.cos(baseAngle + angle),
        center[1] + petalDistance * Math.sin(baseAngle + angle)
      ];

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      setCircleVertices(gl, n, petalRadius, petalCenter);
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      setCircleColor(gl, n, [1.0, 1.0, 0.0]);
      gl.drawArrays(gl.TRIANGLES, 0, 3 * n);
    }


    // Desenha o centro da flor
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n, flowerRadius, center);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, [0.4, 0.2, 0.0]);
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n);

    requestAnimationFrame(render); // Renderiza o próximo frame
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

function setRectangleVertices(gl, p1, p2, p3, p4) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     ...p1,
     ...p2,
     ...p3,
     ...p2, 
     ...p3,
     ...p4,
  ]), gl.STATIC_DRAW);
}

function setRectangleColor(gl, color) {
  let colorData = [];
  for (let triangle = 0; triangle < 2; triangle++) {
    for (let vertex = 0; vertex < 3; vertex++)
      colorData.push(...color);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
}

function setCircleVertices(gl, n, radius, center) {
  let vertexData = [];
  for (let i = 0; i < n; i++) {
      vertexData.push(...center);
      vertexData.push(...[center[0] + radius * Math.cos(i * (2 * Math.PI) / n), center[1] + radius * Math.sin(i * (2 * Math.PI) / n)]);
      vertexData.push(...[center[0] + radius * Math.cos((i + 1) * (2 * Math.PI) / n), center[1] + radius * Math.sin((i + 1) * (2 * Math.PI) / n)]);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
}

function setCircleColor(gl, n, color) {
  let colorData = [];
  for (let triangle = 0; triangle < n; triangle++) {
    for (let vertex = 0; vertex < 3; vertex++)
      colorData.push(...color);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
}

main();
