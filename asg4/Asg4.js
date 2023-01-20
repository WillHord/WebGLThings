// Global variables
let canvas;
let gl;

let g_animation = true;
let g_specialAnimation = false;
let g_specialAnimationStartTime = null;

let g_lightOn = true;
let g_lightColor = [1.0, 1.0, 1.0];
let g_lightAnimation = true;
let g_lightPos = [0,1,-2]
let g_spotlightPos = [5,5,0];
let g_spotlightRotX = 0;
let g_spotlightRotY = 0;
let g_spotlightOn = true;

let g_camera = null;
let g_light = null;
let g_spotlight = null;

// Keys
let g_key_d = false;
let g_key_a = false;
let g_key_w = false;
let g_key_s = false;
let g_key_q = false;
let g_key_e = false;
let g_key_shift = false;
let g_key_space = false;

let g_gravity = false;


// Global joint angles
let g_jumpHeight = 0;

let backRightLegJoint1 = 0;
let backRightLegJoint2 = 0;
let backRightLegJoint3 = 0;

let backLeftLegJoint1 = 0;
let backLeftLegJoint2 = 0;
let backLeftLegJoint3 = 0;

let frontRightLegJoint1 = 0;
let frontRightLegJoint2 = 0;
let frontRightLegJoint3 = 0;

let frontLeftLegJoint1 = 0;
let frontLeftLegJoint2 = 0;
let frontLeftLegJoint3 = 0;

let bodyJoint = 0;

let headJoint = 0;
let upperLipJoint = 0;
let lowerLipJoint = 0;

let normalOn = false;

function addActionsForHtmlUI(){
  // document.getElementById("gravityOn").onclick = function(){g_gravity = true;};
  // document.getElementById("gravityOff").onclick = function(){g_gravity = false;};

  // Normals buttons
  document.getElementById("normalsOn").onclick = function(){normalOn = true;};
  document.getElementById("normalsOff").onclick = function(){normalOn = false;};

  // Light sliders
  document.getElementById("LightX").onmousemove = function(ev){if(ev.buttons==1){g_lightPos[0] = this.value/100;}};
  document.getElementById("LightY").onmousemove = function(ev){if(ev.buttons==1){g_lightPos[1] = this.value/100;}};
  document.getElementById("LightZ").onmousemove = function(ev){if(ev.buttons==1){g_lightPos[2] = this.value/100;}};

  // Light Color sliders
  document.getElementById("Red").onmousemove = function(ev){if(ev.buttons==1){g_lightColor[0] = this.value;}};
  document.getElementById("Green").onmousemove = function(ev){if(ev.buttons==1){g_lightColor[1] = this.value;}};
  document.getElementById("Blue").onmousemove = function(ev){if(ev.buttons==1){g_lightColor[2] = this.value;}};

  // Light toggle
  document.getElementById("LightToggle").onclick = function(){g_lightAnimation = !g_lightAnimation;};

  // Spotlight sliders
  document.getElementById("SpotX").onmousemove = function(ev){if(ev.buttons==1){g_spotlightRotX = this.value/180}};
  document.getElementById("SpotY").onmousemove = function(ev){if(ev.buttons==1){g_spotlightRotY = this.value/180}};

  // Spotlight toggle
  document.getElementById("SpotlightToggle").onclick = function(){g_spotlightOn = !g_spotlightOn;};

  // Main light toggle
  document.getElementById("MainLightToggle").onclick = function(){g_lightOn = !g_lightOn;};
}



let randX;
let randZ;

let g_model;

function main() {
  // Set up canvas and gl variables
	setupWebGL();
  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // getValues();
  addActionsForHtmlUI();

  g_camera = new Camera();
  g_light = new Cube();
  g_spotlight = new Cube();

  makeMaze();

  randX = Math.floor(Math.random() * 40)-20;
  randZ = Math.floor(Math.random() * 40)-20;

  canvas.onmousedown = function(ev){
    if(ev.buttons == 1){
      g_camera.mouseDown(ev);
    }
   };

  canvas.onmousemove = function(ev){
    if(ev.buttons == 1){
      g_camera.mouseMove(ev);
    }
  }

  document.onkeydown = function(ev) { keydown(ev); };
  document.onkeyup = function(ev) { keyUp(ev); };
  
  initTextures();
  
	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(tick);
}

var currentAngle = 0.0;

var g_startTime = performance.now()/1000;
var g_seconds = performance.now()/1000 - g_startTime;

// var g_pressTime = performance.now()/1000;

