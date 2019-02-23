import Webgl from "./Renderer/Webgl.js";
import Renderer from "./Renderer/Renderer.js";
import Shader from "./Renderer/Shader.js";
import VertexBuffer from "./Renderer/VertexBuffer.js";
import Drawable from "./Renderer/Drawable.js";
import Texture from "./Renderer/Texture.js";

// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);

const vsSource =
    `
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    varying vec2 vTexCoord;
    void main() {
        vTexCoord = aTexCoord;
        gl_PointSize = 10.0;
        gl_Position = vec4(aPosition, 1.0);
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
    void main() {
        gl_FragColor = texture2D(uTexture, vTexCoord);
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
         0.75, -0.5,
        -0.2, 0.5,
        -0.2, -0.5,
        0.75, 0.5,

        -0.2, 0.75,
        -0.2, -0.75,
        -0.9, 0,
    ];

// Index Arrays
let indices = [0, 1, 2, 0, 1 , 3, 4, 5, 6];
//let indicesTriangle = [4, 5, 6];

let canvasColor = [0.42, 0.6, 0.0, 1.0];

// Renderer erzeugen und canvas initialisieren
let renderer = new Renderer();

// initialize VertexBuffer
const vertexBuffer = new VertexBuffer(positions, 2);
const texCoordsBuffer = new VertexBuffer(texCoords, 2);

// initialize Cube data
// shader
let shader = new Shader(vsSource, fsSource);
let texture = new Texture("uTexture", shader, "./textures/todo.jpg", 0, texCoordsBuffer, "aTexCoord");
let drawable = new Drawable(vertexBuffer, indices, texture);

function render(now)
{
    renderer.clear(canvas, canvasColor);
    renderer.drawDrawable(drawable);

    if (!drawable.material.loaded)
    {
        requestAnimationFrame(render);
    }
    else
    {
            drawable.delete();
            vertexBuffer.delete();
            texCoordsBuffer.delete();
    }
}

requestAnimationFrame(render);