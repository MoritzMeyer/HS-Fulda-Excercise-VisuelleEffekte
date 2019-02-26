import RenderObject from "../RenderObject.js";
import Shader from "../Shader.js";
import Color from "../Color.js";
import VertexBuffer from "../VertexBuffer.js";
import GameObject from "../GameObject.js";

const colors = [0.0, 0.0, 0.8, 1.0];

class Sphere3D extends RenderObject
{
    constructor(material)
    {
        if (!material)
        {
            const shader = Shader.getDefaultColorShader();
            material = new Color("uColor", shader, colors);
        }

        let rawData = Sphere3D.CalcSphereData(18);

        const vertexBuffer = new VertexBuffer(rawData["vertices"], 3);
        const gameObject = new GameObject(vertexBuffer, rawData["indices"], material);
        super(rawData["vertices"], rawData["indices"], gameObject);
    }

    static CalcSphereData(sphereDiv)
    {
        let SPHERE_DIV = sphereDiv;
        let i, ai, si, ci;
        let j, aj, sj, cj;
        let p1, p2;
        let vertices = [],indices = [];

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
                vertices.push(si * sj);  // X
                vertices.push(cj);       // Y
                vertices.push(ci * sj);  // Z
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

        return {"vertices": vertices, "indices" : indices};
    }
}
export default Sphere3D;