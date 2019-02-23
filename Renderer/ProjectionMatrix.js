import Matrix from "./Matrix.js";
import Webgl from "./Webgl.js";

class ProjectionMatrix extends Matrix
{
    constructor()
    {
        super();
        const gl = this.gl = Webgl.getGL();
        this.fieldOfView = glMatrix.toRadian(45); // degree to radians
        this.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        this.zNear = 0.1;
        this.zFar = 100.0;

        mat4.perspective(this.matrix, this.fieldOfView, this.aspect, this.zNear, this.zFar);
    }


}

export default ProjectionMatrix;