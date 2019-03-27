import RenderObject from "../RenderObject.js";
import Shader from "../Shader.js";
import Color from "../Color.js";
import VertexBuffer from "../VertexBuffer.js";
import GameObject from "../GameObject.js";

const colors = [0.0, 0.0, 0.8];

class Sphere3D extends RenderObject
{
    constructor(material, sphereDiv = 18)
    {
        if (!material)
        {
            const shader = Shader.getDefaultColorShader(false);
            material = new Color(shader, colors);
        }

        let rawData = Sphere3D.CalcSphereData(sphereDiv);

        const vertexBuffer = new VertexBuffer(rawData["vertices"], 3);
        const normalsBuffer = new VertexBuffer(rawData["normals"], 3);
        const gameObject = new GameObject(vertexBuffer, rawData["indices"], material, false, normalsBuffer);
        super(rawData["vertices"], rawData["indices"], gameObject);
    }

    static CalcSphereData(sphereDiv)
    {
        let SPHERE_DIV = sphereDiv;
        let i, ai, si, ci;
        let j, aj, sj, cj;
        let x, y, z;
        let p1, p2;
        let vertices = [],indices = [], normals = [];

        // calc vertices
        for (j = 0; j <= SPHERE_DIV; j++)
        {
            aj = j * Math.PI / SPHERE_DIV;
            sj = Math.sin(aj);
            cj = Math.cos(aj);
            for (i = 0; i <= SPHERE_DIV; i++)
            {
                ai = i * 2 * Math.PI / SPHERE_DIV;
                si = Math.sin(ai);
                ci = Math.cos(ai);

                x = si * sj;   // x
                y = cj;        // y
                z = ci * sj;   // z

                vertices.push(x);
                vertices.push(y);
                vertices.push(z);

                // calc normal
                let vertex = vec3.fromValues(x, y, z);
                let normal = vec3.create();
                //vec3.negate(vertex, vertex);
                vec3.normalize(normal, vertex);

                normals.push(normal[0]);
                normals.push(normal[1]);
                normals.push(normal[2]);
            }
        }

        // calc indices
        for (j = 0; j < SPHERE_DIV; j++)
        {
            for (i = 0; i < SPHERE_DIV; i++)
            {
                p1 = j * (SPHERE_DIV+1) + i;
                p2 = p1 + (SPHERE_DIV+1);
                indices.push(p1);
                indices.push(p2);
                indices.push(p1 + 1);
                indices.push(p1 + 1);
                indices.push(p2);
                indices.push(p2 + 1);
            }
        }

        return {"vertices": vertices, "indices" : indices, "normals": normals};
    }
}
export default Sphere3D;