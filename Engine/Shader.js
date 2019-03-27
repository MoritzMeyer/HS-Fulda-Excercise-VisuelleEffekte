import Webgl from "./Webgl.js";

//region Color
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
    uniform float uAlpha;
    void main() {
        gl_FragColor = vec4(uObjectColor, uAlpha);
    }
`;
//endregion

//region Texture
const vsTextureSource =
`
    attribute vec3 aPosition;
    attribute vec2 aTexCoords;
    varying vec2 vTexCoords;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    void main() {
        vec4 flipX = vec4(-1, 1, 1, 1);
        vTexCoords = (vec4(aTexCoords, 0, 1) * flipX).xy;
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
    uniform float uAlpha;
    void main() {
        vec4 texColor = texture2D(uTexture, vTexCoords);
        texColor.a = uAlpha; 
        gl_FragColor = texColor;
        
    }
`;
//endregion

//region PhongColor
const vsPhongColor =
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
        vNormal = vec3(uNormalMatrix * vec4(aNormal, 0.0));
        
        gl_Position = uProjectionMatrix * uViewMatrix * vec4(vFragPos, 1.0);
    }        
`;

const fsPhongColorMat =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    
    varying vec3 vFragPos;
    varying vec3 vNormal;
    
    uniform vec3 uViewPosition;
    uniform float uAlpha;
    
    struct Material {
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        float shininess;
    };    
    uniform Material material;
    
    struct Light {
        vec3 position;
        vec3 color;
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        int isActive;
    };    
    uniform Light light;
    
    void main() {
        // ambient
        vec3 ambient = light.ambient * material.ambient * light.color;
        
        // diffuse
        vec3 normal = normalize(vNormal);
        vec3 lightDirection = normalize(light.position - vFragPos);
        float diff = max(dot(normal, lightDirection), 0.0);
        vec3 diffuse =  light.diffuse * (diff * material.diffuse) * light.color;
        
        // sepcular
        vec3 viewDir = normalize(uViewPosition - vFragPos);
        vec3 reflectDir = reflect(-lightDirection, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
        vec3 specular = light.specular * (spec *  material.specular) * light.color;
        
        vec3 result = ambient + diffuse + specular;
        gl_FragColor = vec4(result, uAlpha);
    }
`;


const fsPhongColor =
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
    uniform float uAlpha;
    
    uniform float uAmbientStrength;
    uniform float uSpecFac;
    uniform float uSpecStrength;
    
    void main() {
        // ambient
        float ambientStrength = uAmbientStrength;
        vec3 ambient = ambientStrength * uLightColor;
        
        // diffuse
        vec3 normal = normalize(vNormal);
        //vec3 normalizedFragPos = normalize(vFragPos);
        //vec3 normalizedLightPos = normalize(uLightPosition);
        vec3 lightDirection = normalize(uLightPosition - vFragPos);
        float diff = max(dot(normal, lightDirection), 0.0);
        vec3 diffuse =  diff * uLightColor;
        
        // sepcular
        float specularStrength = uSpecStrength;
        vec3 viewDir = normalize(uViewPosition - vFragPos);
        vec3 reflectDir = reflect(-lightDirection, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), uSpecFac);
        vec3 specular = specularStrength * spec * uLightColor;
        
        vec3 result = (ambient + diffuse + specular) * uObjectColor;
        gl_FragColor = vec4(result, uAlpha);
    }
`;
//endregion

//region PhongColorDirectionalLight
const vsPhongColorDirectionalLight =
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
        vNormal = vec3(uNormalMatrix * vec4(aNormal, 0.0));
        
        gl_Position = uProjectionMatrix * uViewMatrix * vec4(vFragPos, 1.0);
    }        
`;

const fsPhongColorDirectionalLight =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    
    varying vec3 vFragPos;
    varying vec3 vNormal;
    
    uniform vec3 uViewPosition;
    uniform float uAlpha;
    
    struct Material {
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        float shininess;
    };    
    uniform Material material;
    
    struct DirectionalLight {
        vec3 direction;
    
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
    };    
    uniform DirectionalLight directLight;
    
    void main() {
    
        // ambient
        vec3 ambient = directLight.ambient * material.ambient;
        
        // diffuse
        vec3 normal = normalize(vNormal);
        //vec3 lightDirection = normalize(light.position - vFragPos);
        vec3 lightDirection = normalize(-directLight.direction);
        float diff = max(dot(normal, lightDirection), 0.0);
        vec3 diffuse =  directLight.diffuse * (diff * material.diffuse);
        
        // sepcular
        vec3 viewDir = normalize(uViewPosition - vFragPos);
        vec3 reflectDir = reflect(-lightDirection, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
        vec3 specular = directLight.specular * (spec *  material.specular);
        
        vec3 result = ambient + diffuse + specular;
        gl_FragColor = vec4(result, uAlpha);
    }
`;
//endregion

//region PhongColorPointLight
const vsPhongColorPointLight =
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
        vNormal = vec3(uNormalMatrix * vec4(aNormal, 0.0));
        
        gl_Position = uProjectionMatrix * uViewMatrix * vec4(vFragPos, 1.0);
    }        
