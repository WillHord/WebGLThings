// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }
`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }
`

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2

// Global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;

// UI gloabl variables
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_segments = 10;

function addActionsForHtmlUI(){
  // Sliders for color
  document.getElementById('red').addEventListener('mouseup', function(){g_selectedColor[0] = this.value/100;})
  document.getElementById('green').addEventListener('mouseup', function(){g_selectedColor[1] = this.value/100;})
  document.getElementById('blue').addEventListener('mouseup', function(){g_selectedColor[2] = this.value/100;})
  console.log(g_selectedColor);

  // Slider for shape size
  document.getElementById('size').addEventListener('mouseup', function(){g_selectedSize = this.value;})

  // Clear button
  document.getElementById('clear').addEventListener('click', function(){g_shapesList = []; renderAllShapes();})

  // Shape buttons
  document.getElementById('triangle').addEventListener('click', function(){g_selectedType = TRIANGLE;})
  document.getElementById('square').addEventListener('click', function(){g_selectedType = POINT;})
  document.getElementById('circle').addEventListener('click', function(){g_selectedType = CIRCLE;})

  document.getElementById('image').addEventListener('click', function(){drawImage();})

  document.getElementById('awesomeness').addEventListener('click', function(){awesomeness();})

  // Slider for segments
  document.getElementById('segments').addEventListener('mouseup', function(){g_segments = this.value;})
}

function setupWebGL() {
	// Retrieve <canvas> element
	canvas = document.getElementById("webgl");

	// Get the rendering context for WebGL
	gl = getWebGLContext(canvas, {preserveDrawingBuffer: true});
	if (!gl) {
		console.log("Failed to get the rendering context for WebGL");
		return;
	}
}

function connectVariablesToGLSL() {
  // Initialize shaders
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log("Failed to intialize shaders.");
		return;
	}

	// // Get the storage location of a_Position
	a_Position = gl.getAttribLocation(gl.program, "a_Position");
	if (a_Position < 0) {
		console.log("Failed to get the storage location of a_Position");
		return;
	}

	// Get the storage location of u_FragColor
	u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
	if (!u_FragColor) {
		console.log("Failed to get the storage location of u_FragColor");
		return;
	}

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, "u_Size");
  if (!u_Size) {
    console.log("Failed to get the storage location of u_Size");
    return;
  }
}

function main() {
  // Set up canvas and gl variables
	setupWebGL();
  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // getValues();
  addActionsForHtmlUI();

	// Register function (event handler) to be called on a mouse press
	canvas.onmousedown = click;
  canvas.onmousemove = function(ev){if(ev.buttons == 1){click(ev)}};

	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);
}


var g_shapesList = [];

function click(ev) {
  // Convert the mouse coordinates to WebGL coordinates
  let [x,y] = convertCoordinatesEventToGL(ev);

  
  let point;
  if(g_selectedType == POINT){
    point = new Point();
  }
  else if(g_selectedType == TRIANGLE){
    point = new Triangle();
  } else if(g_selectedType == CIRCLE){
    point = new Circle();
    point.segments = g_segments;
  }
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

  renderAllShapes();
}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
	var y = ev.clientY; // y coordinate of a mouse pointer
	var rect = ev.target.getBoundingClientRect();

	x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
	y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return([x,y]);
}

function renderAllShapes(){

  // Check the time at the start of this function
  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for (var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + duration.toFixed(2) + " fps: " + Math.floor(10000/duration), "numdot");
}

function sendTextToHTML(text, id){
  var htmlElm = document.getElementById(id);
  if(!htmlElm){
    console.log("Error: could not find HTML element with id: " + id);
    return;
  }
  htmlElm.innerHTML = text;
}
