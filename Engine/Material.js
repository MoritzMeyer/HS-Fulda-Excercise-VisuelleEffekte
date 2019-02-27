import Webgl from "./Webgl.js";

class Material
{
    constructor(uniformName, shader, isTexture, alpha = 1.0)
    {
        this.gl = Webgl.getGL();
        this.uniformName = uniformName;
        this.shader = shader;
        this.loaded = false;
        this.isTexture = isTexture;
        this.alpha = alpha;
    }

    setAttribLocationInVertexArray(vertexArray)
    {
        throw new Error('Method not implemented!');
    }

    bind()
    {
        this.shader.bind();
        this.shader.setUniform1f("uAlpha", this.alpha);
    }

    delete()
    {
        this.shader.delete();
    }

    setAlpha(value)
    {
        this.alpha = value;
    }
}
export default Material