import Light from "./Light.js";
import {LightType} from "./LightType.js";

class DirectionalLight extends Light
{
    constructor(lightColor, direction, uniformName = "directLight")
    {
        super(lightColor, false, LightType.direct);
        this.uniformName = uniformName;

        this.direction = direction;
        this.setAmbientByFactor(0.2);
        this.setDiffuseByFac(0.5);
        this.setSpecularByFac(1.0);
        this.distance = 10;
        this.gameObject.transform.setPosition([this.direction[0] * this.distance, this.direction[1] * this.distance, this.direction[2] * this.  distance]);
        //this.gameObject.transform.setPosition(direction);


    }

    bind(material)
    {
        material.shader.bind();
        //let lightWorldMat = this.gameObject.transform.getWorldSpaceMatrix();

        material.shader.setUniform3f(this.uniformName + ".direction", this.direction[0], this.direction[1], this.direction[2]);
        material.shader.setUniform3f(this.uniformName + ".ambient", this.ambient[0], this.ambient[1], this.ambient[2]);
        material.shader.setUniform3f(this.uniformName + ".diffuse", this.diffuse[0], this.diffuse[1], this.diffuse[2]);
        material.shader.setUniform3f(this.uniformName + ".specular", this.specular[0], this.specular[1], this.specular[2]);
        material.shader.setUniform1i(this.uniformName + ".isActive", this.isActive);
    }

    setDistance(distance)
    {
        this.distance = distance;
        this.gameObject.transform.setPosition([this.direction[0] * distance, this.direction[1] * distance, this.direction[2] * distance]);
    }

    static getDefaultDirectionalLight()
    {
        return new DirectionalLight([1, 1, 1], [1, -3, 1.5]);
    }
}
export default DirectionalLight;