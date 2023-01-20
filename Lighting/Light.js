class Light extends Cube {
    constructor() {
        super();
        this.color = [255, 255, 0, 1];
        this.textureNum = -2;
        // this.matrix.setTranslate(0, 0, 0);
        // this.matrix.scale(1, 1, 1);
        this.matrix.scale(-0.1, -0.1, -0.1);
        // this.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
        // this.matrix.translate(-.5, -.5, -.5);
    }
}
