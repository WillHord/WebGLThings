
const white = [255, 255, 255, 1];
const LightGreen = [94, 221, 95, 1];

class Frog {
    constructor() {
        this.type = "frog";
        this.bodyMatrix = null;
        this.headMatrix = null;

        // Cubes
        this.bodyCube = null;
        this.underBody = null;
        this.outerEye = null;
        this.innerEye = null;

        this.head = null;
        this.lowerLip = null;
        this.upperLip = null;

        this.femur = null;
        this.tibia = null;
        this.foot = null;
        this.toe = null;
    }

    generateCubes() {
        // Body
        this.body = new Cube();
        this.underBody = new Cube();

        // Head
        this.head = new Cube();
        this.lowerLip = new Cube();
        this.upperLip = new Cube();

        // Eyes
        this.outerEye = new Cube();
        this.innerEye = new Cube();

        // Legs
        this.femur = new Cube();
        this.tibia = new Cube();
        this.foot = new Cube();
        // this.toe = new TriangularPrism();

    }

    translate(x, y, z) {
        if(this.body == null){
            this.generateCubes();
        }
        this.body.matrix.setTranslate(x, y, z);
    }

    drawEye(position){
        // let outerEye = new Cube();
        this.outerEye.color = [147, 19, 13, 1];
        this.outerEye.matrix = new Matrix4(this.headMatrix);
        this.outerEye.matrix.translate(position[0], position[1], position[2]);
        let outerEyeMatrix = new Matrix4(this.outerEye.matrix);
        this.outerEye.matrix.rotate(0, 0, 0, 1);
        this.outerEye.matrix.scale(.1, .1, .1);
        this.outerEye.render();

        // let innerEye = new Cube();
        this.innerEye.color = [0, 0, 0, 1];
        this.innerEye.matrix = new Matrix4(outerEyeMatrix);
        this.innerEye.matrix.translate(-.025, .025, .025);
        this.innerEye.matrix.rotate(0, 0, 0, 1);
        this.innerEye.matrix.scale(.05, .05, .05);
        this.innerEye.render();
    }

    drawBody() {
        this.body.color = [94, 221, 95, 1];
        this.body.matrix.translate(-.1, -.2, 0.0);
        this.body.matrix.translate(0, g_jumpHeight, 0);
        this.body.matrix.rotate(bodyJoint, 0, 0, 1);
        this.bodyMatrix = new Matrix4(this.body.matrix);
        this.body.matrix.rotate(-10, 0, 0, 1);
        this.body.matrix.scale(1, .20, 0.5);
        this.body.render();

        this.underBody.color = [255, 255, 255, 1];
        this.underBody.matrix = new Matrix4(this.bodyMatrix);
        this.underBody.matrix.translate(-.111, -.1, 0.0);
        this.underBody.matrix.rotate(-10, 0, 0, 1);
        this.underBody.matrix.scale(1.1, .12, 0.5);
        this.underBody.render();  
    }

    drawHead(){
        this.head.color = [94, 221, 95, 1];
        this.head.matrix = new Matrix4(this.bodyMatrix);
        this.head.matrix.translate(-.35, 0, -0.0501);
        this.head.matrix.rotate(0, 0, 0, 1);
        this.head.matrix.rotate(headJoint, 0, 0, 1);
        this.headMatrix = new Matrix4(this.head.matrix);
        this.head.matrix.scale(.4, .35, 0.601);
        this.head.render();

        // Lower lip
        this.lowerLip.color = [255, 255, 255, 1];
        this.lowerLip.matrix = new Matrix4(this.headMatrix);
        this.lowerLip.matrix.translate(.1, .075, .12);
        this.lowerLip.matrix.rotate(20, 0, 0, 1);
        this.lowerLip.matrix.rotate(lowerLipJoint, 0, 0, 1);
        this.lowerLip.matrix.scale(-.2, .05, 0.35);
        this.lowerLip.render();

        // Upper lip
        this.upperLip.color = [255, 255, 255, 1];
        this.upperLip.matrix = new Matrix4(this.headMatrix);
        this.upperLip.matrix.translate(.1, .075, .12);
        this.upperLip.matrix.rotate(-20, 0, 0, 1);
        this.upperLip.matrix.rotate(upperLipJoint, 0, 0, 1);
        this.upperLip.matrix.scale(-.2, .05, 0.35);
        this.upperLip.render();

        // Draw eyes
        this.drawEye([-.05, .2, .075]);
        this.drawEye([-.05, .2, .4]);
    }

