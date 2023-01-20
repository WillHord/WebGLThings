// All the code required to set up webGL Canvas and Variables

let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;
let u_NormalMatrix;
let a_Normal;
let u_lightPos;
let u_cameraPos;
let u_lightOn;
let u_lightColor;
let u_spotlightPos;
let u_spotlightDirection;
let u_spotlightCutoff;
let u_spotlightOn;

function logGLCall(functionName, args) {   
    console.log("gl." + functionName + "(" + 
       WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");   
} 

function throwOnGLError(err, funcName, args) {
    throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
};

function logAndValidate(functionName, args) {
    logGLCall(functionName, args);
    validateNoneOfTheArgsAreUndefined (functionName, args);
}

function setupWebGL() {
	// Retrieve <canvas> element
	canvas = document.getElementById("webgl");

	// Get the rendering context for WebGL
	// gl = getWebGLContext(canvas, {preserveDrawingBuffer: true});
    gl = getWebGLContext(canvas, false);
    // gl = WebGLDebugUtils.makeDebugContext(gl, undefined, logAndValidate);
	if (!gl) {
		console.log("Failed to get the rendering context for WebGL");
		return;
	}

  gl.enable(gl.DEPTH_TEST);
}


function connectVariablesToGLSL() {
    // Initialize shaders
      if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
          console.log("Failed to initialize shaders.");
          return;
      }
  
      // // Get the storage location of a_Position
      a_Position = gl.getAttribLocation(gl.program, "a_Position");
      if (a_Position < 0) {
          console.log("Failed to get the storage location of a_Position");
          return;
      }
  
      // Get the storage location of u_FragColor
    // u_FragColor = gl.getAttribLocation(gl.program, "a_vertexColor");
    u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
    if (!u_FragColor) {
      console.log("Failed to get the storage location of a_vertexColor");
      return;
    }
  
    // u_FragColor = a_vertexColor;
  
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
      console.log('Failed to get the storage location of u_ModelMatrix');
      return;
    }
  
    // u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    // if (!u_GlobalRotateMatrix) {
    //   console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    //   // return;
    // }
  
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
      console.log('Failed to get the storage location of a_UV');
      return;
    }
  
    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
      console.log('Failed to get the storage location of u_ProjectionMatrix');
      return;
    }
  
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
      console.log('Failed to get the storage location of u_ViewMatrix');
      return;
    }
  
    // Get the storage location of u_Sampler0
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
      console.log('Failed to get the storage location of u_Sampler0');
      return;
    }
  
    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
      console.log('Failed to get the storage location of u_Sampler1');
      return;
    }
  
    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
      console.log('Failed to get the storage location of u_whichTexture');
      return;
    }

    u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
    if (!u_lightPos) {
        console.log('Failed to get the storage location of u_lightPos');
        return;
    }

    u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if (!u_NormalMatrix) {
        console.log('Failed to get the storage location of u_NormalMatrix');
        // return;
    }

    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
        console.log('Failed to get the storage location of a_Normal');
        return;
    }

    u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
    if (!u_cameraPos) {
        console.log('Failed to get the storage location of u_cameraPos');
        return;
    }

    u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
    if (!u_lightOn) {
        console.log('Failed to get the storage location of u_lightOn');
        return;
    }

    u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
    if (!u_lightColor) {
        console.log('Failed to get the storage location of u_lightColor');
        return;
    }

    u_spotlightPos = gl.getUniformLocation(gl.program, 'u_spotlightPos');
    if (!u_spotlightPos) {
        console.log('Failed to get the storage location of u_spotlightPos');
        return;
    }

    u_spotlightCutoff = gl.getUniformLocation(gl.program, 'u_spotlightCutoff');
    if (!u_spotlightCutoff) {
        console.log('Failed to get the storage location of u_spotlightCutoff');
        return;
    }

    u_spotlightDirection = gl.getUniformLocation(gl.program, 'u_spotlightDirection');
    if (!u_spotlightDirection) {
        console.log('Failed to get the storage location of u_spotlightDirection');
        return;
    }

    u_spotlightOn = gl.getUniformLocation(gl.program, 'u_spotlightOn');
    if (!u_spotlightOn) {
        console.log('Failed to get the storage location of u_spotlightOn');
        return;
    }
  
    let identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  }