`;

const fsPhongColorPointLight =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    
    varying vec3 vFragPos;
    varying vec3 vNormal;
    
    uniform vec3 uViewPosition;
    uniform float uAlpha;
    
    struct Material {
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        float shininess;
    };    
    uniform Material material;
    
    struct PointLight {
        vec3 position;
    
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        
        float constant;
        float linear;
        float quadratic;
    };    
    uniform PointLight pointLight;
    
    void main() {
    
        // ambient
        vec3 ambient = pointLight.ambient * material.ambient;
        
        // diffuse
        vec3 normal = normalize(vNormal);
        vec3 lightDirection = normalize(pointLight.position - vFragPos);
        float diff = max(dot(normal, lightDirection), 0.0);
        vec3 diffuse =  pointLight.diffuse * (diff * material.diffuse);
        
        // sepcular
        vec3 viewDir = normalize(uViewPosition - vFragPos);
        vec3 reflectDir = reflect(-lightDirection, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
        vec3 specular = pointLight.specular * (spec *  material.specular);
        
        //attenuation
        float distance = length(pointLight.position - vFragPos);
        float attenuation = 1.0 / (pointLight.constant + pointLight.linear * distance + pointLight.quadratic * (distance * distance));
        
        ambient *= attenuation;
        diffuse *= attenuation;
        specular *= attenuation;
        
        vec3 result = ambient + diffuse + specular;
        gl_FragColor = vec4(result, uAlpha);
    }
`;
//endregion

//region PhongColorSpotLight
const vsPhongColorSpotLight =
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
        vNormal = vec3(uNormalMatrix * vec4(aNormal, 0.0));
        
        gl_Position = uProjectionMatrix * uViewMatrix * vec4(vFragPos, 1.0);
    }        
`;

const fsPhongColorSpotLight =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    
    varying vec3 vFragPos;
    varying vec3 vNormal;
    
    uniform vec3 uViewPosition;
    uniform float uAlpha;
    
    struct Material {
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        float shininess;
    };    
    uniform Material material;
    
    struct SpotLight {
        vec3 position;
        vec3 direction;
        float cutOff;
    
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        
        float constant;
        float linear;
        float quadratic;
    };    
    uniform SpotLight spotLight;
    
    void main() {
    
        vec3 lightDir = normalize(spotLight.position - vFragPos);
        
        // check if lighting is inside spotlight cone
        float theta = dot(lightDir, normalize(-spotLight.direction));
        
        if (theta > spotLight.cutOff) // as we are working with angles as cosines instead of degrees we need to use '>'
        {
            // ambient
            vec3 ambient = spotLight.ambient * material.ambient;
            
            // diffuse
            vec3 normal = normalize(vNormal);
            float diff = max(dot(normal, lightDir), 0.0);
            vec3 diffuse =  spotLight.diffuse * (diff * material.diffuse);     
            
            // sepcular
            vec3 viewDir = normalize(uViewPosition - vFragPos);
            vec3 reflectDir = reflect(-lightDir, normal);
            float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
            vec3 specular = spotLight.specular * (spec *  material.specular);
            
            //attenuation
            float distance = length(spotLight.position - vFragPos);
            float attenuation = 1.0 / (spotLight.constant + spotLight.linear * distance + spotLight.quadratic * (distance * distance)); 
               
            //1 ambient *= attenuation; // remove attenuation from ambient, as it is calculate in else branch
            diffuse *= attenuation;
            specular *= attenuation;
            
                    
            vec3 result = ambient + diffuse + specular;
            gl_FragColor = vec4(result, uAlpha);               
        }
        else
        {
            // else, use ambient light so scene isn't completely dark outside the spotlight.
            gl_FragColor = vec4(spotLight.ambient * material.ambient, uAlpha);
        }
    }
`;
//endregion

//region PhongColorSpotLightOuterCutOff
const vsPhongColorSpotLightOuterCutOff =
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
        vNormal = vec3(uNormalMatrix * vec4(aNormal, 0.0));
        
        gl_Position = uProjectionMatrix * uViewMatrix * vec4(vFragPos, 1.0);
    }        
