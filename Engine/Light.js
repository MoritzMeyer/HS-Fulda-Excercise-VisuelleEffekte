import GameObject from "./GameObject.js";
import Shader from "./Shader.js";
import Color from "./Color.js";
import Sphere3D from "./GameObjects/Sphere3D.js";
import {LightType} from "./LightType.js";

class Light
{
    constructor(lightColor, drawLightObject = true, type = LightType.default)
    {
        this.lightColor = lightColor;
        this.drawLightObject = drawLightObject;
        this.gameObject = GameObject.createEmpty();
        this.lightObject = null;
        this.ambientStrength = 1.0;
        this.specularStrength = 0.5;
        this.specularFactor = 16.0;
        this.type = type;
        this.isActive = true;
        this.renderShadow = false;
        this.shadowShader = null;

        this.setAmbientByFactor(1.0);
        this.setDiffuseByFac(1.0);
        this.setSpecularByFac(1.0);

        if (this.drawLightObject)
        {
            let color = new Color(Shader.getDefaultColorShader(false), lightColor);
            this.lightObject = new Sphere3D(color);
            this.lightObject.gameObject.transform.setScale([0.2, 0.2, 0.2]);
            this.lightObject.gameObject.setParent(this.gameObject);
        }

    }

    bind(material) {
        material.shader.bind();
        let lightWorldMat = this.gameObject.transform.getWorldSpaceMatrix();

        material.shader.setUniform3f("light.position", lightWorldMat[12], lightWorldMat[13], lightWorldMat[14]);
        material.shader.setUniform3f("light.ambient", this.ambient[0], this.ambient[1], this.ambient[2]);
        material.shader.setUniform3f("light.diffuse", this.diffuse[0], this.diffuse[1], this.diffuse[2]);
        material.shader.setUniform3f("light.specular", this.specular[0], this.specular[1], this.specular[2]);
        material.shader.setUniform3f("light.color", this.lightColor[0], this.lightColor[1], this.lightColor[2]);
        material.shader.setUniform1i("light.isActive", this.isActive);
    }

    getViewMatrix()
    {
        return this.gameObject.transform.getWorldSpaceMatrix();
    }

    getLookAtMatrix()
    {
        let viewMatrix = this.getViewMatrix();
        let lightMatrix = mat4.create();
        mat4.invert(lightMatrix, viewMatrix);
        let up = vec3.fromValues(lightMatrix[4], lightMatrix[5], lightMatrix[6]);
        let eye = vec3.fromValues(lightMatrix[12], lightMatrix[13], lightMatrix[14]);
        let center = vec3.fromValues(0.0001, 0.0001, 0.0001);
        //let center = vec3.fromValues(this.direction[0], this.direction[1], this.direction[2]);
        let lookAtMatrix = mat4.create();
        mat4.lookAt(lookAtMatrix, eye, center, up);

        return lookAtMatrix;
    }

    getProjectionMatrix(left = -20.0, right = 20.0, bottom = -20.0, top = 20.0, nearPlane = 0.1, farPlane = 100)
    {
        let lightProjection = mat4.create();
        mat4.ortho(lightProjection, left, right, bottom, top, nearPlane, farPlane);

        return lightProjection;
    }

    getViewProjectionMatrix()
    {
        let projectionMatrix = this.getProjectionMatrix();
        let lookAtMatrix = this.getLookAtMatrix();
        let lightViewProjectionMatrix = mat4.create();
        mat4.multiply(lightViewProjectionMatrix, projectionMatrix, lookAtMatrix);

        return lightViewProjectionMatrix;
    }

    activateShadows()
    {
        this.renderShadow = true;
        this.shadowShader = Shader.getDefaultShadowShader();
    }

    setActive()
    {
        this.isActive = true;
    }

    setInActive()
    {
        this.isActive = false;
    }

    setAmbient(x, y, z)
    {
        this.ambient = [x, y, z];
    }

    setDiffuse(x, y, z)
    {
        this.diffuse = [x, y, z];
    }

    setSpecular(x, y, z)
    {
        this.specular = [x, y, z];
    }

    setAmbientByFactor(fac)
    {
        this.ambient = this.lightColor.map((x) => x * fac);
    }

    setDiffuseByFac(fac)
    {
        this.diffuse = this.lightColor.map((x) => x * fac);
    }

    setSpecularByFac(fac)
    {
        this.specular = this.lightColor.map((x) => x * fac);
    }

    static getDefaultLight()
    {
        return new Light([1, 1, 1]);
    }
}
export default Light;