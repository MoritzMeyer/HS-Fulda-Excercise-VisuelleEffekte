import GameObject from "./GameObject.js";
import Shader from "./Shader.js";
import Color from "./Color.js";
import Sphere3D from "./GameObjects/Sphere3D.js";

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
            let color = new Color(Shader.getDefaultColorShader(false), lightColor);
            this.lightObject = new Sphere3D(color);
            this.lightObject.gameObject.transform.setScale([0.2, 0.2, 0.2]);
            this.lightObject.gameObject.setParent(this.gameObject);
        }

    }

    bind(material)
    {
        material.shader.bind();
        let lightWorldMat = this.gameObject.transform.getWorldSpaceMatrix();
        material.shader.setUniform3f("uLightPosition", lightWorldMat[12], lightWorldMat[13], lightWorldMat[14]);
        material.shader.setUniform3f(this.uniformName, this.lightColor[0], this.lightColor[1], this.lightColor[2]);

        if (material.isTexture)
        {
            material.shader.setUniform1f("uAmbientStrength", this.ambientStrength);
            material.shader.setUniform1f("uSpecStrength", this.specularStrength);
            material.shader.setUniform1f("uSpecFac", this.specularFactor);
        }
    }

    static getDefaultLight()
    {
        return new Light([1, 1, 1]);
    }
}
export default Light;