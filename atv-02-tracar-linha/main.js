function main(){
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
  
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    canvas.addEventListener("mousedown",mouseClick,false);
    
    let points = [];

    function mouseClick(event){
      if (points.length === 2)
        points = [];

      console.log(event.offsetX,event.offsetY);
      let x = (2/canvas.width * event.offsetX) - 1;
      let y = (-2/canvas.height * event.offsetY) + 1;
      points.push([x, y]);
      //drawLine();
      bresenham(points[0], points[1]);

    }
  
    const bodyElement = document.querySelector("body");
    bodyElement.addEventListener("keydown",keyDown,false);

    let colorVector = [0.0,0.0,0.0];
    function keyDown(event){
      switch(event.key){
        case "0":
          colorVector = [0.0,0.0,0.0];
          break;
        case "1":
          colorVector = [1.0,0.0,0.0];
          break;
        case "2":
          colorVector = [0.0,1.0,0.0];
          break;
        case "3":
          colorVector = [0.0,0.0,1.0];
          break;
        case "4":
          colorVector = [1.0,1.0,0.0];
          break;
        case "5":
          colorVector = [0.0,1.0,1.0];
          break;
        case "6":
          colorVector = [1.0,0.0,1.0];
          break;
        case "7":
          colorVector = [1.0,0.5,0.5];
          break;
        case "8":
          colorVector = [0.5,1.0,0.5];
          break;
        case "9":
          colorVector = [0.5,0.5,1.0];
          break;
      }
  
      //drawLine();
      bresenham(points[0], points[1]);
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

    function bresenham([x1, y1], [x2, y2]) {
      if (points.length < 2) return;

      // Limpar a tela antes de desenhar uma nova linha
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Converter para coordenadas de pixel
      x1 = Math.round(x1 * canvas.width / 2 + canvas.width / 2);
      y1 = Math.round(y1 * canvas.height / 2 + canvas.height / 2);
      x2 = Math.round(x2 * canvas.width / 2 + canvas.width / 2);
      y2 = Math.round(y2 * canvas.height / 2 + canvas.height / 2);

      // Garantir que o ponto inicial esteja à esquerda do ponto final
      if (x1 > x2) {
        [x1, y1, x2, y2] = [x2, y2, x1, y1];
      }

      const dx = x2 - x1;
      const dy = Math.abs(y2 - y1);
      const sx = 1; // Sempre incrementamos `x` da esquerda para a direita
      const sy = y1 < y2 ? 1 : -1; // Incremento de `y` depende da posição relativa

      let err = dx / 2;
      let x = x1;
      let y = y1;

      while (x <= x2) {
        // Converter de volta para o espaço de coordenadas WebGL
        const xGL = (x / (canvas.width / 2)) - 1;
        const yGL = (y / (canvas.height / 2)) - 1;

        // Renderizar o ponto
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

    
    
    function drawPoints(){
        //gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, 1);
    }

    //drawLine();
    bresenham(points[0], points[1]);

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