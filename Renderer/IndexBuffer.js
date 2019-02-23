import Webgl from "./Webgl.js";

class IndexBuffer
{
    constructor(data) 
    {
        const gl = this.gl = Webgl.getGL();
        this.data = data;
        this.count = data.length;
        this.buffer = this.initBuffer(data);
    }

    initBuffer(data) 
    {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.gl.bufferData(
            this.gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(data),
            this.gl.STATIC_DRAW);
        
        return buffer;
    }

    delete() 
    {
        this.gl.deleteBuffer(this.buffer);
    }

    bind() 
    {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    }
}

export default IndexBuffer;