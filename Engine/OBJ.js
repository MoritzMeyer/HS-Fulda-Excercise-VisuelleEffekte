import VertexBuffer from "./VertexBuffer.js";
import GameObject from "./GameObject.js";
import Color from "./Color.js";
import Texture from "./Texture.js";

class OBJ
{
    constructor(filePath, scale, shader, textureFile = null)
    {
        this.shader = shader;
        this.isLoaded = false;

        let objDataRequest = new XMLHttpRequest();
        objDataRequest.open('GET', filePath, true);
        objDataRequest.send();

        objDataRequest.onload = () =>
        {
            let objDoc = new OBJDoc(filePath);

            if (!objDoc.parse(objDataRequest.responseText, scale, true))
            {
                console.error("OBJ file parsing error: " + filePath);
                return;
            }

            let drawingInfo = objDoc.getDrawingInfo();
            console.log(drawingInfo);

            let vertexBuffer = new VertexBuffer(drawingInfo.positions, 3);
            let vertexBufferNormals = null;

            if (drawingInfo.normals && drawingInfo.normals.length > 0)
            {
                vertexBufferNormals = new VertexBuffer(drawingInfo.normals, 3);
            }
            else
            {
                console.log("No normals given for '" + filePath + "'.");
            }


            if (!textureFile && !drawingInfo.textureName)
            {
                let color = new Color("uObjectColor", shader, [248, 24, 148]);
                this.gameObject = new GameObject(vertexBuffer, drawingInfo.indices, color, false, vertexBufferNormals);
            }
            else
            {
                if (!textureFile)
                {
                    textureFile = drawingInfo.textureName;
                }

                let texCoordsBuffer = new VertexBuffer(drawingInfo.texCoords, 2);
                let texture = new Texture("uTexture", shader, textureFile, 0, texCoordsBuffer, "aTexCoords");
                this.gameObject = new GameObject(vertexBuffer, drawingInfo.indices, texture, false, vertexBufferNormals);
            }

            this.isLoaded = true;
        }
    }

    checkLoaded(func)
    {
        if (!this.isLoaded)
        {
            window.setTimeout(() => this.checkLoaded(func), 100);
        }
        else
        {
            func();
        }
    }
}
export default OBJ;