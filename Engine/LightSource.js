import Color from "./Color.js";
import Shader from "./Shader.js";
import Sphere3D from "./GameObjects/Sphere3D.js";
import GameObject from "./GameObject.js";

const vsSource =
    `
        attribute vec3 aPosition;
        uniform mat4 uProjectionMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uModelMatrix;
        void main() {
            gl_PointSize = 10.0;
            gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
    }`;

const fsLightObjectSource =
    `
        #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
        #else
        precision mediump float;
        #endif
        uniform vec3 uObjectColor;
        void main() {
            gl_FragColor =  vec4(uObjectColor, 1.0);
    }`;

class LightSource
{
    constructor(lightColor = null, drawLightObject = true, uniformName = "uLightColor")
    {
        if (!lightColor)
        {
            lightColor = [1.0, 1.0, 1.0];
        }

        if (lightColor && (lightColor.length < 3 || lightColor.length > 4))
        {
            console.error("Colors must define 3 or 4 values");
        }

        this.gameObject = GameObject.createEmpty();
        this.lightColor = lightColor;
        this.drawPosition = drawLightObject;
        this.uniformName = uniformName;

        if (drawLightObject)
        {
            let lightObjectShader = new Shader(vsSource, fsLightObjectSource);
            let color = new Color("uObjectColor", lightObjectShader, lightColor);
            let lightSphere = new Sphere3D(color);
            lightSphere.gameObject.transform.setScale([0.2, 0.2, 0.2]);
            this.gameObject.addChild(lightSphere.gameObject);
        }
    }

    draw(shader)
    {
        shader.bind();
        //this.shader.setUniform1f("uAmbientStrength", 1.0);
        shader.setUniform3f("uLightPosition", this.gameObject.transform.position);
        if (this.lightColor.length < 4)
        {
            shader.setUniform3f(this.uniformName, this.lightColor[0], this.lightColor[1], this.lightColor[2]);
        }
        else
        {
            shader.setUniform4f(this.uniformName, this.lightColor[0], this.lightColor[1], this.lightColor[2], this.lightColor[3]);
        }
    }

    drawLightObject(camera)
    {
        if (this.drawPosition)
        {
            this.gameObject.draw(camera);
        }
    }

    static getDefaultLightSource()
    {
        return new LightSource([1.0, 1.0, 1.0]);
    }
}
export default LightSource;