`;

const fsPhongColorSpotLightOuterCutOff =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    
    varying vec3 vFragPos;
    varying vec3 vNormal;
    
    uniform vec3 uViewPosition;
    uniform float uAlpha;
    
    struct Material {
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        float shininess;
    };    
    uniform Material material;
    
    struct SpotLight {
        vec3 position;
        vec3 direction;
        float cutOff;
        float outerCutOff;
    
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        
        float constant;
        float linear;
        float quadratic;
    };    
    uniform SpotLight spotLight;
    
    void main() {
    
        // ambient
        vec3 ambient = spotLight.ambient * material.ambient;
        
        // diffuse
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(spotLight.position - vFragPos);
        float diff = max(dot(normal, lightDir), 0.0);
        vec3 diffuse =  spotLight.diffuse * (diff * material.diffuse);
        
        // sepcular
        vec3 viewDir = normalize(uViewPosition - vFragPos);
        vec3 reflectDir = reflect(-lightDir, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
        vec3 specular = spotLight.specular * (spec *  material.specular);
        
        
        // spotlight (soft edges)
        float theta = dot(lightDir, normalize(-spotLight.direction));
        float epsilon = (spotLight.cutOff - spotLight.outerCutOff);
        float intensity = clamp((theta - spotLight.outerCutOff) / epsilon, 0.0, 1.0);
        
        diffuse *= intensity;
        specular *= intensity;
        
        //attenuation
        float distance = length(spotLight.position - vFragPos);
        float attenuation = 1.0 / (spotLight.constant + spotLight.linear * distance + spotLight.quadratic * (distance * distance));
        
        ambient *= attenuation;
        diffuse *= attenuation;
        specular *= attenuation;
        vec3 result = ambient + diffuse + specular;
        gl_FragColor = vec4(result, uAlpha);  
    }
`;
//endregion

//region PhongColorMultLights
const vsPhongColorMultLights =
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
        vNormal = vec3(uNormalMatrix * vec4(aNormal, 0.0));
        
        gl_Position = uProjectionMatrix * uViewMatrix * vec4(vFragPos, 1.0);
    }        
`;

const fsPhongColorMultLights =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    
    varying vec3 vFragPos;
    varying vec3 vNormal;
    
    uniform vec3 uViewPosition;
    uniform float uAlpha;
    
    #define NR_POINT_LIGHTS __point__
    #define NR_SPOT_LIGHTS __spot__
    #define NR_DIRECT_LIGHTS __direct__
    
    struct Material {
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        float shininess;
    };    
    uniform Material material;
    
    struct DirectionalLight {
        vec3 direction;
    
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        
        int isActive;
    };    
    uniform DirectionalLight directLights[NR_DIRECT_LIGHTS];
    
    struct PointLight {
        vec3 position;
    
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        
        float constant;
        float linear;
        float quadratic;
        
        int isActive;
    };    
    uniform PointLight pointLights[NR_POINT_LIGHTS];
    
    struct SpotLight {
        vec3 position;
        vec3 direction;
        float cutOff;
        float outerCutOff;
    
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        
        float constant;
        float linear;
        float quadratic;
        
        int isActive;
    };    
    uniform SpotLight spotLights[NR_SPOT_LIGHTS];
    
    vec3 CalcDirectionalLight(DirectionalLight light, vec3 normal, vec3 viewDir);
    vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir);
    vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir);
    
    void main() 
    {
        // properties
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(uViewPosition - vFragPos);
        
        vec3 result = vec3(0, 0, 0);
        
        // first calc all Directional Light
        for (int i = 0; i < NR_DIRECT_LIGHTS; i++)
            result += CalcDirectionalLight(directLights[i], normal, viewDir);
        
        // second calc all Point Lights
        for (int i = 0; i < NR_POINT_LIGHTS; i++)
            result += CalcPointLight(pointLights[i], normal, vFragPos, viewDir);
        
        // third calc Spot Light
        for (int i = 0; i < NR_SPOT_LIGHTS; i++)
            result += CalcSpotLight(spotLights[i], normal, vFragPos, viewDir);
        
        gl_FragColor = vec4(result, uAlpha);
    }
    
    // calculates color for directional lighting
    vec3 CalcDirectionalLight(DirectionalLight light, vec3 normal, vec3 viewDir)
    {
        if (light.isActive != 1)
        {
            return vec3(0, 0, 0);
        }
        
        vec3 lightDir = normalize(-light.direction);
        
        // diffuse
        float diff = max(dot(normal, lightDir), 0.0);
        
        // specular
        vec3 reflectDir = reflect(-lightDir, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
        
        // result
        vec3 ambient = light.ambient * material.ambient;
        vec3 diffuse = light.diffuse * diff * material.diffuse;
        vec3 specular = light.specular * spec * material.specular;
        
        return (ambient + diffuse + specular);
    }
    
    // calculates color for point lighting
    vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
    {
        if (light.isActive != 1)
        {
            return vec3(0, 0, 0);
        }
        
        vec3 lightDir = normalize(light.position - fragPos);
        
        // diffuse
        float diff = max(dot(normal, lightDir), 0.0);
        
        // specular 
        vec3 reflectDir = reflect(-lightDir, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
        
        // attenuation
        float distance = length(light.position - fragPos);
        float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));        
        
        // result
        vec3 ambient = light.ambient * material.ambient;
        vec3 diffuse = light.diffuse * diff * material.diffuse;
        vec3 specular = light.specular * spec * material.specular;
        ambient *= attenuation;
        diffuse *= attenuation;
        specular *= attenuation;
        
        return (ambient + diffuse + specular);
    }
    
    vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
    {
        if (light.isActive != 1)
        {
            return vec3(0, 0, 0);
        }
        
        vec3 lightDir = normalize(light.position - fragPos);
        
        // diffuse
        float diff = max(dot(normal, lightDir), 0.0);
        
        // specular 
        vec3 reflectDir = reflect(-lightDir, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
        
        // attenuation
        float distance = length(light.position - fragPos);
        float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));
        
        // intensity
        float theta = dot(lightDir, normalize(-light.direction));
        float epsilon = light.cutOff - light.outerCutOff;
        float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);
        
        // result
        vec3 ambient = light.ambient * material.ambient;
        vec3 diffuse = light.diffuse * diff * material.diffuse;
        vec3 specular = light.specular * spec * material.specular;
        ambient *= attenuation * intensity;
        diffuse *= attenuation * intensity;
        specular *= attenuation * intensity;
        
        return (ambient + diffuse + specular);
    }
    
    
`;
//endregion

