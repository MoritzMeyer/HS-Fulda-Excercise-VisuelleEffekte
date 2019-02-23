import VertexArray from "./VertexArray.js";
import IndexBuffer from "./IndexBuffer.js";
import Webgl from "./Webgl.js";
import Matrix from "./Matrix.js";

class Drawable
{
    constructor(vertexBuffer, vertexIndices, material)
    {
        this.gl = Webgl.getGL();
        this.vertexArray = new VertexArray();
        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = new IndexBuffer(vertexIndices);
        this.material = material;
        this.modelMatrix = new Matrix();
        //this.transform = new Transform();

        // Bind indexBuffer Data to vertexArray
        this.positionLocation = material.shader.getAttribLocation("aPosition");
        this.vertexArray.addBuffer(this.vertexBuffer, [this.positionLocation], 0)

        material.setAttribLocationInVertexArray(this.vertexArray);
    }

    draw()
    {
        this.material.bind();
        this.vertexArray.bind();
        this.indexBuffer.bind();
        this.gl.drawElements(this.gl.TRIANGLES, this.indexBuffer.count, this.gl.UNSIGNED_SHORT, 0);
    }

    delete()
    {
        this.material.delete();
        this.indexBuffer.delete();
    }

}
export default Drawable;