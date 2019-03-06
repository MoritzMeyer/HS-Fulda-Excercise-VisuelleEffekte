import Light from "./Light.js";

class PointLight extends Light
{
    constructor(lightColor, position, Kc = 1.0, Kl = 0.09, Kq = 0.032)
    {
        super(lightColor, true);

        // set Konstant, linear and quadratic Terms for equation
        this.constant = Kc;
        this.linear = Kl;
        this.quadratic = Kq;

        this.setAmbientByFactor(0.1);
        this.setDiffuseByFac(0.8);
        this.setSpecularByFac(1.0);

        this.gameObject.transform.setPosition(position[0], position[1], position[2]);
    }

    bind(material)
    {
        material.shader.bind();
        let lightWorldMat = this.gameObject.transform.getWorldSpaceMatrix();

        material.shader.setUniform3f("pointLight.position", lightWorldMat[12], lightWorldMat[13], lightWorldMat[14]);
        material.shader.setUniform3f("pointLight.ambient", this.ambient[0], this.ambient[1], this.ambient[2]);
        material.shader.setUniform3f("pointLight.diffuse", this.diffuse[0], this.diffuse[1], this.diffuse[2]);
        material.shader.setUniform3f("pointLight.specular", this.specular[0], this.specular[1], this.specular[2]);
        material.shader.setUniform1f("pointLight.constant", this.constant);
        material.shader.setUniform1f("pointLight.linear", this.linear);
        material.shader.setUniform1f("pointLight.quadratic", this.quadratic);

    }

    static getDefaultPointLight()
    {
        return new PointLight([1, 1, 1], [0, 2, 0]);
    }
}
export default PointLight;
