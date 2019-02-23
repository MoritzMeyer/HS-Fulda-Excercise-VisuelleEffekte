import Webgl from "./Renderer/Webgl.js";
import Renderer from "./Renderer/Renderer.js";
import Shader from "./Renderer/Shader.js";
import VertexBuffer from "./Renderer/VertexBuffer.js";
import Color from "./Renderer/Color.js";
import Drawable from "./Renderer/Drawable.js";
import Camera from "./Renderer/Camera.js";

// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);


const vsSource =
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

const fsSource =
    `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    uniform vec3 uColor;
    void main() {
        gl_FragColor = vec4(uColor, 1.0);
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

// color Arrays
let cubeColors = [0.73, 0.7, 0.36];
let triangleColors = [0.5, 0.0, 0.0];

// Index Arrays
let indicesCube = [0, 1, 2, 0, 1 , 3];
let indicesTriangle = [4, 5, 6];

let canvasColor = [0.42, 0.6, 0.0, 1.0];

// Renderer erzeugen und canvas initialisieren
let renderer = new Renderer();
let camera = new Camera();

// initialize VertexBuffer
const vertexBuffer = new VertexBuffer(positions, 2);

// initialize Cube data
// shader
let shaderCube = new Shader(vsSource, fsSource);
let colorCube = new Color("uColor", shaderCube, cubeColors);
let drawableCube = new Drawable(vertexBuffer, indicesCube, colorCube);

// initialize Triangle Data
// shader
let shaderTriangle = new Shader(vsSource, fsSource);
let colorTriangle = new Color("uColor", shaderTriangle, triangleColors);
let drawableTriangle = new Drawable(vertexBuffer, indicesTriangle, colorTriangle);

canvas.setAttribute("tabindex", "0");
canvas.addEventListener('keydown', (event) =>
{
        switch(event.keyCode)
        {
            case 37:    // left
                camera.viewMatrix.translate([0.01, 0, 0]);
                break;
            case 38:    // up
                camera.viewMatrix.translate([0, 0.01, 0]);
                break;
            case 39:    // right
                camera.viewMatrix.translate([-0.01, 0, 0]);
                break;
            case 40:    // down
                camera.viewMatrix.translate([0, -0.01, 0]);
                break;
            case 107:   // +
            case 187:
                camera.viewMatrix.translate([0, 0, 0.01]);
                break;
            case 109:   // -
            case 189:
                camera.viewMatrix.translate([0, 0, -0.01]);
                break;
        }
}, true);

/*
renderer.clear(canvas, canvasColor);
renderer.drawDrawable(drawableCube, camera);
renderer.drawDrawable(drawableTriangle, camera);
*/

camera.viewMatrix.translate([0.0, 0.0, -4.0]);
requestAnimationFrame(render);

function render(now)
{
    renderer.clear(canvas, canvasColor);
    renderer.drawDrawable(drawableCube, camera);
    renderer.drawDrawable(drawableTriangle, camera);

    requestAnimationFrame(render);
}


//drawableCube.delete();
//drawableTriangle.delete();
//vertexBuffer.delete();