//region PhongColor2
const vsPhongColor2 =
    `
        attribute vec3 aPosition;
        attribute vec3 aNormal;
        uniform mat4 uProjectionMatrix;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uModelMatrix;
        uniform mat4 uViewMatrix;
        uniform mat4 uNormalMatrix;
        
        varying vec3 normalInterp;
        varying vec3 vertPos;
        
        void main() {
            //mat4 modelViewMat = uViewMatrix * uModelMatrix;
            vec4 vertPos4 = uModelViewMatrix * vec4(aPosition, 1.0);
            vertPos = normalize(vec3(vertPos4) / vertPos4.w);
            //vertPos = vec3(vertPos4) / vertPos4.w;
            normalInterp = vec3(uNormalMatrix * vec4(aNormal, 0.0));
            
            gl_Position = uProjectionMatrix * vertPos4;
        }
    `;

const fsPhongColor2 =
    `
     #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    
    varying vec3 normalInterp;
    varying vec3 vertPos;
    
    uniform vec3 uLightColor;
    uniform vec3 uLightPosition;
    uniform vec3 uObjectColor;
    uniform float uAlpha;    
    
    void main() {
        float Ka = 1.0;
        float Kd = 1.0;
        float Ks = 1.0;
        
        float shininessVal = 80.0;
        vec3 lightPos = normalize(uLightPosition);
        
        vec3 N = normalize(normalInterp);
        vec3 L = normalize(lightPos - vertPos);
        
        float lambertian = max(dot(N, L), 0.0);
        float specular = 0.0;
        
        if (lambertian > 0.0) {
            vec3 R = reflect(-L, N);
            vec3 V = normalize(-vertPos);
            
            // compter specular term
            float specAngle = max(dot(R, V), 0.0);
            specular = pow(specAngle, shininessVal);
        }
        
        gl_FragColor = vec4((Ka * uLightColor + Kd * lambertian * uLightColor + Ks * specular * uLightColor) * uObjectColor, uAlpha);
    }   
    `;
//endregion

//region PhongTexture
const vsPhongTexture =
    `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aTexCoords;
    varying vec2 vTexCoords;
    
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    
    varying vec3 vFragPos;
    varying vec3 vNormal;
    
    void main() {
        gl_PointSize = 10.0;
        vec4 flipX = vec4(-1, 1, 1, 1);
        vTexCoords = (vec4(aTexCoords, 0, 1) * flipX).xy;
        
        vFragPos = vec3(uModelMatrix * vec4(aPosition, 1.0));
        vNormal = vec3(uNormalMatrix * vec4(aNormal, 0.0));
        
        gl_Position = uProjectionMatrix * uViewMatrix * vec4(vFragPos, 1.0);
    }        
`;

