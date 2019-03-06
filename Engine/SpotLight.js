import Light from "./Light.js";

class SpotLight extends Light
{
    constructor(lightColor, position, direction, cutOff, outerCutOff = null, uniformName = "spotLight", Kc = 1.0, Kl = 0.09, Kq = 0.032)
    {
        super(lightColor, true);
        this.uniformName = uniformName;
        this.gameObject.transform.setPosition(position);
        this.direction = direction;
        this.cutOff = cutOff;

        if (!outerCutOff)
        {
            this.outerCutOff = cutOff;
        }
        else
        {
            this.outerCutOff = outerCutOff;
        }

        this.constant = Kc;
        this.linear = Kl;
        this.quadratic = Kq;

        this.setAmbientByFactor(0.1);
        this.setDiffuseByFac(0.8);
        this.setSpecularByFac(1.0);
    }

    bind(material)
    {
        material.shader.bind();
        let lightWorldMat = this.gameObject.transform.getWorldSpaceMatrix();

        material.shader.setUniform3f(this.uniformName + ".position", lightWorldMat[12], lightWorldMat[13], lightWorldMat[14]);
        material.shader.setUniform3f(this.uniformName + ".direction", this.direction[0], this.direction[1], this.direction[2]);
        material.shader.setUniform1f(this.uniformName + ".cutOff", this.getCutOffCosine());

        if (this.cutOff !== this.outerCutOff)
        {
            material.shader.setUniform1f(this.uniformName + ".outerCutOff", this.getOuterCutOffCosine());
        }

        material.shader.setUniform3f(this.uniformName + ".ambient", this.ambient[0], this.ambient[1], this.ambient[2]);
        material.shader.setUniform3f(this.uniformName + ".diffuse", this.diffuse[0], this.diffuse[1], this.diffuse[2]);
        material.shader.setUniform3f(this.uniformName + ".specular", this.specular[0], this.specular[1], this.specular[2]);

        material.shader.setUniform1f(this.uniformName + ".constant", this.constant);
        material.shader.setUniform1f(this.uniformName + ".linear", this.linear);
        material.shader.setUniform1f(this.uniformName + ".quadratic", this.quadratic);

    }

    getCutOffCosine()
    {
        return Math.cos(glMatrix.toRadian(this.cutOff));
    }

    getOuterCutOffCosine()
    {
        return Math.cos(glMatrix.toRadian(this.outerCutOff));
    }

    static getDefaultSpotLight(outerCutOff = false)
    {
        if (outerCutOff)
        {
            return new SpotLight([1, 1, 1], [0, 2, 0], [0, -1, 0], 12.5, 17.5);
        }
        else
        {
            return new SpotLight([1, 1, 1], [0, 2, 0], [0, -1, 0], 12.5);
        }
    }
}
export default SpotLight;