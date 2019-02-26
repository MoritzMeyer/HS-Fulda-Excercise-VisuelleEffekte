import VertexArray from "./VertexArray.js";
import IndexBuffer from "./IndexBuffer.js";
import Webgl from "./Webgl.js";
import Transform from "./Transform.js";

class GameObject
{
    constructor(vertexBuffer, vertexIndices, material, isEmpty = false)
    {
        this.gl = Webgl.getGL();
        this.transform = new Transform();
        this.isEmpty = isEmpty;
        this.childs = [];
        this.parent = null;

        if (isEmpty)
        {
            this.vertexBuffer = function() {throw new Error("Empty GameObject doesn't contain a vertexBuffer")};
            this.vertexArray = function () {throw new Error("Empty GameObject doesn't contain a vertexBuffer")};
            this.indexBuffer = function() {throw new Error("Empty GameObject doesn't contain a vertexBuffer")};
            this.material = function () {throw new Error("Empty GameObject doesn't contain a vertexBuffer")};
        }
        else
        {
            this.vertexBuffer = vertexBuffer;
            this.vertexArray = new VertexArray();
            this.indexBuffer = new IndexBuffer(vertexIndices);
            this.material = material;

            // Bind indexBuffer Data to vertexArray
            this.positionLocation = material.shader.getAttribLocation("aPosition");
            this.vertexArray.addBuffer(this.vertexBuffer, [this.positionLocation], 0);

            material.setAttribLocationInVertexArray(this.vertexArray);
        }
    }

    draw(camera)
    {
        if (!this.isEmpty)
        {
            this.material.bind();
            camera.applyViewProjectionMatricesToShader(this.material.shader);
            this.material.shader.setUniformMatrix4fv("uModelMatrix", false, this.transform.getWorldSpaceMatrix());
            this.vertexArray.bind();
            this.indexBuffer.bind();
            this.gl.drawElements(this.gl.TRIANGLES, this.indexBuffer.count, this.gl.UNSIGNED_SHORT, 0);
        }
        this.childs.forEach(child => child.draw(camera));
    }

    setParent(parent)
    {
        this.transform.setParent(parent.transform);
        this.parent = parent;
        this.parent.childs.push(this);
    }

    addChild(child)
    {
        this.transform.addChild(child.transform);
        this.childs.push(child);
        child.parent = this;
    }

    /*
    setMaterial(material)
    {
        this.material = material;
        this.vertexArray = new VertexArray();
        this.vertexArray.addBuffer(this.vertexBuffer, [this.positionLocation], 0);
        material.setAttribLocationInVertexArray(this.vertexArray);
    }
    */

    delete()
    {
        if (!this.isEmpty)
        {
            this.material.delete();
            this.indexBuffer.delete();
        }
    }

    static createEmpty()
    {
        return new GameObject(null, null, null, true);
    }
}
export default GameObject;