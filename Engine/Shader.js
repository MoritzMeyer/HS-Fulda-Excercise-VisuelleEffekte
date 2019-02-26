import Webgl from "./Webgl.js";

const vsColorSource =
    `
    attribute vec3 aPosition;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    void main() {
        gl_PointSize = 10.0;
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
    }
`;

const fsColorSource =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    uniform vec4 uColor;
    void main() {
        gl_FragColor = vec4(uColor);
}`;

const vsTextureSource =
    `
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    varying vec2 vTexCoord;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    void main() {
        vTexCoord = aTexCoord;
        gl_PointSize = 10.0;
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
    }
`;

const fsTextureSource =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    varying vec2 vTexCoord;
    uniform sampler2D uTexture;
    void main() {
        gl_FragColor = texture2D(uTexture, vTexCoord);
}`;

class Shader
{
    constructor(vsSource, fsSource)
    {
        const gl = this.gl = Webgl.getGL();
        this.locations = [];
        this.vertexShader = Shader.loadShader("vertex", vsSource);
        this.fragmentShader = Shader.loadShader("fragment", fsSource);
        
        //console.log("VertexShader: ", this.vertexShader);
        //console.log("FragmentShader: ", this.fragmentShader);

        // Create the shader program
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, this.vertexShader);
        this.gl.attachShader(this.program, this.fragmentShader);

        // link shader
        this.gl.linkProgram(this.program);
        // if creating the shader program failed, alert
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS))
        {
            alert("Unable to initialize the shader program: " + this.gl.getProgramInfoLog(this.program));
        }
    }

    bind() 
    {
        this.gl.useProgram(this.program);
    }

    delete()
    {
        this.gl.detachShader(this.program, this.vertexShader);
        this.gl.detachShader(this.program, this.fragmentShader);
        this.gl.deleteShader(this.vertexShader);
        this.gl.deleteShader(this.fragmentShader);
        this.gl.deleteProgram(this.program);
    }
    
    getAttribLocation(name)
    {
        let attribLocation = this.gl.getAttribLocation(this.program, name);

        // if location couldn't be found
        if (!attribLocation == undefined)
        {
            console.error("Shader-Attribut '" + name + "' could not be found.");
            return null;
        }

        return attribLocation;
    }

    getUniformLocation(name)
    {
        let uniformLocation = this.locations.find(location => location.key == name);

        // if location couldn't be found, create it
        if (!uniformLocation) 
        {
            let location = this.gl.getUniformLocation(this.program, name);

            if (!location) 
            {
                console.error("Shader-UniformLocation '" + name + "' could not be found.");
                //return null;
            }

            this.locations.push({key: name, value: location});

            return location;
        }

        return uniformLocation.value;
    }

    setUniform1i(name, value)
    {
        this.gl.uniform1i(this.getUniformLocation(name), value);
    }

    setUniform3f(name, v0, v1, v2) 
    {
        this.gl.uniform3f(this.getUniformLocation(name), v0, v1, v2);
    }

    setUniform4f(name, v0, v1, v2, v3)
    {
        this.gl.uniform4f(this.getUniformLocation(name), v0, v1, v2, v3);
    }

    setUniformMatrix4fv(name, transpose, matrix)
    {
        this.gl.uniformMatrix4fv(this.getUniformLocation(name), transpose, matrix);
    }

    static loadShader(type, source)
    {
        const gl = this.gl = Webgl.getGL();
        var shader = null;

        switch(type) 
        {
            case "vertex":
                shader = this.gl.createShader(this.gl.VERTEX_SHADER);
                break;
            case "fragment":
                shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
                break;
            default:
                return null;
        }

        // send the source to the shader object
        this.gl.shaderSource(shader, source);

        // compile the shader program
        this.gl.compileShader(shader);

        // See if it compiled successfully
        if (!this.gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        {
            console.error("An error ocurred compiling " + type + " shader: " + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    static getDefaultColorShader()
    {
        return new Shader(vsColorSource, fsColorSource);
    }

    static getDefaultTextureShader()
    {
        return new Shader(vsTextureSource, fsTextureSource);
    }
}

export default Shader;