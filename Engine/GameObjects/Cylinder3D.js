import VertexBuffer from "../VertexBuffer.js";
import IndexBuffer from "../IndexBuffer.js";
import GameObject from "../GameObject.js";
import Color from "../Color.js";
import Shader from "../Shader.js";

class Cylinder3D
{

    constructor(material, radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
    {
        this.radiusTop = radiusTop !== undefined ? radiusTop : 1;
        this.radiusBottom = radiusBottom !== undefined ? radiusBottom : 1;
        this.height = height || 1;
        this.radialSegments = Math.floor( radialSegments ) || 8;
        this.heightSegments = Math.floor( heightSegments ) || 1;
        this.openEnded = openEnded !== undefined ? openEnded : false;
        this.thetaStart = thetaStart !== undefined ? thetaStart : 0.0;
        this.thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;
        this.material = material !== undefined ? material : new Color("uObjectColor", Shader.getDefaultColorShader(false), [0.0, 0.0, 0.8]);

        let data = Cylinder3D.calcConeData(this.radiusTop, this.radiusBottom, this.height, this.radialSegments, this.heightSegments, this.openEnded, this.thetaStart, this.thetaLength);

        let vertexBuffer = new VertexBuffer(data.vertices, 3);
        let indexBuffer = new IndexBuffer(data.indices, 3);
        let normalsBuffer = new VertexBuffer(data.normals, 3);

        this.gameObject = new GameObject(vertexBuffer, indexBuffer, this.material, false, normalsBuffer);
    }

    setMaterial(material)
    {
        this.material = material;
        this.gameObject.material = material;
    }

    /*
    static calcConeData()
    {
        let pt = [], nt = [];
        let Phi = 0, dPhi = 2*Math.PI / (nPhi-1),
            Nx = r1 - r2, Ny = h, N = Math.sqrt(Nx*Nx + Ny*Ny);
        Nx /= N; Ny /= N;
        for (let i = 0; i < nPhi; i++ ){
            let cosPhi = Math.cos( Phi );
            let sinPhi = Math.sin( Phi );
            let cosPhi2 = Math.cos( Phi + dPhi/2 );
            let sinPhi2 = Math.sin( Phi + dPhi/2 );
            pt.push ( -h/2, cosPhi * r1, sinPhi * r1 );   // points
            nt.push ( Nx, Ny*cosPhi, Ny*sinPhi );         // normals
            pt.push ( h/2, cosPhi2 * r2, sinPhi2 * r2 );  // points
            nt.push ( Nx, Ny*cosPhi2, Ny*sinPhi2 );       // normals
            Phi   += dPhi;

        //return {"vertices": }
    }
    */

    static calcConeData(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
    {
        let indices = [];
        let vertices = [];
        let normals = [];
        let uvs = [];

        let index = 0;
        let indexArray = [];
        let halfHeight = height / 2;

        generateTorso();

        if ( openEnded === false ) {

            if ( radiusTop > 0 ) generateCap( true );
            if ( radiusBottom > 0 ) generateCap( false );
        }

        return {"vertices": vertices, "indices": indices, "normals": normals, "uvs": uvs};


        function generateTorso()
        {
            let x, y;
            let normal = vec3.create();
            let vertex = vec3.create();

            // this will be used to calculate the normal
            let slope = ( radiusBottom - radiusTop ) / height;

            // generate vertices, normals and uvs
            for (y = 0; y <= heightSegments; y++ ) {

                let indexRow = [];
                let v = y / heightSegments;

                // calculate the radius of the current row
                let radius = v * ( radiusBottom - radiusTop ) + radiusTop;
                for ( x = 0; x <= radialSegments; x ++ ) {

                    let u = x / radialSegments;

                    let theta = u * thetaLength + thetaStart;
                    let sinTheta = Math.sin( theta );
                    let cosTheta = Math.cos( theta );

                    // vertex
                    vertex.x = radius * sinTheta;
                    vertex.y = - v * height + halfHeight;
                    vertex.z = radius * cosTheta;
                    vertices.push( vertex.x, vertex.y, vertex.z );

                    // normal
                    vec3.set(normal, sinTheta, slope, cosTheta );
                    vec3.normalize(normal, normal);
                    normals.push( normal.x, normal.y, normal.z );

                    // uv
                    uvs.push( u, 1 - v );

                    // save index of vertex in respective row
                    indexRow.push( index ++ );
                }

                // now save vertices of the row in our index array
                indexArray.push( indexRow );
            }

            // generate indices
            for ( x = 0; x < radialSegments; x ++ ) {
                for ( y = 0; y < heightSegments; y ++ ) {

                    // we use the index array to access the correct indices
                    let a = indexArray[ y ][ x ];
                    let b = indexArray[ y + 1 ][ x ];
                    let c = indexArray[ y + 1 ][ x + 1 ];
                    let d = indexArray[ y ][ x + 1 ];

                    // faces
                    indices.push( a, b, d );
                    indices.push( b, c, d );
                }
            }
        }

        function generateCap( top ) {

            let x, centerIndexStart, centerIndexEnd;
            let uv = vec2.create();
            let vertex = vec3.create();

            let radius = ( top === true ) ? radiusTop : radiusBottom;
            let sign = ( top === true ) ? 1 : - 1;

            // save the index of the first center vertex
            centerIndexStart = index;

            // first we generate the center vertex data of the cap.
            // because the geometry needs one set of uvs per face,
            // we must generate a center vertex per face/segment
            for ( x = 1; x <= radialSegments; x ++ ) {

                // vertex
                vertices.push( 0, halfHeight * sign, 0 );

                // normal
                normals.push( 0, sign, 0 );

                // uv
                uvs.push( 0.5, 0.5 );

                // increase index
                index ++;
            }

            // save the index of the last center vertex
            centerIndexEnd = index;

            // now we generate the surrounding vertices, normals and uvs
            for ( x = 0; x <= radialSegments; x ++ ) {

                let u = x / radialSegments;
                let theta = u * thetaLength + thetaStart;

                let cosTheta = Math.cos( theta );
                let sinTheta = Math.sin( theta );

                // vertex
                vertex.x = radius * sinTheta;
                vertex.y = halfHeight * sign;
                vertex.z = radius * cosTheta;
                vertices.push( vertex.x, vertex.y, vertex.z );

                // normal
                normals.push( 0, sign, 0 );

                // uv
                uv.x = ( cosTheta * 0.5 ) + 0.5;
                uv.y = ( sinTheta * 0.5 * sign ) + 0.5;
                uvs.push( uv.x, uv.y );

                // increase index
                index ++;
            }

            // generate indices
            for ( x = 0; x < radialSegments; x ++ )
            {
                let c = centerIndexStart + x;
                let i = centerIndexEnd + x;

                if ( top === true )
                {
                    // face top
                    indices.push( i, i + 1, c );
                } else
                {
                    // face bottom
                    indices.push( i + 1, i, c );
                }
            }
        }
    }
}
export default Cylinder3D;