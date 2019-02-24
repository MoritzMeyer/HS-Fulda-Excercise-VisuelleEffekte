import Webgl from "./Webgl.js";

class VertexArray
{
    constructor() 
    {
        const gl = this.gl = Webgl.getGL();
        this.VertexArray = this.gl.createVertexArray();
    }

    bind()
    {
        this.gl.bindVertexArray(this.VertexArray);
    }

    addBuffer(vertexBuffer, attribLocations, stride)
    {
        this.bind();
        vertexBuffer.bind();

        let offset = 0;
        for (let i = 0; i < attribLocations.length; i++)
        {
            let attribLocation = attribLocations[i];

            // enable Attribute to use it within the next step
            this.gl.enableVertexAttribArray(attribLocation);

            // tell webgl how to take data out of positionBuffer for this attribute
            this.gl.vertexAttribPointer(attribLocation, vertexBuffer.indexSize, this.gl.FLOAT, false, stride, 0);

            // set offset for the next element
            offset += attribLocation.count * 4;
        }
    }
}

export default VertexArray;