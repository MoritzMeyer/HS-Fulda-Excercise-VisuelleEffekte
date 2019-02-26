import Webgl from "./Webgl.js";

class Renderer
{
    constructor()
    {
        this.gl = Webgl.getGL();
        this.lights = [];
    }

    draw(vertexArray, indexBuffer, shader)
    {
        shader.bind();
        vertexArray.bind();
        indexBuffer.bind();

        // draw object
        this.gl.drawElements(this.gl.TRIANGLES, indexBuffer.count, this.gl.UNSIGNED_SHORT, 0);
    }

    drawElements(elements, camera)
    {
        elements.forEach((element) => this.drawGameObject(element.gameObject, camera));
    }

    drawGameObject(gameObject, camera)
    {
        if (this.lights.length > 0)
        {
            this.drawWithLight(gameObject, camera);
        }
        else
        {
            this.drawWithoutLights(gameObject, camera);
        }
    }

    drawWithLight(gameObject, camera, light)
    {
        gameObject.material.bind();
        gameObject.material.shader.setUniformMatrix4fv("uProjectionMatrix", false, camera.projectionMatrix.matrix);
        gameObject.material.shader.setUniformMatrix4fv("uViewMatrix", false, camera.viewMatrix.matrix);
        gameObject.material.shader.setUniformMatrix4fv("uModelMatrix", false, gameObject.transform.getWorldSpaceMatrix());
        //gameObject.material.shader.setUniformMatrix4fv("uModelViewMatrix", false, gameObject.getModelViewMatrix(camera));


        light.bind(gameObject.material.shader);
        gameObject.material.shader.setUniformMatrix4fv("uNormalMatrix", false, gameObject.getNormalMatrix());
        gameObject.draw();
    }

    drawWithoutLights(gameObject, camera)
    {
        gameObject.material.bind();
        gameObject.material.shader.setUniformMatrix4fv("uProjectionMatrix", false, camera.projectionMatrix.matrix);
        gameObject.material.shader.setUniformMatrix4fv("uViewMatrix", false, camera.viewMatrix.matrix);
        gameObject.material.shader.setUniformMatrix4fv("uModelMatrix", false, gameObject.transform.getWorldSpaceMatrix());
        gameObject.draw();
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