const fsPhongTextureMat =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    
    varying vec3 vFragPos;
    varying vec3 vNormal;
    varying vec2 vTexCoords;
    
    uniform vec3 uViewPosition;
    uniform sampler2D uTexture;
    uniform float uAlpha;
    
    struct Material {
        vec3 ambient;
        //sampler2D diffuse;
        //sampler2D specular;
        vec3 diffuse;
        vec3 specular;
        float shininess;
    };    
    uniform Material material;
    
    struct Light {
        vec3 position;
        vec3 color;
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        int isActive;
    };    
    uniform Light light;
    
    void main() {
               
        // ambient
        //vec3 ambient = light.ambient * texture2D(material.diffuse, vTexCoords).rgb * light.color;
        vec3 ambient = light.ambient * material.ambient * light.color;
        
        // diffuse
        vec3 normal = normalize(vNormal);
        vec3 lightDirection = normalize(light.position - vFragPos);
        float diff = max(dot(normal, lightDirection), 0.0);
        //vec3 diffuse =  light.diffuse * diff * texture2D(material.diffuse, vTexCoords).rgb * light.color;
        vec3 diffuse =  light.diffuse * diff * material.diffuse * light.color;
        
        // sepcular
        vec3 viewDir = normalize(uViewPosition - vFragPos);
        vec3 reflectDir = reflect(-lightDirection, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
        //vec3 specular = light.specular * spec * texture2D(material.specular, vTexCoords).rgb * light.color;
        vec3 specular = light.specular * spec * material.specular * light.color;
        
        vec4 texColor = texture2D(uTexture, vTexCoords);        
        vec3 result = vec3((ambient + diffuse + specular) * texColor.xyz);
        //vec3 result = ambient + diffuse + specular;   
        gl_FragColor = vec4(result, uAlpha);        
    }
`;

const fsPhongTexture =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    
    varying vec3 vFragPos;
    varying vec3 vNormal;
    varying vec2 vTexCoords;
    
    //uniform float uAmbientStrength;
    uniform vec3 uLightPosition;
    uniform vec3 uViewPosition;
    uniform vec3 uLightColor;
    uniform sampler2D uTexture;  
    uniform float uAlpha;
    
    uniform float uAmbientStrength;
    uniform float uSpecFac;
    uniform float uSpecStrength;
    
    void main() {
               
        // ambient
        float ambientStrength = uAmbientStrength;
        vec3 ambient = ambientStrength * uLightColor;
        
        // diffuse
        vec3 normal = normalize(vNormal);
        //vec3 normalizedFragPos = normalize(vFragPos);
        //vec3 normalizedLightPos = normalize(uLightPosition);
        vec3 lightDirection = normalize(uLightPosition - vFragPos);
        float diff = max(dot(normal, lightDirection), 0.0);
        vec3 diffuse =  diff * uLightColor;
        
        // sepcular
        float specularStrength = uSpecStrength;
        vec3 viewDir = normalize(uViewPosition - vFragPos);
        vec3 reflectDir = reflect(-lightDirection, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), uSpecFac);
        vec3 specular = specularStrength * spec * uLightColor;
        
        vec4 texColor = texture2D(uTexture, vTexCoords);
        texColor.a = uAlpha;
        
        vec4 result = vec4((ambient + diffuse + specular), 1.0);
        gl_FragColor = result * texColor;
        
        //vec3 result = vec3((ambient + diffuse + specular) * texColor.xyz);        
        //gl_FragColor = vec4(result, uAlpha);
    }
`;
//endregion

//region PhongPerVertex
const vsPhongPerVertex =
`
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uNormalMatrix;
    
    uniform vec3 uLightPosition;
    uniform float uAmbientStrength;
    uniform float uSpecFac;
    uniform float uSpecStrength;
    uniform vec3 uObjectColor;
    uniform float uAlpha;
    
    varying vec4 vFragColor;
    
    void main() {
        gl_PointSize = 10.0;
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
        
        // all following gemetric computations are performed in the
        // camera coordinate system (aka eye coordinates)
        mat4 modelViewMat = uViewMatrix * uModelMatrix;
        vec3 normal = vec3(uNormalMatrix * vec4(aNormal, 0.0));
        vec4 vertPos4 = modelViewMat * vec4(aPosition, 1.0);
        vec3 vertPos = vec3(vertPos4) / vertPos4.w;
        vec3 lightDir = normalize(uLightPosition - vertPos);
        vec3 reflectDir = reflect(-lightDir, normal);
        vec3 viewDir = normalize(vertPos);
        
        float lambertian = max(dot(lightDir, normal), 0.0);
        float specular = uSpecStrength;
        
        if (lambertian > 0.0) {
            float specAngle = max(dot(reflectDir, viewDir), 0.0);
            specular = pow(specAngle, uSpecFac);
            
            // specular = pow(specAngle, uSpecFac);            
            //specular *= lambertian;
            // specular *= 0.0;
        }
        vFragColor = vec4((lambertian + specular) * uObjectColor, uAlpha);
    }
`;

const fsPhongPerVertex =
`
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    
    varying vec4 vFragColor;
    
    void main() {
        gl_FragColor = vFragColor;
    }    
`;
//endregion

//region PhongPerFragment
const vsPhongPerFragment =
`
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uNormalMatrix;
    
    varying vec3 vNormal;
    varying vec3 vPos;
    
    void main() {
        gl_PointSize = 10.0;      
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
        
        vec4 vertPos4 = uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
        vPos = vec3(vertPos4) / vertPos4.w;
        vNormal = vec3(uNormalMatrix * vec4(aNormal, 0.0));        
    }    
`;

const fsPhongPerFragment =
`
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    
    varying vec3 vNormal;
    varying vec3 vPos;
    
    uniform vec3 uLightPosition;
    uniform float uSpecFac;
    uniform float uSpecStrength;
    uniform float uAlpha;
    uniform vec3 uObjectColor;
    
    void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(uLightPosition - vPos);
        
        float lambertian = max(dot(lightDir, normal), 0.0);
        float specular = uSpecStrength;
        
        if (lambertian > 0.0) {
            vec3 reflectDir = reflect(-lightDir, normal);
            vec3 viewDir = normalize(-vPos);
            
            float specAngle = max(dot(reflectDir, viewDir), 0.0);
            specular = pow(specAngle, uSpecFac);
        }
        
        gl_FragColor = vec4((lambertian + specular) * uObjectColor, uAlpha);
    }
`;
//endregion

//region Gourand
const vsGourand =
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

const fsGourand =
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
//endregion

//region ShadowShader
const vsShadowShader =
    `
        attribute vec3 aPosition;
        uniform mat4 uLightModelViewProjectionMatrix;
        
        void main()
        {
            gl_Position = uLightModelViewProjectionMatrix * vec4(aPosition, 1.0);
        }
    `;

const fsShadowShader =
    `
        #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
        #else
        precision mediump float;
        #endif
        
        void main() {}
    `;
//endregion

//region DirectLightColorShadow
const vsDirectLightColorShadow =
`
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uNormalMatrix;
    uniform mat4 uLightSpaceMatrix;
    
    varying vec3 vFragPos;
    varying vec3 vNormal;
    varying vec4 vFragPosLightSpace;
    
    void main() {
        gl_PointSize = 10.0;
        vec4 flipX = vec4(-1, 1, 1, 1);
        
        vFragPos = vec3(uModelMatrix * vec4(aPosition, 1.0));
        vNormal = vec3(uNormalMatrix * vec4(aNormal, 0.0));
        vFragPosLightSpace = uLightSpaceMatrix * vec4(vFragPos, 1.0);
        
        gl_Position = uProjectionMatrix * uViewMatrix * vec4(vFragPos, 1.0);
    }    
`;

const fsDirectLightColorShadow =
`
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    
    varying vec3 vFragPos;
    varying vec3 vNormal;
    varying vec4 vFragPosLightSpace;
    
    uniform vec3 uViewPosition;
    uniform float uAlpha;
    
    uniform sampler2D uShadowMap;
       
    struct Material {
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        float shininess;
    };    
    uniform Material material;
    
    struct DirectionalLight {
        vec3 direction;
    
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        
        int isActive;
    };    
    uniform DirectionalLight directLight;
    
    vec3 CalcDirectionalLight(DirectionalLight light, vec3 normal, vec3 viewDir);
    float ShadowCalculation(vec4 fragPosLightSpace, vec3 normal, vec3 lightDir);
    
    void main() 
    {
        // properties
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(uViewPosition - vFragPos);
        
        //calc Directional Light
        vec3 result = CalcDirectionalLight(directLight, normal, viewDir);
        
        gl_FragColor = vec4(result, uAlpha);
    }
    
    // calculates color for directional lighting
    vec3 CalcDirectionalLight(DirectionalLight light, vec3 normal, vec3 viewDir)
    {
        if (light.isActive != 1)
        {
            return vec3(0, 0, 0);
        }
        
        vec3 lightDir = normalize(-light.direction);
        
        // diffuse
        float diff = max(dot(normal, lightDir), 0.0);
        
        // specular
        vec3 reflectDir = reflect(-lightDir, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
        
        // result
        vec3 ambient = light.ambient * material.ambient;
        vec3 diffuse = light.diffuse * diff * material.diffuse;
        vec3 specular = light.specular * spec * material.specular;
        
        // calculate Shadow
        float shadow = ShadowCalculation(vFragPosLightSpace, normal, lightDir);
        
        return (ambient + (1.0 - shadow) *  (diffuse + specular));
    } 
    
    float ShadowCalculation(vec4 fragPosLightSpace, vec3 normal, vec3 lightDir)
    {
        // perform perspective divide
        vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
        
        // transform to [0, 1] range
        projCoords = projCoords * 0.5 + 0.5;
        
        // get closest depth value from light's perspective
        float closestDepth = texture2D(uShadowMap, projCoords.xy).r;
        
        // get Depth of current fragment from light's perspective
        float currentDepth = projCoords.z;
        
        // prevent shadow acne with bias
        float bias = max(0.05 * (1.0 - dot(normal, lightDir)), 0.005);
        
        // check wether current frag pos is in shadow
        float shadow = currentDepth - bias > closestDepth ? 1.0 : 0.0;        
        
        // keep shadow at 0.0 when outside the far_plane of light's frustum
        if (projCoords.z > 1.0)
        {
            shadow = 0.0;
        }
        
        return shadow;        
    }
`;
//endregion

//region Cook-Torrance-BRDF
const vsCT_BRDF =
`
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    
    varying vec3 vFragPos;
    varying vec3 vNormal;
    
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uNormalMatrix;
    
    void main()
    {
        vFragPos = vec3(uModelMatrix * vec4(aPosition, 1.0));
        vNormal = mat3(uNormalMatrix) * aNormal;   
    
        gl_Position =  uProjectionMatrix * uViewMatrix * vec4(vFragPos, 1.0);
    }
`;

const fsCT_BRDF =
`
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    
    varying vec3 vFragPos;
    varying vec3 vNormal;
    
    #define NR_LIGHTS __lights__
    
    // material parameters
    struct Material {
        vec3 albedo;
        float metallic;
        float roughness;
        float ao;
    };
    uniform Material material;
    
    // lights
    struct Light {
        vec3 position;
        vec3 color;
        vec3 ambient;
        vec3 diffuse;
        vec3 specular;
        int isActive;
    };    
    uniform Light lights[NR_LIGHTS];
    
    uniform vec3 uViewPosition;
    uniform float uAlpha;
    
    const float PI = 3.14159265359;
    // ----------------------------------------------------------------------------
    float DistributionGGX(vec3 normal, vec3 H, float roughness)
    {
        float a = roughness*roughness;
        float a2 = a*a;
        float NdotH = max(dot(normal, H), 0.0);
        float NdotH2 = NdotH*NdotH;
    
        float nom   = a2;
        float denom = (NdotH2 * (a2 - 1.0) + 1.0);
        denom = PI * denom * denom;
    
        return nom / max(denom, 0.001); // prevent divide by zero for roughness=0.0 and NdotH=1.0
    }
    // ----------------------------------------------------------------------------
    float GeometrySchlickGGX(float NdotV, float roughness)
    {
        float r = (roughness + 1.0);
        float k = (r*r) / 8.0;
    
        float nom   = NdotV;
        float denom = NdotV * (1.0 - k) + k;
    
        return nom / denom;
    }
    // ----------------------------------------------------------------------------
    float GeometrySmith(vec3 normal, vec3 viewDir, vec3 L, float roughness)
    {
        float NdotV = max(dot(normal, viewDir), 0.0);
        float NdotL = max(dot(normal, L), 0.0);
        float ggx2 = GeometrySchlickGGX(NdotV, roughness);
        float ggx1 = GeometrySchlickGGX(NdotL, roughness);
    
        return ggx1 * ggx2;
    }
    // ----------------------------------------------------------------------------
    vec3 fresnelSchlick(float cosTheta, vec3 F0)
    {
        return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
    }
    // ----------------------------------------------------------------------------
    void main()
    {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(uViewPosition - vFragPos);
    
        // calculate reflectance at normal incidence; if dia-electric (like plastic) use F0 
        // of 0.04 and if it's a metal, use the albedo color as F0 (metallic workflow)    
        vec3 F0 = vec3(0.04); 
        F0 = mix(F0, material.albedo, material.metallic);
    
        // reflectance equation
        vec3 Lo = vec3(0.0);
        for(int i = 0; i < 4; ++i) 
        {
            // calculate per-light radiance
            vec3 L = normalize(lights[i].position - vFragPos);
            vec3 H = normalize(viewDir + L);
            float distance = length(lights[i].position - vFragPos);
            float attenuation = 1.0 / (distance * distance);
            vec3 radiance = lights[i].color * attenuation;
    
            // Cook-Torrance BRDF
            float NDF = DistributionGGX(normal, H, material.roughness);   
            float G   = GeometrySmith(normal, viewDir, L, material.roughness);      
            vec3 F    = fresnelSchlick(clamp(dot(H, viewDir), 0.0, 1.0), F0);
               
            vec3 nominator    = NDF * G * F; 
            float denominator = 4.0 * max(dot(normal, viewDir), 0.0) * max(dot(normal, L), 0.0);
            vec3 specular = nominator / max(denominator, 0.001); // prevent divide by zero for NdotV=0.0 or NdotL=0.0
            
            // kS is equal to Fresnel
            vec3 kS = F;
            // for energy conservation, the diffuse and specular light can't
            // be above 1.0 (unless the surface emits light); to preserve this
            // relationship the diffuse component (kD) should equal 1.0 - kS.
            vec3 kD = vec3(1.0) - kS;
            // multiply kD by the inverse metalness such that only non-metals 
            // have diffuse lighting, or a linear blend if partly metal (pure metals
            // have no diffuse light).
            kD *= 1.0 - material.metallic;
    
            // scale light by NdotL
            float NdotL = max(dot(normal, L), 0.0);        
    
            // add to outgoing radiance Lo
            Lo += (kD * material.albedo / PI + specular) * radiance * NdotL;  // note that we already multiplied the BRDF by the Fresnel (kS) so we won't multiply by kS again
        }   
        
        // ambient lighting (note that the next IBL tutorial will replace 
        // this ambient lighting with environment lighting).
        vec3 ambient = vec3(0.03) * material.albedo * material.ao;
    
        vec3 color = ambient + Lo;
    
        // HDR tonemapping
        color = color / (color + vec3(1.0));
        // gamma correct
        color = pow(color, vec3(1.0/2.2)); 
    
        gl_FragColor = vec4(color, uAlpha);
    }
`;
//endregion

class Shader
{
    constructor(vsSource, fsSource, hasLightning = false)
    {
        const gl = this.gl = Webgl.getGL();
        this.locations = [];
        this.vertexShader = Shader.loadShader("vertex", vsSource);
        this.fragmentShader = Shader.loadShader("fragment", fsSource);
        this.hasLightning = hasLightning;
        
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

    static getDefaultColorShader(hasLightning)
    {
        if (hasLightning)
        {
            //return new Shader(vsPhongColor, fsPhongColor, true);
            //return new Shader(vsPhongPerVertex, fsPhongPerVertex, true);
            //return new Shader(vsPhongPerFragment, fsPhongPerFragment, true);
            return new Shader(vsPhongColor, fsPhongColorMat, true);
        }
        else
        {
            return new Shader(vsColorSource, fsColorSource);
        }
    }

    static getDefaultTextureShader(hasLightning)
    {
        if (hasLightning)
        {
            return new Shader(vsPhongTexture, fsPhongTextureMat, true);
        }
        else
        {
            return new Shader(vsTextureSource, fsTextureSource);
        }
    }

    static getDirectionalLightColorShader()
    {
        return new Shader(vsPhongColorDirectionalLight, fsPhongColorDirectionalLight, true);
    }

    static getPointLightColorShader()
    {
        return new Shader(vsPhongColorPointLight, fsPhongColorPointLight, true);
    }

    static getSpotLightColorShader(outerCutOff = false)
    {
        if (outerCutOff)
        {
            return new Shader(vsPhongColorSpotLightOuterCutOff, fsPhongColorSpotLightOuterCutOff, true);
        }
        else
        {
            return new Shader(vsPhongColorSpotLight, fsPhongColorSpotLight, true);
        }
    }

    static getMultiLightColorShader(numbPointLights, numbSpotLights, numbDirectLights)
    {
        let fs = fsPhongColorMultLights.replace("__spot__", numbSpotLights);
        fs = fs.replace("__direct__", numbDirectLights);
        fs = fs.replace("__point__", numbPointLights);
        return new Shader(vsPhongColorMultLights, fs, true);
    }

    static getDefaultShadowShader()
    {
        return new Shader(vsShadowShader, fsShadowShader);
    }

    static getDirectLightColorShadowShader()
    {
        return new Shader(vsDirectLightColorShadow, fsDirectLightColorShadow, true);
    }

    static getCookTorrancePBR(numberOfLights)
    {
        let fs = fsCT_BRDF.replace("__lights__", numberOfLights);
        return new Shader(vsCT_BRDF, fs, true);
    }
}

export default Shader;