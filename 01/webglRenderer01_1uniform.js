main();

function main()
{
    drawScene();
}

function drawScene()
{
    const canvas = document.querySelector('#glcanvas');
    const renderer = getRenderer(canvas);

    const precision = `
        #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision	highp float;
        #else
        precision	mediump float;
        #endif`;

    const vsSource = `
		attribute vec3 position;
		attribute vec3 color;
		uniform vec3 translation;
		varying vec3 vColor;
		void main() {
		    vColor = color;
			gl_Position = vec4(position + translation, 1.0);
		}
	`;

    const fsSource = precision +
        `
        varying vec3 vColor;
        uniform vec3 uColor;
		void main() {
			gl_FragColor = vec4(vColor, 1.0);
		}
	`;

    const trianglePositions = [
        -0.75, 0.25, 0,
         0.75, 0.25, 0,
         0, 0.9, 0
    ];

    const cubePositions = [
        -0.5, 0.2, 0,
         0.5, 0.2, 0,
        -0.5, -0.75, 0,
         0.5, -0.75, 0
    ];

    const triangleColor = [
        0.5, 0.0, 0.0,
        0.5, 0.0, 0.0,
        0.5, 0.0, 0.0];
    const cubeColor = [0.73, 0.7, 0.36];

    renderer.ClearCanvas();
    renderer.DrawObject(trianglePositions, triangleColor, vsSource, fsSource, 3);
    //renderer.DrawObject(cubePositions, cubeColor, vsSource, fsSource, 4);
}


function getRenderer(canvas) {
    // initialize gl context
    const gl = canvas.getContext('webgl', {alpha: true, depth: true});

    const RENDERER = {};
    RENDERER.ClearCanvas = (function()
    {
        gl.clearColor(0.42, 0.6, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT |	gl.DEPTH_BUFFER_BIT);
    });

    RENDERER.DrawObject = (function(positions, color, vsSource, fsSource, numbVertices)
    {
       drawObject(gl, positions, color, vsSource, fsSource, numbVertices);
    });

    return RENDERER;
}

function drawObject(gl, positions, color, vsSource, fsSource, numbVertices)
{
    // Shader erstellen
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // das Shader Programm erstellen
    const shaderProgram = initShaderProgram(gl, vertexShader, fragmentShader);

    // den positionBuffer erstellen.
    const shaderData = initBuffers(gl, positions, color);
    const positionAttribLocation = gl.getAttribLocation(shaderProgram, "position");
    const colorAttribLocation = gl.getAttribLocation(shaderProgram, "color");

    console.log(positionAttribLocation);
    console.log(colorAttribLocation);
    console.log(numbVertices);

    var	col	=	gl.getUniformLocation(shaderProgram,	"uColor");
    var	trans	=	gl.getUniformLocation(shaderProgram,	"translation");



    gl.useProgram(shaderProgram);
    //gl.uniform3f(col, 1, 0, 0);
    gl.uniform3f(trans, 0, 0, 0);

    // Den Position Buffer binden und das Zeichnen vorbereiten.
    gl.bindBuffer(gl.ARRAY_BUFFER, shaderData.positions);
    gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttribLocation);

    // Den color Buffer binden und das Zeichnen vorbereiten
    gl.bindBuffer(gl.ARRAY_BUFFER, shaderData.color);
    gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorAttribLocation);

    // Das Objekt zeichnen.
    gl.drawArrays(gl.TRIANGLES, 0, numbVertices);

    // Aufräumen
    gl.disableVertexAttribArray(positionAttribLocation);
    gl.disableVertexAttribArray(colorAttribLocation);





    gl.deleteBuffer(shaderData.positions);
    gl.deleteBuffer(shaderData.color);
    gl.detachShader(shaderProgram, vertexShader);
    gl.detachShader(shaderProgram, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.deleteProgram(shaderProgram);
}

function initBuffers(gl, positions, color)
{
    const SHADER_DATA = {};
    // Den PositionBuffer erstellen und mit den Positionen füllen.
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW);

    SHADER_DATA.positions = positionBuffer;

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(color),
        gl.STATIC_DRAW);

    SHADER_DATA.color = colorBuffer;

    return SHADER_DATA;
}


// Initialize a shade program, so WebGL knows how to draw our data
function initShaderProgram(gl, vertexShader, fragmentShader)
{
    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // if creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

// creates a shader of the given type, uploads the source and compiles it.
function loadShader(gl, type, source)
{
    const shader = gl.createShader(type);

    // send the source to the shader object
    gl.shaderSource(shader, source);

    // compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        alert("An error ocurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}