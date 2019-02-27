import Webgl from "./Webgl.js";

class Renderer
{
    constructor()
    {
        this.gl = Webgl.getGL();
        this.blendingEnabled = false;
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
        if (this.blendingEnabled)
        {
            const zSorting = [];

            elements.forEach((element) =>
            {
                let modelViewMatrix = element.gameObject.getModelViewMatrix(camera);
                let zPos = modelViewMatrix[14];
                //zSorting.push({element: element, zPos: zPos});
                zSorting.push({...element, zPos: zPos});
            });

            zSorting.sort((a, b) => {return a.zPos - b.zPos});

            zSorting.forEach((element) =>
            {
                this.drawGameObject(element.gameObject, camera);
            });
        }
        else
        {
            elements.forEach((element) => this.drawGameObject(element.gameObject, camera));
        }
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
        if (!gameObject.isEmpty)
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

        if (gameObject.childs.length > 0)
        {
            gameObject.childs.forEach((child) => this.drawWithLight(child, camera, light));
        }
    }

    drawWithoutLights(gameObject, camera)
    {
        if (!gameObject.isEmpty)
        {
            gameObject.material.bind();
            gameObject.material.shader.setUniformMatrix4fv("uProjectionMatrix", false, camera.projectionMatrix.matrix);
            gameObject.material.shader.setUniformMatrix4fv("uViewMatrix", false, camera.viewMatrix.matrix);
            gameObject.material.shader.setUniformMatrix4fv("uModelMatrix", false, gameObject.transform.getWorldSpaceMatrix());
            gameObject.draw();
        }

        if (gameObject.childs.length > 0)
        {
            gameObject.childs.forEach((child) => this.drawWithoutLights(child, camera));
        }
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

    enableBelnding()
    {
        this.blendingEnabled = true;
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }
}

export default Renderer;