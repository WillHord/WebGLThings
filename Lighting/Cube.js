class Cube {
    constructor(){
        this.type = "cube";
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();
        this.textureNum = -2;
        
        this.isLight = false;

        this.rgba = null;

        this.vertices = null;
        this.uv = null;
        this.colors = null;
        this.normals = null;

        this.vertexBuffer = null;
        this.uvBuffer = null;
        this.colorBuffer = null;
        this.normalBuffer = null;

    }

    generateVertices(){
        this.vertices = new Float32Array([
            // Front
            0,0,0,  1,1,0,  1,0,0,
            0,0,0,  0,1,0,  1,1,0,
            // Top
            0,1,0,  1,1,1,  1,1,0,
            0,1,0,  0,1,1,  1,1,1,
            // Right
            1,0,0,  1,1,1,  1,0,1,
            1,0,0,  1,1,0,  1,1,1,
            // Left
            0,0,0,  0,1,1,  0,0,1,
            0,0,0,  0,1,0,  0,1,1,
            // Bottom
            0,0,0,  1,0,1,  1,0,0,
            0,0,0,  0,0,1,  1,0,1,
            // Back
            0,0,1,  1,1,1,  1,0,1,
            0,0,1,  0,1,1,  1,1,1
        ]);

        this.uv = new Float32Array([
            // Front
            0,0,  1,1,  1,0,
            0,0,  0,1,  1,1,
            // Top
            0,0,  1,1,  1,0,
            0,0,  0,1,  1,1,
            // Right
            0,0,  1,1,  1,0,
            0,0,  0,1,  1,1,
            // Left
            1,0,  0,1,  0,0,
            1,0,  1,1,  0,1,
            // Bottom
            0,1,  1,0,  1,1,
            0,1,  0,0,  1,0,
            // Back
            1,0,  0,1,  0,0,
            1,0,  1,1,  0,1
        ]);
        
        this.normals = new Float32Array([
            // Front
            0,0,-1,  0,0,-1,  0,0,-1,
            0,0,-1,  0,0,-1,  0,0,-1,
            // Top
            0,1,0,   0,1,0,   0,1,0,
            0,1,0,   0,1,0,   0,1,0,
            // Right
            1,0,0,   1,0,0,   1,0,0,
            1,0,0,   1,0,0,   1,0,0,
            // Left
            -1,0,0,  -1,0,0,  -1,0,0,
            -1,0,0,  -1,0,0,  -1,0,0,
            // Bottom
            0,-1,0,  0,-1,0,  0,-1,0,
            0,-1,0,  0,-1,0,  0,-1,0,
            // Back
            0,0,1,   0,0,1,   0,0,1,
            0,0,1,   0,0,1,   0,0,1
        ]);
    }

    render() {
        this.rgba = this.color;

        this.rgba[0] = this.rgba[0] / 255.0;
        this.rgba[1] = this.rgba[1] / 255.0;
        this.rgba[2] = this.rgba[2] / 255.0;

        if(normalOn){
            this.textureNum = -3;
        } 
        
        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        if(!this.isLight){
            this.normalMatrix.setInverseOf(this.matrix).transpose();
            gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
        }

        gl.uniform4f(u_FragColor, this.rgba[0], this.rgba[1], this.rgba[2], this.rgba[3]);

        if(this.vertices == null){
            this.generateVertices();
        }

        if(this.vertexBuffer == null){
            this.vertexBuffer = gl.createBuffer();
            if (!this.vertexBuffer) {
                console.log('Failed to create the buffer object');
                return -1;
              }
        }
      
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        if(this.uvBuffer == null){
            this.uvBuffer = gl.createBuffer();
            if (!this.uvBuffer) {
                console.log('Failed to create the buffer object');
                return -1;
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uv, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_UV);

        // Normal Buffer
        if(this.normalBuffer == null){
            this.normalBuffer = gl.createBuffer();
            if (!this.normalBuffer) {
                console.log('Failed to create the buffer object');
                return -1;
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Normal);

      
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length/3);
    }
}

function drawTriangle3DUV(vertices, uv){
    var n = 3;

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);


    var uvBuffer = gl.createBuffer();
    if (!uvBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_UV);
  
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3D(vertices) {
    var n = 3; // The number of vertices
  
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }
