function main(){
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
  gl.clear(gl.COLOR_BUFFER_BIT);

  //retangulos do carro
  carColor = [Math.random(),Math.random(),Math.random()];
  windowColor = [0.6, 1.0, 0.8];

  gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
  setRectangleVertices(gl,[-0.9, -0.2], [0.8, -0.2], [-0.7, 0.15], [0.9, 0.15]);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setRectangleColor(gl,carColor);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
  setRectangleVertices(gl,[-0.4, 0.15], [0.65, 0.15], [-0.2, 0.45], [0.6, 0.45]);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setRectangleColor(gl,carColor);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
  setRectangleVertices(gl,[-0.35, 0.15], [0.1, 0.15], [-0.17, 0.42], [0.1, 0.42]);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setRectangleColor(gl,windowColor);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
  setRectangleVertices(gl,[0.15, 0.15], [0.6, 0.15], [0.15, 0.42], [0.56, 0.42]);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setRectangleColor(gl,windowColor);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  //circulos do carro
  n=30;
  black = [0.0, 0.0, 0.0];
  grey = [0.75, 0.75, 0.75];

  gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
  setCircleVertices(gl,n,0.2, [-0.5, -0.2]);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setCircleColor(gl,n,black);
  gl.drawArrays(gl.TRIANGLES, 0, 3*n);

  gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
  setCircleVertices(gl,n,0.2, [0.5, -0.2]);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setCircleColor(gl,n,black);
  gl.drawArrays(gl.TRIANGLES, 0, 3*n)
  
  gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
  setCircleVertices(gl,n,0.15, [-0.5, -0.2]);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setCircleColor(gl,n,grey);
  gl.drawArrays(gl.TRIANGLES, 0, 3*n)

  gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
  setCircleVertices(gl,n,0.15, [0.5, -0.2]);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setCircleColor(gl,n,grey);
  gl.drawArrays(gl.TRIANGLES, 0, 3*n)
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