function tick(){
  g_camera.move();

  g_seconds = performance.now()/1000 - g_startTime;
  // console.log(g_seconds);

  updateAnimationAngles();
  renderAllShapes();

  requestAnimationFrame(tick);
}

function updateAnimationAngles(){
  if(g_lightAnimation) lightAnimation();
  if(g_animation){
    g_jumpHeight = (Math.max(5 * Math.sin(g_seconds), 0))

    backRightLegJoint1 = (Math.max(120*Math.sin(g_seconds), 0));
    backRightLegJoint2 = (Math.min(-90*Math.sin(g_seconds), 40));
    backRightLegJoint3 = (Math.max(45*Math.sin(g_seconds),0));

    backLeftLegJoint1 = (Math.max(120*Math.sin(g_seconds), 0));
    backLeftLegJoint2 = (Math.min(-90*Math.sin(g_seconds), 40));
    backLeftLegJoint3 = (Math.max(45*Math.sin(g_seconds), 0));

    frontRightLegJoint1 = (Math.max(-40* -Math.sin(g_seconds), 0));
    frontRightLegJoint2 = (Math.max(-90* -Math.sin(g_seconds), -40));
    frontRightLegJoint3 = (Math.max(45*Math.sin(g_seconds), 0));

    frontLeftLegJoint1 = (Math.max(-40* -Math.sin(g_seconds), 0));
    frontLeftLegJoint2 = (Math.max(-90* -Math.sin(g_seconds), -40));
    frontLeftLegJoint3 = (Math.max(45*Math.sin(g_seconds), 0));

    headJoint = (Math.max(45*Math.sin(g_seconds), 0));

    bodyJoint = (Math.min(-15*Math.sin(g_seconds), 0));
  }
  if(g_specialAnimation){
    if(g_specialAnimationStartTime == null){
      g_specialAnimationStartTime = g_seconds;
    }
    upperLipJoint = (5*Math.sin(g_seconds*4.5));
    lowerLipJoint = (-5*Math.sin(g_seconds*4.5));

    if(g_seconds > g_specialAnimationStartTime + 4){
      g_specialAnimation = false;
      g_specialAnimationStartTime = null;
    }
  }
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

  g_camera.update();
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projectionMatrix.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  renderScene();

  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + duration.toFixed(2) + " fps: " + Math.floor(10000/duration), "numdot");
}

function sendTextToHTML(text, id){
  var htmlElm = document.getElementById(id);
  if(!htmlElm){
    console.log("Error: could not find HTML element with id: " + id);
    return;
  }
  htmlElm.innerHTML = text;
}

let frog1 = null;
let world = null;

function renderScene(){
  if(!world){
    world = new World();
  }
  
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  
  gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);

  gl.uniform1f(u_spotlightCutoff, Math.cos((30 * 180)/Math.PI));
  gl.uniform3f(u_spotlightDirection, g_spotlightRotX, -1, g_spotlightRotY);
  gl.uniform3f(u_spotlightPos, g_spotlightPos[0], g_spotlightPos[1], g_spotlightPos[2]);
  
  gl.uniform1i(u_lightOn, g_lightOn);
  gl.uniform1i(u_spotlightOn, g_spotlightOn);
  
  gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);

  world.render();

  g_spotlight.color = [255, 255, 255, 1];
  g_spotlight.matrix.setTranslate(g_spotlightPos[0], g_spotlightPos[1], g_spotlightPos[2]);
  g_spotlight.matrix.scale(-0.5, -0.5, -0.5);
  g_spotlight.matrix.rotate(-g_spotlightRotX * 45, 0, 1, 0);
  g_spotlight.matrix.rotate(-g_spotlightRotY * 45, 1, 0, 0);
  g_spotlight.render();
  
  g_light.color = [g_lightColor[0]* 255, g_lightColor[1] * 255, g_lightColor[2] * 255, 1];
  g_light.matrix.setTranslate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  g_light.matrix.scale(-0.25, -0.25, -0.25);
  g_light.matrix.translate(-.5,-.5,-.5);
  g_light.textureNum = -2;
  g_light.isLight = true;
  g_light.render();
}

function lightAnimation(){
  var r = 5;
  var x = r * Math.cos(g_seconds);
  var y = r * Math.sin(g_seconds);
  var z = r * Math.max(Math.cos(g_seconds) + 1, 0);

  g_lightPos = [x, z, y];

  // Change slider values to match light position
  document.getElementById("LightX").value = x;
  document.getElementById("LightY").value = y;
  document.getElementById("LightZ").value = z;
}
