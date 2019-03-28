import RenderObject from "../RenderObject.js";
import VertexBuffer from "../VertexBuffer.js";
import GameObject from "../GameObject.js";
import Color from "../Color.js";
import Shader from "../Shader.js";
import PBRTexture from "../PBRTexture.js";

const positions =
    [
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
        1.0,  1.0,  1.0,
        1.0,  1.0, -1.0,
    ];

const indices = [
    0,  1,  2,      0,  2,  3
];

const normals = [
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0
];

const textureCoordinates = [
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
];

const colors = [0.7, 0.0, 0.0];

class Plane extends RenderObject
{
    constructor(material)
    {
        if (!material)
        {
            const shader = Shader.getDefaultColorShader(false);
            material = new Color(shader, colors);
        }

        if (material.isTexture)
        {
            const vertexBufferTexCoords = new VertexBuffer(textureCoordinates, 2);
            material.setTextureCoords(vertexBufferTexCoords);
        }

        const vertexBuffer = new VertexBuffer(positions, 3);
        const vertexBufferNormals = new VertexBuffer(normals, 3);
        const gameObject = new GameObject(vertexBuffer, indices, material, false, vertexBufferNormals);
        super(positions, indices, gameObject);
    }

    static getMahogFloor(numberOfLights)
    {
        let albedoPath = "./PBR_Materials/mahogfloor/mahogfloor_basecolor.png";
        let metallicPath = "./PBR_Materials/mahogfloor/mahogfloor_Height.png";
        let roughnessPath = "./PBR_Materials/mahogfloor/mahogfloor_roughness.png";
        let normalPath = "./PBR_Materials/mahogfloor/mahogfloor_normal.png";
        let ambientOcclusionPath = "./PBR_Materials/mahogfloor/mahogfloor_AO.png";

        return new Plane(new PBRTexture(Shader.getCookTorranceTexturePBR(numberOfLights), albedoPath, metallicPath, roughnessPath, ambientOcclusionPath, normalPath));
    }
}
export default Plane;
