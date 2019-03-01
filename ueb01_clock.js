import Material from "./Engine/Material.js";
import Webgl from "./Engine/Webgl.js";
import Renderer from "./Engine/Renderer.js";
import Shader from "./Engine/Shader.js";
import VertexBuffer from "./Engine/VertexBuffer.js";
import Color from "./Engine/Color.js";
import GameObject from "./Engine/GameObject.js";
import Camera from "./Engine/Camera.js";
import Matrix from "./Engine/Matrix.js";

// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);
const gl = Webgl.getGL();

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
/*
const vsSource =
`
    attribute vec3 position;
    void main() {
        gl_PointSize = 10.0;
        gl_Position = vec4(position, 1.0);
}
`;
*/

const fsSource =
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
}`;

let positions =
    [
        // pointer minutes
        0.04, 0,
        -0.04,  1.65,
        0.04,  1.65,
        -0.04, 0,

        // pointer seconds
        0.025, 0,
        -0.025, 1.85,
        0.025, 1.85,
        -0.025, 0,

        // triangle minutes
        -0.04, 1.65,
        0, 1.75,
        0.04, 1.65,

        // triangle seconds
        -0.025, 1.85,
        0, 1.95,
        0.025, 1.85
    ];

// color Arrays
let minutesColors = [0.0, 0.8, 0.0];
let secondsColors = [0.8, 0.0, 0.0];

// Index Arrays
let indicesMinutes = [0, 1, 2, 0, 1 , 3, 8, 9, 10];
let indicesSeconds = [4, 5, 6, 4, 5, 7, 11, 12, 13];

let canvasColor = [0.0, 0.0, 0.0, 0.0];

// Engine erzeugen und canvas initialisieren
let renderer = new Renderer();
renderer.clear(canvas, canvasColor);
const vertexBuffer = new VertexBuffer(positions, 2);

// initialize MinutesPointer data
let shaderMinutePointer = new Shader(vsSource, fsSource);
let colorMinutePointer = new Color("uObjectColor", shaderMinutePointer, minutesColors);
let gameObjectMinutePointer = new GameObject(vertexBuffer, indicesMinutes, colorMinutePointer);

// initialize SecondsPointer data
let shaderSecondsPointer = new Shader(vsSource, fsSource);
let colorSecondsPointer = new Color("uObjectColor", shaderSecondsPointer, secondsColors);
let gameObjectSecondsPointer = new GameObject(vertexBuffer, indicesSeconds, colorSecondsPointer);

let camera = new Camera();
camera.gameObject.transform.translate([0.0, 0.0, -6.0]);

let then = 0;
let secondsCounter = 0;
let minutesCounter = 0;

requestAnimationFrame(render);

function render(now)
{
    now *= 0.001; // convert to seconds
    const deltaTime = now - then;
    then = now;

    secondsCounter += deltaTime;
    minutesCounter += deltaTime;

    // rotate seconds pointer
    if (secondsCounter >= 1)
    {
        // rotate around z axis minus 6 degrees
        gameObjectSecondsPointer.transform.rotateZ(-6);
        secondsCounter = 0;
    }


    // rotate minutes counter
    if (minutesCounter > 61)
    {
        // rotate around z axis minus 6 degrees
        gameObjectMinutePointer.transform.rotateZ(-6);
        minutesCounter = 0;
    }


    // Draw Minutes & SecondsPointer
    renderer.clear(canvas, canvasColor);
    renderer.drawGameObject(gameObjectSecondsPointer, camera);
    renderer.drawGameObject(gameObjectMinutePointer, camera);
    requestAnimationFrame(render);
}



