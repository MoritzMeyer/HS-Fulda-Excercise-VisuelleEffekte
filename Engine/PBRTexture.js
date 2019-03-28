import MaterialPBR from "./MaterialPBR.js";
import Webgl from "./Webgl.js";
import VertexBuffer from "./VertexBuffer.js";

class PBRTexture
{
    constructor(shader, albedoPath, metallicPath, roughnessPath, ambientOcclusionPath, normalPath, texCoordsBuffer = null, alpha = 1.0, uniformName = "material")
    {
        this.gl = Webgl.getGL();
        this.uniformName = uniformName;
        this.shader = shader;
        this.alpha = alpha;
        this.isTexture = true;
        this.texCoordsBuffer = texCoordsBuffer;
        this.attributeName = "aTexCoords";

        this.albedoSlot = 0;
        this.metallicSlot = 1;
        this.roughnessSlot = 2;
        this.ambientOcclusionSlot = 3;
        this.normalSlot = 4;

        this.albedoLoaded = false;
        this.metallicLoaded = false;
        this.roughnessLoaded = false;
        this.ambientOcclusionLoaded = false;
        this.normalLoaded = false;

        this.loaded = () => { return this.albedoLoaded && this.roughnessLoaded && this.metallicLoaded && this.ambientOcclusionLoaded && this.normalLoaded };

        this.albedo = this.loadTexture(albedoPath, this.albedoLoaded);
        this.metallic = this.loadTexture(metallicPath, this.metallicLoaded);
        this.roughness = this.loadTexture(roughnessPath, this.roughnessLoaded);
        this.ambientOcclusion = this.loadTexture(ambientOcclusionPath, this.ambientOcclusionLoaded);
        this.normal = this.loadTexture(normalPath, this.normalLoaded);
    }

    loadTexture(path, loaded)
    {
        // define texture data
        const level = 0;
        const internalFormat = this.gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = this.gl.RGBA;
        const srcType = this.gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([248, 24, 148, 255]);  // opaque pink

        let texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        // Fill image with color pink, which is shown if texture image couldn't be loaded
        this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat,
            width, height, border, srcFormat, srcType,
            pixel);

        // load Image asynchronous
        let image = new Image();
        image.src = path;
        image.crossOrigin = "";
        image.addEventListener('load', () => {
            console.log(image);
            console.log(texture);

            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

            if (PBRTexture.isPowerOf2(image.width) && PBRTexture.isPowerOf2(image.height))
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

            loaded = true;
        });

        image.addEventListener('error', (event) =>
        {
            console.error("Error while loading Texture-Image from url: '" + path);
            console.log(event);
        });

        return texture;
    }

    bind()
    {
        this.shader.bind();
        this.shader.setUniform1f("uAlpha", this.alpha);
        this.bindTexture(this.albedo, "albedoMap", this.albedoSlot);
        this.bindTexture(this.metallic, "metallicMap", this.metallicSlot);
        this.bindTexture(this.roughness, "roughnessMap", this.roughnessSlot);
        this.bindTexture(this.ambientOcclusion, "aoMap", this.ambientOcclusionSlot);
        this.bindTexture(this.normal, "normalMap", this.normalSlot);
    }

    bindTexture(texture, name, slot)
    {
        this.gl.activeTexture(this.gl.TEXTURE0 + slot);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.shader.setUniform1i(this.uniformName + "." + name, slot);
    }

    setTextureCoords(texCoordsBuffer)
    {
        this.texCoordsBuffer = texCoordsBuffer;
    }

    setAttribLocationInVertexArray(vertexArray)
    {
        if (this.texCoordsBuffer != null)
        {
            let attribLocation = this.shader.getAttribLocation(this.attributeName);
            vertexArray.addBuffer(this.texCoordsBuffer, [attribLocation], 0);
        }
        else
        {
            throw "TexCoordsBuffer wasn't set yet.";
        }
    }

    // check if value is power of 2
    static isPowerOf2(value)
    {
        return (value & (value - 1)) == 0;
    }
}
export default PBRTexture;