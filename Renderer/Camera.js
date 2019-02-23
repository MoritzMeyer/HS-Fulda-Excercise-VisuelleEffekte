import Webgl from "./Webgl";

class Camera
{
    constructor(viewMatrix, projectionMatrix)
    {
        this.gl = Webgl.getGL();
        this.viewMatrix = viewMatrix;
        this.projectionMatrix = projectionMatrix;
        this.cameraMatrix = mat4.create();
        this.viewProjectionMatrix = mat4.create();
    }

    getViewProjectionMatrix()
    {
        this.viewProjectionMatrix = mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
        return this.viewProjectionMatrix;
    }
}