function main() {
  const canvas = document.querySelector("#c");
  const gl = canvas.getContext('webgl');

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

  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // Configurações de animação
  let carPosition = 0;
  let wheelRotation = 0;
  let speed = 0.01;
  let carTilt = 0;

  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    carPosition += speed;
    if (Math.abs(carPosition) > 0.8) {
      speed = -speed;
    }

    carTilt = Math.sin(carPosition * Math.PI) * 0.05;
    wheelRotation += speed * 10;  // Ajuste a rotação das rodas

    // Desenha o carro com uma leve inclinação
    drawCar(gl, positionBuffer, colorBuffer, carPosition, carTilt, wheelRotation);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

function drawCar(gl, positionBuffer, colorBuffer, carPosition, carTilt, wheelRotation) {
  const carColor = [0.2, 0.6, 0.9];
  const windowColor = [0.6, 1.0, 0.8];
  const black = [0.0, 0.0, 0.0];
  const grey = [0.75, 0.75, 0.75];
  const n = 30;

  // Corpo principal do carro
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setRectangleVertices(gl, [-0.9 + carPosition, -0.2 + carTilt], [0.8 + carPosition, -0.2 + carTilt], [-0.7 + carPosition, 0.15 + carTilt], [0.9 + carPosition, 0.15 + carTilt]);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setRectangleColor(gl, carColor);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setRectangleVertices(gl, [-0.4 + carPosition, 0.15 + carTilt], [0.65 + carPosition, 0.15 + carTilt], [-0.2 + carPosition, 0.45 + carTilt], [0.6 + carPosition, 0.45 + carTilt]);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setRectangleColor(gl, carColor);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // Janela do carro
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setRectangleVertices(gl, [-0.35 + carPosition, 0.15 + carTilt], [0.1 + carPosition, 0.15 + carTilt], [-0.17 + carPosition, 0.42 + carTilt], [0.1 + carPosition, 0.42 + carTilt]);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setRectangleColor(gl, windowColor);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setRectangleVertices(gl, [0.15 + carPosition, 0.15 + carTilt], [0.6 + carPosition, 0.15 + carTilt], [0.15 + carPosition, 0.42 + carTilt], [0.56 + carPosition, 0.42 + carTilt]);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setRectangleColor(gl, windowColor);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // Rodas do carro com rotação
  drawWheel(gl, positionBuffer, colorBuffer, -0.5 + carPosition, -0.2 + carTilt, 0.2, n, wheelRotation, black, grey);
  drawWheel(gl, positionBuffer, colorBuffer, 0.5 + carPosition, -0.2 + carTilt, 0.2, n, wheelRotation, black, grey);
}

function drawWheel(gl, positionBuffer, colorBuffer, cx, cy, radius, segments, rotation, outerColor, innerColor) {
  // Roda exterior
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setCircleVertices(gl, segments, radius, [cx, cy], rotation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setCircleColor(gl, segments, outerColor);
  gl.drawArrays(gl.TRIANGLES, 0, 3 * segments);

  // Roda interior
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setCircleVertices(gl, segments, radius * 0.75, [cx, cy], rotation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setCircleColor(gl, segments, innerColor);
  gl.drawArrays(gl.TRIANGLES, 0, 3 * segments);
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
  
  function setRectangleColor(gl,color) {
    colorData = [];
    for (let triangle = 0; triangle < 2; triangle++) {
      for(let vertex=0; vertex<3; vertex++)
        colorData.push(...color);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
  }

  function setCircleVertices(gl,n,radius,center){
    let vertexData = [];
    for(let i=0;i<n;i++){
      vertexData.push(...center);
      vertexData.push(...[center[0]+radius*Math.cos(i*(2*Math.PI)/n),center[1]+radius*Math.sin(i*(2*Math.PI)/n)]);
      vertexData.push(...[center[0]+radius*Math.cos((i+1)*(2*Math.PI)/n),center[1]+radius*Math.sin((i+1)*(2*Math.PI)/n)]);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
  }
  
  function setCircleColor(gl,n,color){
    colorData = [];
    for (let triangle = 0; triangle < n; triangle++) {
      for(let vertex=0; vertex<3; vertex++)
        colorData.push(...color);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
  }

  main();