import Webgl from "./Webgl.js";

class Renderer
{
    constructor()
    {
        const gl = this.gl = Webgl.getGL();
    }

    draw(vertexArray, indexBuffer, shader)
    {
        shader.bind();
        vertexArray.bind();
        indexBuffer.bind();

        // draw object
        this.gl.drawElements(this.gl.TRIANGLES, indexBuffer.count, this.gl.UNSIGNED_SHORT, 0);
    }

    drawDrawable(drawable, camera)
    {
        //let modelViewProjection = mat4.create();
        //mat4.multiply(modelViewProjection, camera.projectionMatrix.matrix, camera.viewMatrix.matrix);
        //mat4.multiply(modelViewProjection, modelViewProjection, drawable.modelMatrix.matrix);
        //let matrix = camera.getViewProjectionMatrix();
        //mat4.multiply(modelViewProjection, camera.viewMatrix.matrix, drawable.modelMatrix.matrix);
        //mat4.multiply(matrix, matrix, drawable.modelMatrix.matrix);
        drawable.material.shader.bind();
        drawable.material.shader.setUniformMatrix4fv("uProjectionMatrix", false, camera.projectionMatrix.matrix);
        drawable.material.shader.setUniformMatrix4fv("uViewMatrix", false, camera.viewMatrix.matrix);
        drawable.material.shader.setUniformMatrix4fv("uModelMatrix", false, drawable.modelMatrix.matrix);

        drawable.draw();
    }

    clear(canvas, canvasColor)
    {
        // Clear canvas and set background color
        this.gl.clearColor(canvasColor[0], canvasColor[1], canvasColor[2], canvasColor[3]);

        // clear depthBuffer and depthBuffer bit
        this.gl.clearDepth(1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // set viewport to canvas width and height
        // (transformation from normalized device coordinates to window coordinates)
        this.gl.viewport(0, 0, canvas.width, canvas.height);

        // enable depthtest
        this.gl.enable(this.gl.DEPTH_TEST);
    }
}

export default Renderer;