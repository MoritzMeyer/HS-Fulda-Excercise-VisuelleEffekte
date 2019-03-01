import VertexArray from "./VertexArray.js";
import IndexBuffer from "./IndexBuffer.js";
import Webgl from "./Webgl.js";
import Transform from "./Transform.js";

class GameObject
{
    constructor(vertexBuffer, vertexIndices, material, isEmpty = false, vertexBufferNormals = null)
    {
        this.gl = Webgl.getGL();
        this.transform = new Transform();
        this.isEmpty = isEmpty;
        this.childs = [];
        this.parent = null;

        if (isEmpty)
        {
            this.vertexBuffer = function() {throw new Error("Empty GameObject doesn't contain a vertexBuffer")};
            this.vertexBufferNormals = function() {throw new Error("Empty GameObject doesn't contain a vertexBuffer")};
            this.vertexArray = function () {throw new Error("Empty GameObject doesn't contain a vertexBuffer")};
            this.indexBuffer = function() {throw new Error("Empty GameObject doesn't contain a vertexBuffer")};
            this.material = function () {throw new Error("Empty GameObject doesn't contain a vertexBuffer")};
        }
        else
        {
            this.vertexBuffer = vertexBuffer;
            this.vertexBufferNormals = vertexBufferNormals;
            this.vertexArray = new VertexArray();
            this.indexBuffer = new IndexBuffer(vertexIndices);
            this.material = material;

            // Bind indexBuffer Data to vertexArray
            this.positionLocation = material.shader.getAttribLocation("aPosition");
            this.vertexArray.addBuffer(this.vertexBuffer, [this.positionLocation], 0);

            if (vertexBufferNormals && this.material.shader.hasLightning)
            {
                this.normalLocation = material.shader.getAttribLocation("aNormal");
                this.vertexArray.addBuffer(this.vertexBufferNormals, [this.normalLocation], 0);
            }

            material.setAttribLocationInVertexArray(this.vertexArray);
        }
    }

    draw()
    {
        if (!this.isEmpty)
        {
            this.material.shader.bind();
            this.vertexArray.bind();
            this.indexBuffer.bind();
            this.gl.drawElements(this.gl.TRIANGLES, this.indexBuffer.count, this.gl.UNSIGNED_SHORT, 0);
        }
    }

    getModelViewMatrix(camera)
    {
        let modelViewMatrix = mat4.create();
        mat4.multiply(modelViewMatrix, camera.getViewMatrix(), this.transform.getWorldSpaceMatrix());
        return modelViewMatrix;
    }

    getNormalMatrix()
    {
        //let modelViewMatrix = this.getModelViewMatrix(camera);
        let normalMatrix = mat4.create();
        mat4.invert(normalMatrix, this.transform.getWorldSpaceMatrix());
        mat4.transpose(normalMatrix, normalMatrix);

        return normalMatrix;
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