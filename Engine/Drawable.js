import VertexArray from "./VertexArray.js";
import IndexBuffer from "./IndexBuffer.js";
import Webgl from "./Webgl.js";
import Transform from "./Transform.js";

class Drawable
{
    constructor(vertexBuffer, vertexIndices, material)
    {
        this.gl = Webgl.getGL();
        this.vertexBuffer = vertexBuffer;
        this.vertexArray = new VertexArray();
        this.indexBuffer = new IndexBuffer(vertexIndices);
        this.material = material;
        this.transform = new Transform();

        // Bind indexBuffer Data to vertexArray
        this.positionLocation = material.shader.getAttribLocation("aPosition");
        this.vertexArray.addBuffer(this.vertexBuffer, [this.positionLocation], 0);

        material.setAttribLocationInVertexArray(this.vertexArray);
    }

    draw()
    {
        this.material.bind();
        this.material.shader.setUniformMatrix4fv("uModelMatrix", false, this.transform.modelMatrix.matrix);

        this.vertexArray.bind();
        this.indexBuffer.bind();
        this.gl.drawElements(this.gl.TRIANGLES, this.indexBuffer.count, this.gl.UNSIGNED_SHORT, 0);
    }

    setMaterial(material)
    {
        this.material = material;
        this.vertexArray = new VertexArray();
        this.vertexArray.addBuffer(this.vertexBuffer, [this.positionLocation], 0);
        material.setAttribLocationInVertexArray(this.vertexArray);
    }

    delete()
    {
        this.material.delete();
        this.indexBuffer.delete();
    }

}
export default Drawable;