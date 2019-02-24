import Webgl from "./Webgl.js";
import Matrix from "./Matrix.js";
import ProjectionMatrix from "./ProjectionMatrix.js";

class Camera
{
    constructor()
    {
        this.gl = Webgl.getGL();
        this.viewMatrix = new Matrix();
        this.projectionMatrix = new ProjectionMatrix();
        this.cameraMatrix = new Matrix();
        this.viewProjectionMatrix = mat4.create();
    }

    getViewProjectionMatrix()
    {
        this.viewProjectionMatrix = mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix.matrix, this.viewMatrix.matrix);
        return this.viewProjectionMatrix;
    }

    applyViewProjectionMatricesToShader(shader)
    {
        shader.bind();
        shader.setUniformMatrix4fv("uProjectionMatrix", false, this.projectionMatrix.matrix);
        shader.setUniformMatrix4fv("uViewMatrix", false, this.viewMatrix.matrix);
    }
}
export default Camera;