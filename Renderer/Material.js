import Webgl from "./Webgl.js";

class Material
{
    constructor(uniformName, shader)
    {
        this.gl = Webgl.getGL();
        this.uniformName = uniformName;
        this.shader = shader;
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