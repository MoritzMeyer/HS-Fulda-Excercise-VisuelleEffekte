import GameObject from "./GameObject.js";
import Shader from "./Shader.js";
import Color from "./Color.js";
import Sphere3D from "./GameObjects/Sphere3D.js";

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

const fsSource =
    `
        #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
        #else
        precision mediump float;
        #endif
        uniform vec3 uObjectColor;
        uniform float uAlpha;
        
        void main() {
            gl_FragColor =  vec4(uObjectColor, uAlpha);
    }`;

class Light
{
    constructor(lightColor, uniformName = "uLightColor", drawLightObject = true)
    {
        this.uniformName = uniformName;
        this.lightColor = lightColor;
        this.drawLightObject = drawLightObject;
        this.gameObject = GameObject.createEmpty();
        this.lightObject = null;
        this.ambientStrength = 1.0;
        this.specularStrength = 0.5;
        this.specularFactor = 16.0;

        if (this.drawLightObject)
        {
            let lightObjectShader = new Shader(vsSource, fsSource);
            let color = new Color("uObjectColor", lightObjectShader, lightColor);
            this.lightObject = new Sphere3D(color);
            this.lightObject.gameObject.transform.setScale([0.2, 0.2, 0.2]);
            this.lightObject.gameObject.setParent(this.gameObject);
        }

    }

    bind(shader)
    {
        shader.bind();
        shader.setUniform3f("uLightPosition", this.gameObject.transform.position[0], this.gameObject.transform.position[1], this.gameObject.transform.position[2])
        shader.setUniform3f(this.uniformName, this.lightColor[0], this.lightColor[1], this.lightColor[2]);
        shader.setUniform1f("uAmbientStrength", this.ambientStrength);
        shader.setUniform1f("uSpecStrength", this.specularStrength);
        shader.setUniform1f("uSpecFac", this.specularFactor);
    }

    static getDefaultLight()
    {
        return new Light([1, 1, 1]);
    }
}
export default Light;