    drawBackLeg(position, right){
        this.femur.color = [94, 221, 95, 1];
        this.femur.matrix = new Matrix4(this.bodyMatrix);
        this.femur.matrix.translate(position[0], position[1], position[2]);
       
        if(right){
            this.femur.matrix.rotate(backRightLegJoint1, 0, 0, 1);
        } else {
            this.femur.matrix.rotate(backLeftLegJoint1, 0, 0, 1);
        }
        let tempfemurMatrix = new Matrix4(this.femur.matrix);
        this.femur.matrix.rotate(-75, 0, 0, 1);
        this.femur.matrix.scale(.15, -.45, -.1);
        this.femur.render();

        this.tibia.color = [94, 221, 95, 1];
        this.tibia.matrix = tempfemurMatrix;
        this.tibia.matrix.translate(-.5,-.23,0);
        if(right){
            this.tibia.matrix.rotate(backRightLegJoint2, 0, 0, 1);
        } else {
            this.tibia.matrix.rotate(backLeftLegJoint2, 0, 0, 1);
        }
        var temptibiaMatrix = new Matrix4(this.tibia.matrix);
        
        this.tibia.matrix.rotate(65, 0, 0, 1);
        this.tibia.matrix.scale(.15, -.55, -.1);
        this.tibia.render();

        this.foot.color = [255, 134, 0, 1];
        this.foot.matrix = temptibiaMatrix;
        this.foot.matrix.translate(.55, -.25, -.125);
        
        if(right){
            this.foot.matrix.rotate(backRightLegJoint3, 0, 0, 1);
        } else {
            this.foot.matrix.rotate(backLeftLegJoint3, 0, 0, 1);
        }
        let tempfootMatrix = new Matrix4(this.foot.matrix);
        this.foot.matrix.rotate(90, 0, 0, 1);
        this.foot.matrix.scale(.1, .25, .15);
        this.foot.render();

        // this.toe.color = [255, 134, 0, 1];
        // this.toe.matrix = new Matrix4(tempfootMatrix);
        // this.toe.matrix.translate(-.25, 0, .155);
        // this.toe.matrix.rotate(135, 0, 1, 0);
        // this.toe.matrix.scale(.12, .1, .12);
        // this.toe.render();
    }

    drawFrontLeg(position, right){
        this.femur.color = [94, 221, 95, 1];
        this.femur.matrix = new Matrix4(this.bodyMatrix);
        this.femur.matrix.translate(position[0], position[1], position[2]);
        
        if(right){
            this.femur.matrix.rotate(frontRightLegJoint1, 0, 0, 1);
        } else {
            this.femur.matrix.rotate(frontLeftLegJoint1, 0, 0, 1);
        }
        var tempfemurMatrix = new Matrix4(this.femur.matrix);
        this.femur.matrix.rotate(50, 0, 0, 1);
        this.femur.matrix.scale(.15, -.4, -.1);
        this.femur.render();

        this.tibia.color = [94, 221, 95, 1];
        this.tibia.matrix = tempfemurMatrix;
        this.tibia.matrix.translate(.3, -.1, 0);
        if(right){
            this.tibia.matrix.rotate(frontRightLegJoint2, 0, 0, 1);
        } else {
            this.tibia.matrix.rotate(frontLeftLegJoint2, 0, 0, 1);
        }
        let temptibiaMatrix = new Matrix4(this.tibia.matrix);
        this.tibia.matrix.rotate(-50, 0, 0, 1);
        this.tibia.matrix.scale(.15, -.52, -.1);
        this.tibia.render();

        this.foot.color = [255, 134, 0, 1];
        this.foot.matrix = temptibiaMatrix;
        this.foot.matrix.translate(-.2, -.45, -.125);
        if(right){
            this.foot.matrix.rotate(frontRightLegJoint3, 0, 0, 1);
        } else {
            this.foot.matrix.rotate(frontLeftLegJoint3, 0, 0, 1);
        }
        let tempfootMatrix = new Matrix4(this.foot.matrix);
        this.foot.matrix.rotate(90, 0, 0, 1);
        this.foot.matrix.scale(.1, .3, .15);
        this.foot.render();

        // this.toe.color = [255, 134, 0, 1];
        // this.toe.matrix = new Matrix4(tempfootMatrix);
        // this.toe.matrix.translate(-.3, 0, .155);
        // this.toe.matrix.rotate(135, 0, 1, 0);
        // this.toe.matrix.scale(.12, .1, .12);
        // this.toe.render();
    }

    render() {
        if(this.body == null){
            this.generateCubes();
        }

        this.drawBody();
        this.drawHead();
        this.drawBackLeg([.93, -.1, .05], false);
        this.drawBackLeg([.93, -.1, .55], true);

        this.drawFrontLeg([-.075, 0, .05], false);
        this.drawFrontLeg([-.075, 0, .55], true);
    }
}
