import Webgl from "./Webgl.js";

class Material
{
    constructor(uniformName, shader, ambient, diffuse, specular, shininess, alpha = 1.0)
    {
        this.gl = Webgl.getGL();
        this.uniformName = uniformName;
        this.shader = shader;
        this.loaded = false;
        this.alpha = alpha;

        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;

        this.isTexture = false;
    }

    setAttribLocationInVertexArray(vertexArray)
    {
        throw new Error('Method not implemented!');
    }

    bind()
    {
        this.shader.bind();
        this.shader.setUniform1f("uAlpha", this.alpha);
        if (!this.isTexture && this.shader.hasLightning)
        {
            this.shader.setUniform3f("material.ambient", this.ambient[0], this.ambient[1], this.ambient[2]);
            this.shader.setUniform3f("material.diffuse", this.diffuse[0], this.diffuse[1], this.diffuse[2]);
            this.shader.setUniform3f("material.specular", this.specular[0], this.specular[1], this.specular[2]);
            this.shader.setUniform1f("material.shininess", this.shininess);
        }
    }

    delete()
    {
        this.shader.delete();
    }

    setShininess(value)
    {
        this.shininess = value;
    }

    setAlpha(value)
    {
        this.alpha = value;
    }
}
export default Material