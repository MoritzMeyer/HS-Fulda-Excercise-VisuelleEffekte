import Webgl from "./Webgl.js";

class Material
{
    constructor(uniformName, shader)
    {
        this.gl = Webgl.getGL();
        this.uniformName = uniformName;
        this.shader = shader;
        this.loaded = false;
    }

    setAttribLocationInVertexArray(vertexArray)
    {
        throw new Error('Method not implemented!');
    }

    bind()
    {
        this.shader.bind();
    }

    delete()
    {
        this.shader.delete();
    }
}
export default Material