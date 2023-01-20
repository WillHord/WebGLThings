var VSHADER_SOURCE = `
  precision mediump float;
  // attribute vec4 a_vertexColor;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  attribute vec4 a_FragColor;

  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  // varying vec4 u_FragColor;

  uniform mat4 u_ModelMatrix;
  // uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_NormalMatrix;
  

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    // u_FragColor = a_vertexColor;

    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
    // v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }
`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  // varying vec4 u_FragColor;
  varying vec4 v_VertPos;
  varying vec3 v_Normal;

  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform vec4 u_FragColor;
  uniform vec3 u_lightColor;

  uniform vec3 u_spotlightPos;
  uniform vec3 u_spotlightDirection;
  uniform float u_spotlightCutoff;
  
  uniform int u_whichTexture;
  uniform bool u_lightOn;
  uniform bool u_spotlightOn;

  void main() {
    if (u_whichTexture == -3){ 
      gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0);
    } else if(u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else {
      gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);
    }

    vec3 lightVector = u_lightPos-vec3(v_VertPos);

    // float r=length(lightVector);
    // if(r < 1.0){
    //   gl_FragColor = vec4(1,0,0,1);
    // } else if(r < 2.0){
    //   gl_FragColor = vec4(1,1,0,1);
    // }

    // Spotlight
    vec3 spotlightVector = u_spotlightPos-vec3(v_VertPos);
    vec3 S = normalize(spotlightVector);
    
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);

    float nDotL = max(dot(N,L), 0.0);
    float nDotS = max(dot(N,S), 0.0);
    float spotlightdir = dot(S, u_spotlightDirection);
    
    
    vec3 R = reflect(-L, N);
    vec3 SR = reflect(-S, N);

    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    float specular = pow(max(dot(E,R), 0.0), 64.0) * 0.7;

    float spotlightSpec = pow(max(dot(E,SR), 0.0), 64.0) * 1.0;
    vec3 spotlightDiff = vec3(gl_FragColor) * nDotS * 1.0;
    vec3 spotlightAmb = vec3(gl_FragColor) * 1.0;

    vec3 diffuse = u_lightColor * vec3(gl_FragColor) * nDotL * 1.0;
    vec3 ambient = vec3(gl_FragColor) * 0.4;
    
    if(u_lightOn){
      if(u_whichTexture == 0){
        gl_FragColor = vec4(diffuse + ambient, 1.0);
      } else {
        gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
      }
      if(spotlightdir <= u_spotlightCutoff && u_spotlightOn){
        gl_FragColor = vec4(spotlightSpec + spotlightDiff + spotlightAmb + specular, 1.0);
      }
    }
  }
`
