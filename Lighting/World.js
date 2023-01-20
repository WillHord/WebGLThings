class Map {
    constructor() {
        this.map = [];

        this.tempCube = new Cube();
        this.elements = {};
    }

    drawMap() {
        for(let i = 0; i < this.map.length; i++){
            for(let j = 0; j < this.map[i].length; j++){
              if(this.map[i][j] == 1){
                this.tempCube.color = [1,0,0,1];
                this.tempCube.textureNum = -3;
                this.tempCube.matrix.setTranslate(j - this.map.length/2, 0, i - this.map.length/2);
                this.tempCube.matrix.scale(1, 5, 1);
                this.tempCube.matrix.translate(-0.5, -0.75, -0.5);
        
                this.tempCube.render();
              }
            }
          }
    }
}

class ShapeElement{
    constructor(object, color = [255,255,255,1], scale = [1,1,1], setTranslate = [0,0,0], translate = [0,0,0], rotate = [0,0,0], textureNum = -2){
        this.object = object;
        this.color = color;
        this.scale = scale;
        this.setTranslate = setTranslate;
        this.translate = translate;
        this.rotate = rotate;
        this.textureNum = textureNum;
    }

    render(){
        this.object.color = this.color;
        this.object.matrix.setTranslate(this.setTranslate[0], this.setTranslate[1], this.setTranslate[2]);
        this.object.matrix.scale(this.scale[0], this.scale[1], this.scale[2]);
        this.object.matrix.translate(this.translate[0], this.translate[1], this.translate[2]);
        this.object.matrix.rotate(this.rotate[0], 1, 0, 0);
        this.object.textureNum = this.textureNum;
        this.object.render();
    }
}

class World {
    constructor() {
        this.map = null;

        this.tempCube = new Cube();

        this.frog = new Frog();

        this.floor = null;
        this.sky = null;
        this.elements = {};
        this.createElements();
    }

    createMap(){
        this.map = new Map();
    }

    createFloorAndSky(){
        // Floor
        this.tempCube.color = [255,0,255,1];
        this.tempCube.textureNum = 1;
        this.tempCube.matrix.setTranslate(0, -1, 0);
        this.tempCube.matrix.scale(50, -0.1, 50);
        this.tempCube.matrix.translate(-.5,-.5,-.5);
        this.tempCube.normalMatrix.setInverseOf(this.tempCube.matrix);
        this.tempCube.render();

        // Sky
        this.tempCube.textureNum = 0;
        this.tempCube.matrix.setTranslate(0, 0, 0);
        this.tempCube.matrix.scale(50, 50, 50);
        this.tempCube.matrix.translate(-.5,-.5,-.5);
        this.tempCube.normalMatrix.setInverseOf(this.tempCube.matrix);
        // Move with camera
        // this.tempCube.matrix.translate(g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2]);
        this.tempCube.render();
    }

    createElements(){
        // this.elements['light'] = new ShapeElement(
        //     new Light(),
        //     [255,255,0,1],
        //     [-0.1, -0.1, -0.1],
        //     [g_lightPos[0], g_lightPos[1], g_lightPos[2]],
        //     [0, 0, 0],
        //     [0, 0, 0],
        //     2
        // );

        // this.elements['light'] = new Light();

        this.elements['sphere'] = new ShapeElement(
            new Sphere(),
            [255,255,255,1],
            [1,1,1],
            [0, 0.5, 0],
            [0,0,0],
            [0,0,0],
            -3
        );

    }

    renderElements(){
        for(let element in this.elements){
            this.elements[element].render();
        }
        this.frog.translate(5,-0.2,0);
        this.frog.rotate(45, 0, 1, 0);
        this.frog.render();
    }

    render(){
        this.createFloorAndSky();
        this.renderElements();
    }
}


function makeMaze(){
    // https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
    var map = [];
    for(var i = 0; i < 50; i++){
      map.push([]);
      for(var j = 0; j < 50; j++){
        map[i].push(1);
      }
    }
  
    function divide(x, y, w, h){
      if(w < 2 || h < 2){
        return;
      }
      let wall;
      let hole;
      var dir = Math.floor(Math.random() * 2);
      if(dir == 0){
        wall = Math.floor(Math.random() * (h-1)) + 1;
        hole = Math.floor(Math.random() * w);
        for(var i = 0; i < w; i++){
          if(i != hole){
            map[y+wall][x+i] = 0;
          }
        }
        divide(x, y, w, wall);
        divide(x, y+wall, w, h-wall);
      }else{
        wall = Math.floor(Math.random() * (w-1)) + 1;
        hole = Math.floor(Math.random() * h);
        for(var i = 0; i < h; i++){
          if(i != hole){
            map[y+i][x+wall] = 0;
          }
        }
        divide(x, y, wall, h);
        divide(x+wall, y, w-wall, h);
      }
    }
  
    divide(0, 0, 50, 50);
  
    for(var i = 22; i < 28; i++){
      for(var j = 22; j < 28; j++){
        map[i][j] = 0;
      }
    }
  
    this.map = map;
  }
