class Sphere {
    constructor(){
        this.type = "sphere";
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = -2;

        this.rgba = null;

        this.vertices = [];
        this.uv = [0,0,0,0,0,0,  0,0,0,0,0,0];
        this.colors = [];
        this.normals = [];

        this.allVertices = [];

        this.vertexBuffer = null;
        this.uvBuffer = null;
        this.colorBuffer = null;
        this.normalBuffer = null;

        this.segments = 10;
    }

    generateVertices(){
        var d = Math.PI / this.segments;
        var dd = Math.PI / this.segments;
        
        for(var t=0; t<Math.PI; t+=d){
            for(var r=0; r < (2*Math.PI); r += d){
                var p1 = [Math.sin(t)*Math.cos(r), Math.sin(t)*Math.sin(r), Math.cos(t)];
                var p2 = [Math.sin(t+dd)*Math.cos(r), Math.sin(t+dd)*Math.sin(r), Math.cos(t+dd)];
                var p3 = [Math.sin(t)*Math.cos(r+dd), Math.sin(t)*Math.sin(r+dd), Math.cos(t)];
                var p4 = [Math.sin(t+dd)*Math.cos(r+dd), Math.sin(t+dd)*Math.sin(r+dd), Math.cos(t+dd)];

                this.vertices = [];

                this.vertices = this.vertices.concat(p1);
                this.vertices = this.vertices.concat(p2);
                this.vertices = this.vertices.concat(p4);

                for(var k=0; k< 6; k++){
                    this.colors = this.colors.concat(
                        this.rgba[0], this.rgba[1], this.rgba[2], this.rgba[3],
                        this.rgba[0], this.rgba[1], this.rgba[2], this.rgba[3],
                        this.rgba[0], this.rgba[1], this.rgba[2], this.rgba[3]
                    );
                }

                this.vertices = this.vertices.concat(p1);
                this.vertices = this.vertices.concat(p4);
                this.vertices = this.vertices.concat(p3);

                // this.drawTriangle3DUVNormal();
                this.allVertices = this.allVertices.concat([this.vertices]);
            }
        }
        this.drawTriangle3DUVNormal();
    }  

    drawTriangle3DUVNormal(){
        // Create a buffer object
        if(!this.vertexBuffer){
            this.vertexBuffer = gl.createBuffer();
            if (!this.vertexBuffer) {
            console.log('Failed to create the buffer object');
            return -1;
            }
        }
      
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.DYNAMIC_DRAW, 0, this.vertices.length);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
    
        if(!this.uvBuffer){
            this.uvBuffer = gl.createBuffer();
            if (!this.uvBuffer) {
                console.log('Failed to create the buffer object');
                return -1;
            }
        }
    
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_UV);
    
        if(!this.normalBuffer){
            this.normalBuffer = gl.createBuffer();
            if (!this.normalBuffer) {
                console.log('Failed to create the buffer object');
                return -1;
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Normal);
      
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
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
        // gl.uniform4f(u_FragColor, this.rgba[0], this.rgba[1], this.rgba[2], this.rgba[3]);
        // gl.uniformMatrix4fv(u_NormalMatrix, false, this.matrix.elements);

        if(this.allVertices.length == 0){
            this.generateVertices();
        }

        this.allVertices.forEach((vertices) => {
            this.vertices = vertices;
            this.drawTriangle3DUVNormal();
        });
        

    }
}

function drawTriangle3DUVNormal(vertices, uv, normals){
    var n = vertices.length / 3;

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
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

    var normalBuffer = gl.createBuffer();
    if (!normalBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Normal);
  
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
