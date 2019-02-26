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
    uniform vec3 uObjectColor;
    void main() {
        gl_FragColor = vec4(uObjectColor, 1.0);
    }
`;

const vsTextureSource =
`
    attribute vec3 aPosition;
    attribute vec2 aTexCoords;
    varying vec2 vTexCoords;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    void main() {
        vTexCoords = aTexCoords;
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
    varying vec2 vTexCoords;
    uniform sampler2D uTexture;
    void main() {
        gl_FragColor = texture2D(uTexture, vTexCoords);
    }
`;

const vsColorWithLightningSource =
`
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    
    varying vec3 vFragPos;
    varying vec3 vNormal;
    
    void main() {
        gl_PointSize = 10.0;
        
        vFragPos = vec3(uModelMatrix * vec4(aPosition, 1.0));
        // mat4 normalMatrix = mat4(transpose(inverse(uModelMatrix)));
        vNormal = vec3(uNormalMatrix * vec4(aNormal, 0.0));
        //vNormal = mat3(transpose(inverse(uModelMatrix))) * aNormal;
        
        gl_Position = uProjectionMatrix * uViewMatrix * vec4(vFragPos, 1.0);
    }        
`;

const fsColorWithLightningSource =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    
    varying vec3 vFragPos;
    varying vec3 vNormal;
    
    //uniform float uAmbientStrength;
    uniform vec3 uLightPosition;
    uniform vec3 uViewPosition;
    uniform vec3 uLightColor;
    uniform vec3 uObjectColor;
    
    void main() {
        // ambient
        float ambientStrength = 1.0;
        vec3 ambient = ambientStrength * uLightColor;
        
        // diffuse
        vec3 normal = normalize(vNormal);
        //vec3 normalizedFragPos = normalize(vFragPos);
        //vec3 normalizedLightPos = normalize(uLightPosition);
        vec3 lightDirection = normalize(uLightPosition - vFragPos);
        float diff = max(dot(normal, lightDirection), 0.0);
        vec3 diffuse =  diff * uLightColor;
        
        // sepcular
        float specularStrength = 0.5;
        vec3 viewDir = normalize(uViewPosition - vFragPos);
        vec3 reflectDir = reflect(-lightDirection, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 16.0);
        vec3 specular = specularStrength * spec * uLightColor;
        
        vec3 result = (ambient + diffuse + specular) * uObjectColor;
        gl_FragColor = vec4(result, 1.0);
    }
`;

const vsTest =
    `
        attribute vec3 aPosition;
        attribute vec3 aNormal;
        uniform mat4 uProjectionMatrix, uModelViewMatrix, uNormalMatrix;
        uniform vec3 uLightPosition;
        uniform vec3 uLightColor;
        varying vec3 vColor;
        
        varying vec3 normalInterp;
        varying vec3 vertPos;
        
        
        void main() {
            float Ka = 1.0;
            float Kd = 1.0;
            float Ks = 1.0;
            float shininessVal = 80.0;
            
            vec4 vertPos4 = uModelViewMatrix * vec4(aPosition, 1.0);
            vertPos = vec3(vertPos4) / vertPos4.w;
            normalInterp = vec3(uNormalMatrix * vec4(aNormal, 0.0));
            gl_Position = uProjectionMatrix * vertPos4;
            
            vec3 N = normalize(normalInterp);
            vec3 L = normalize(uLightPosition - vertPos);
            
            // Lambert's cosine law
            float lambertian = max(dot(N, L), 0.0);
            float specular = 0.0;
            if(lambertian > 0.0) {
                vec3 R = reflect(-L, N);      // Reflected light vector
                vec3 V = normalize(-vertPos); // Vector to viewer
                // Compute the specular term
                float specAngle = max(dot(R, V), 0.0);
                specular = pow(specAngle, shininessVal);
            }  
            
            vColor = vec3(Ka * uLightColor + Kd * lambertian * uLightColor + Ks * specular * uLightColor);
        }
    `;

const fsTest =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    
    uniform vec3 uObjectColor;
    varying vec3 vColor;
    void main() {
        gl_FragColor = vec4(vColor * uObjectColor, 1.0);
    }
    `;

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

    setUniform1f(name, value)
    {
        this.gl.uniform1f(this.getUniformLocation(name), value);
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

    static getDefaultColorLightShader()
    {
        return new Shader(vsColorWithLightningSource, fsColorWithLightningSource);
        //return new Shader(vsTest, fsTest);
    }
}

export default Shader;