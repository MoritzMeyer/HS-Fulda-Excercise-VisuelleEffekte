import RenderObject from "../RenderObject.js";
import VertexBuffer from "../VertexBuffer.js";
import GameObject from "../GameObject.js";
import Color from "../Color.js";
import Shader from "../Shader.js";

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

const colors = [0.7, 0.0, 0.0];

class Plane extends RenderObject
{
    constructor(material)
    {
        if (!material)
        {
            const shader = Shader.getDefaultColorShader();
            material = new Color("uObjectColor", shader, colors);
        }

        const vertexBuffer = new VertexBuffer(positions, 3);
        const vertexBufferNormals = new VertexBuffer(normals, 3);
        const gameObject = new GameObject(vertexBuffer, indices, material, false, vertexBufferNormals);
        super(positions, indices, gameObject);
    }
}
export default Plane;
