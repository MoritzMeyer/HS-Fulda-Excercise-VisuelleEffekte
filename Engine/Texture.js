import Material from "./Material.js";
import Webgl from "./Webgl.js";

class Texture extends Material
{
    constructor(shader, url, slot, texCoordsBuffer, alpha = 1.0, attributeTexCoordsName = "aTexCoords", uniformName="uTexture")
    {
        super(shader, [0.8, 0.8, 0.8], [0.8, 0.8, 0.8], [1.0, 1.0, 1.0], 32.0, alpha, uniformName);
        const gl = this.gl = Webgl.getGL();
        this.url = url;
        this.slot = slot;
        this.texture = this.gl.createTexture();
        this.texCoords = texCoordsBuffer;
        this.attributeName = attributeTexCoordsName;
        this.isTexture = true;

        // define texture data
        const level = 0;
        const internalFormat = this.gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = this.gl.RGBA;
        const srcType = this.gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([248, 24, 148, 255]);  // opaque pink

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

        // Fill image with color pink, which is shown if texture image couldn't be loaded
        this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat,
            width, height, border, srcFormat, srcType,
            pixel);

        // load Image asynchronous
        this.image = new Image();
        this.image.src = this.url;
        this.image.crossOrigin = "";
        this.image.addEventListener('load', () =>
        {
            console.log(this.image);
            console.log(this.texture);

            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, this.image);

            // Webgl has different requirements for power of 2 images vs non power of 2 images
            // so check if the image is a power of 2 in both dimensions.
            if (Texture.isPowerOf2(this.image.width) && Texture.isPowerOf2(this.image.height))
            {
                // Yes, it's a power of 2. Generate mips.
                this.gl.generateMipmap(this.gl.TEXTURE_2D);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
            }
            else
            {
                // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            }

            this.loaded = true;
        });

        this.image.addEventListener('error', (event) =>
        {
            console.error("Error while loading Texture-Image from url: '" + this.url);
            console.log(event);
        });
    }

    bind()
    {
        super.bind();
        this.gl.activeTexture(this.gl.TEXTURE0 + this.slot);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.shader.setUniform1i(this.uniformName, this.slot);

        /*
        if (!this.shader.hasLightning)
        {
            this.gl.activeTexture(this.gl.TEXTURE0 + this.slot);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.shader.setUniform1i(this.uniformName, this.slot);
        }
        else
        {
            this.shader.setUniform3f("material.ambient", this.ambient[0], this.ambient[1], this.ambient[2]);
            this.shader.setUniform1i("material.specular", this.slot);
            this.shader.setUniform1f("material.shininess", this.slot);
            this.shader.setUniform1i("material.diffuse", this.slot);
            this.gl.activeTexture(this.gl.TEXTURE0 + this.slot);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        }
        */
    }

    setAttribLocationInVertexArray(vertexArray)
    {
        let attribLocation = this.shader.getAttribLocation(this.attributeName);
        vertexArray.addBuffer(this.texCoords, [attribLocation], 0);
    }

    // check if value is power of 2
    static isPowerOf2(value)
    {
        return (value & (value - 1)) == 0;
    }
}

export default Texture;