import Webgl from "./Webgl.js";

class MaterialPBR
{
    constructor(shader, albedo, metallic, roughness, ambientOcclusion, alpha = 1.0, uniformName = "material")
    {
        this.gl = Webgl.getGL();
        this.uniformName = uniformName;
        this.shader = shader;
        this.loaded = false;
        this.alpha = alpha;

        this.albedo = albedo;
        this.metallic = metallic;
        this.roughness = roughness;
        this.ambientOcclusion = ambientOcclusion;

        this.isTexture = false;
    }

    bind() {
        this.shader.bind();
        this.shader.setUniform1f("uAlpha", this.alpha);

        if (this.shader.hasLightning) {
            this.shader.setUniform3f(this.uniformName + ".albedo", this.albedo[0], this.albedo[1], this.albedo[2]);
            this.shader.setUniform1f(this.uniformName + ".metallic", this.metallic);
            this.shader.setUniform1f(this.uniformName + ".roughness", this.roughness);
            this.shader.setUniform1f(this.uniformName + ".ao", this.ambientOcclusion);
        }
    }

    setAttribLocationInVertexArray(vertexArray)
    {
        return null;
    }

    delete()
    {
        this.shader.delete();
    }

    setAlpha(value)
    {
        this.alpha = value;
    }

    setRoughness(value)
    {
        this.roughness = value;
    }

    setMetallic(value)
    {
        this.metallic = value;
    }

    setAlbedo(value)
    {
        this.albedo = value;
    }
}
export default MaterialPBR;