import Light from "./Light.js";

class DirectionalLight extends Light
{
    constructor(lightColor, direction)
    {
        super(lightColor, false);

        this.direction = direction;
        this.setAmbientByFactor(0.2);
        this.setDiffuseByFac(0.5);
        this.setSpecularByFac(1.0);
    }

    bind(material)
    {
        material.shader.bind();
        //let lightWorldMat = this.gameObject.transform.getWorldSpaceMatrix();

        material.shader.setUniform3f("directLight.direction", this.direction[0], this.direction[1], this.direction[2]);
        material.shader.setUniform3f("directLight.ambient", this.ambient[0], this.ambient[1], this.ambient[2]);
        material.shader.setUniform3f("directLight.diffuse", this.diffuse[0], this.diffuse[1], this.diffuse[2]);
        material.shader.setUniform3f("directLight.specular", this.specular[0], this.specular[1], this.specular[2]);
    }

    static getDefaultDirectionalLight()
    {
        return new DirectionalLight([1, 1, 1], [-0.2, -1.0, -0.3]);
    }
}
export default DirectionalLight;