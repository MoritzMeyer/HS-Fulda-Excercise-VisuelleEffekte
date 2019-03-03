import Webgl from "./Engine/Webgl.js";
import Renderer from "./Engine/Renderer.js";
import Shader from "./Engine/Shader.js";
import VertexBuffer from "./Engine/VertexBuffer.js";
import GameObject from "./Engine/GameObject.js";
import Texture from "./Engine/Texture.js";
import Camera from "./Engine/Camera.js";

// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);

const vsSource =
    `
    attribute vec3 aPosition;
    attribute vec2 aTexCoords;
    varying vec2 vTexCoord;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    void main() {
        vTexCoord = aTexCoords;
        gl_PointSize = 10.0;
        vec4 flipX = vec4(-1, 1, 1, 1);
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0) * flipX;
    }
`;

const fsSource =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    varying vec2 vTexCoord;
    uniform sampler2D uTexture;
    uniform float uAlpha;
    void main() {
        vec4 texColor = texture2D(uTexture, vTexCoord);
        texColor.a = uAlpha; 
        gl_FragColor = texColor;
}`;

let positions =
    [
        // cube
        0.5, -0.75,
        -0.5,  0.2,
        0.5,  0.2,
        -0.5, -0.75,

        // triangle
        -0.75, 0.2,
        0.75, 0.2,
        0, 0.9,
    ];

let texCoords =
    [
        // cube
        0, 1,
        1, 0,
        0, 0,
        1, 1,

        // triangle
        0, 0.5,
        0.5, 1,
        0.5, 0.5,
    ];

// Index Arrays
let indices = [0, 1, 2, 0, 1 , 3, 4, 5, 6];
//let indicesTriangle = [4, 5, 6];

let canvasColor = [0.42, 0.6, 0.0, 1.0];

// Engine erzeugen und canvas initialisieren
let renderer = new Renderer();

// initialize VertexBuffer
const vertexBuffer = new VertexBuffer(positions, 2);
const texCoordsBuffer = new VertexBuffer(texCoords, 2);

// initialize Cube data
// shader
let shader = new Shader(vsSource, fsSource);
let texture = new Texture("uTexture", shader, "./textures/todo.jpg", 0, texCoordsBuffer, "aTexCoords");
let gameObject = new GameObject(vertexBuffer, indices, texture);

const camera = new Camera();
camera.gameObject.transform.translate([0.0, 0.0, -2.5]);

function render(now)
{
    renderer.clear(canvas, canvasColor);
    renderer.drawGameObject(gameObject, camera);

    if (!gameObject.material.loaded)
    {
        requestAnimationFrame(render);
    }
    else
    {
            gameObject.delete();
            vertexBuffer.delete();
            texCoordsBuffer.delete();
    }
}

requestAnimationFrame(render);