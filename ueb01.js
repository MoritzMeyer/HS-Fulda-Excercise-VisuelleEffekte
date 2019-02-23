import Webgl from "./Renderer/Webgl.js";
import Renderer from "./Renderer/Renderer.js";
import Shader from "./Renderer/Shader.js";
import IndexBuffer from "./Renderer/IndexBuffer.js";
import VertexArray from "./Renderer/VertexArray.js";
import VertexBuffer from "./Renderer/VertexBuffer.js";

// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);

const vsSource =
`
    attribute vec3 position;
    void main() {
        gl_PointSize = 10.0;
        gl_Position = vec4(position, 1.0);
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
renderer.clear(canvas, canvasColor);

// initialize Cube data
// shader
let shaderCube = new Shader(vsSource, fsSource);
shaderCube.bind();
shaderCube.setUniform3f("uColor", cubeColors[0], cubeColors[1], cubeColors[2]);
let cubePositionLocation = shaderCube.getAttribLocation("position");

// Buffers
const indexBufferCube = new IndexBuffer(indicesCube);
const vertexBuffer = new VertexBuffer(positions);
const vertexArrayCube = new VertexArray();

// AttribLocation to VertexArray
vertexArrayCube.addBuffer(vertexBuffer, [cubePositionLocation], 2, 0);

// Draw Cube and unbind
renderer.draw(vertexArrayCube, indexBufferCube, shaderCube);
shaderCube.delete();
indexBufferCube.delete();

// initialize Triangle Data
// shader
let shaderTriangle = new Shader(vsSource, fsSource);
shaderTriangle.bind();
shaderTriangle.setUniform3f("uColor", triangleColors[0], triangleColors[1], triangleColors[2]);
let trianglePositionLocation = shaderTriangle.getAttribLocation("position");

// Buffers
const indexBufferTriangle = new IndexBuffer(indicesTriangle);
const vertexArrayTriangle = new VertexArray();

// AttribLocation to VertexArray
vertexArrayTriangle.addBuffer(vertexBuffer, [trianglePositionLocation], 2, 0);

// Draw Triangle and unbind
renderer.draw(vertexArrayTriangle, indexBufferTriangle, shaderTriangle);
shaderTriangle.delete();
indexBufferTriangle.delete();
vertexBuffer.delete();