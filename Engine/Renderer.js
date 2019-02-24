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
        camera.applyViewProjectionMatricesToShader(drawable.material.shader);
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