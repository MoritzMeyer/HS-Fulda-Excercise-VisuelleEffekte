import Webgl from "./Webgl.js";

class VertexBuffer
{
    constructor(data, indexSize)
    {
        const gl = this.gl = Webgl.getGL();
        this.data = data;
        this.indexSize = indexSize;
        this.buffer = this.initBuffer(data);
    }

    initBuffer(data) 
    {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(data),
            this.gl.STATIC_DRAW);
        
        return buffer;
    }

    delete() 
    {        
        this.gl.deleteBuffer(this.buffer);
    }

    bind() 
    {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    }
}

export default VertexBuffer;