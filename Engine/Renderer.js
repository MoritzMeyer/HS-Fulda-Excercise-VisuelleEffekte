import Webgl from "./Webgl.js";
import {LightType} from "./LightType.js";
import Shader from "./Shader.js";
import FrameBuffer from "./FrameBuffer.js";

class Renderer
{
    constructor()
    {
        this.gl = Webgl.getGL();
        this.blendingEnabled = false;
        this.lights = [];
        this.pointLights = 0;
        this.directionalLights = 0;
        this.spotLights = 0;
        this.frameBuffer = null;
    }

    pushLight(light)
    {
        this.lights.push(light);
        switch (light.type)
        {
            case LightType.point:
                this.pointLights++;
                break;
            case LightType.spot:
                this.spotLights++;
                break;
            case LightType.direct:
                this.directionalLights++;
                break;
        }
    }

    removeLight(lightIndex)
    {
        //this.lights.filter((el) => el !== light);
        switch (this.lights[lightIndex].type)
        {
            case LightType.point:
                this.pointLights--;
                break;
            case LightType.spot:
                this.spotLights--;
                break;
            case LightType.direct:
                this.directionalLights--;
                break;
        }
        this.lights.splice(lightIndex, 1);
    }

    renderDepthMap(elements, light)
    {
        let lightViewProjectionMatrix = light.getViewProjectionMatrix();
        light.shadowShader.bind();

        elements.forEach((e) =>
        {
           let modelMatrix = e.gameObject.transform.getWorldSpaceMatrix();
           let lightModelViewProjectionMatrix = mat4.create();
           mat4.multiply(lightModelViewProjectionMatrix, lightViewProjectionMatrix, modelMatrix);

           light.shadowShader.setUniformMatrix4fv("uLightModelViewProjectionMatrix", false, lightModelViewProjectionMatrix);
           e.gameObject.draw(false);
        });
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
        // actual Shadows are only enabled for one lightsource
        if (this.lights.length === 1 && this.lights[0].renderShadow)
        {
            if (this.frameBuffer != null)
            {
                this.frameBuffer.clear();
                this.frameBuffer = null;
            }
            this.frameBuffer = new FrameBuffer(this.width, this.height);
            
            this.frameBuffer.bind();
            this.renderDepthMap(elements, this.lights[0]);
            this.frameBuffer.unbind();
            this.gl.enable(this.gl.CULL_FACE);
        }

        //console.log("camera: p(" + camera.gameObject.transform.position + "), e(" + camera.getEye() + ")" );
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
        if (!gameObject.isEmpty)
        {
            gameObject.material.bind();
            gameObject.material.shader.setUniformMatrix4fv("uProjectionMatrix", false, camera.projectionMatrix.matrix);
            gameObject.material.shader.setUniformMatrix4fv("uViewMatrix", false, camera.getViewMatrix());
            gameObject.material.shader.setUniformMatrix4fv("uModelMatrix", false, gameObject.transform.getWorldSpaceMatrix());
            //gameObject.material.shader.setUniformMatrix4fv("uModelViewMatrix", false, gameObject.getModelViewMatrix(camera));

            if (this.lights.length > 0)
            {
                let eye = camera.getEye();
                gameObject.material.shader.setUniform3f("uViewPosition", eye[0], eye[1], eye[2]);
                gameObject.material.shader.setUniformMatrix4fv("uNormalMatrix", false, gameObject.getNormalMatrix());
                //gameObject.material.shader.setUniform1i("uNumbPointLights", this.pointLights);
                //gameObject.material.shader.setUniform1i("uNumbDirectLights", this.directionalLights);
                //gameObject.material.shader.setUniform1i("uNumbSpotLights", this.spotLights);

                // Shadows are rendered only for light on first position
                if (this.lights[0].renderShadow)
                {
                    gameObject.material.shader.setUniformMatrix4fv("uLightSpaceMatrix", false, this.lights[0].getViewProjectionMatrix());
                    this.gl.activeTexture(this.gl.TEXTURE0 + 0);
                    this.gl.bindTexture(this.gl.TEXTURE_2D, this.frameBuffer.depthMap);
                    gameObject.material.shader.setUniform1i("uShadowMap", 0);
                }

                this.lights.forEach((light) =>
                {
                    light.bind(gameObject.material);
                    if (light.drawLightObject && light.isActive)
                    {
                        this.drawWithoutLights(light.lightObject.gameObject, camera);
                    }
                });
            }

            gameObject.draw();
        }

        if (gameObject.childs.length > 0)
        {
            gameObject.childs.forEach((child) => this.drawGameObject(child, camera));
        }
    }

    drawWithLight(gameObject, camera, light)
    {
        if (!gameObject.isEmpty)
        {
            gameObject.material.bind();
            gameObject.material.shader.setU1niformMatrix4fv("uProjectionMatrix", false, camera.projectionMatrix.matrix);
            gameObject.material.shader.setUniformMatrix4fv("uViewMatrix", false, camera.getViewMatrix());
            gameObject.material.shader.setUniformMatrix4fv("uModelMatrix", false, gameObject.transform.getWorldSpaceMatrix());
            //gameObject.material.shader.setUniformMatrix4fv("uModelViewMatrix", false, gameObject.getModelViewMatrix(camera));

            light.bind(gameObject.material);
            let eye = camera.getEye();
            gameObject.material.shader.setUniform3f("uViewPosition", eye[0], eye[1], eye[2]);
            gameObject.material.shader.setUniformMatrix4fv("uNormalMatrix", false, gameObject.getNormalMatrix());
            gameObject.draw();
            if (light.drawLightObject && light.isActive)
            {
                this.drawWithoutLights(light.lightObject.gameObject, camera);
            }
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
            gameObject.material.shader.setUniformMatrix4fv("uViewMatrix", false, camera.getViewMatrix());
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

    enableBlending()
    {
        this.blendingEnabled = true;
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }

    setCanvasDimensions(width, height)
    {
        this.width = width;
        this.height = height;
    }
}

export default Renderer;