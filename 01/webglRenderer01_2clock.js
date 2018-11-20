main();

function main()
{
    drawScene();
}

async function drawScene()
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
		uniform mat4 rotation;
		varying vec3 vColor;
		void main() {
		    vColor = color;
			gl_Position = rotation * vec4(position + translation, 1.0);
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
        -0.05, 0.6, 0,
        0.05, 0.6, 0,
        0, 0.7, 0
    ];

    const cubePositions = [
        -0.025, 0.6, 0,
        0.025, 0.6, 0,
        -0.025, 0.075, 0,
        0.025, 0.075, 0
    ];

    const triangleColor = [
        0.5, 0.0, 0.0,
        0.5, 0.0, 0.0,
        0.5, 0.0, 0.0
    ];

    const cubeColor = [
        0.0, 0.0, 0.0,
        0.0, 0.0, 0.0,
        0.0, 0.0, 0.0,
        0.0, 0.0, 0.0
    ];

    renderer.init(vsSource, fsSource);
    renderer.AddDrawable(trianglePositions, 3, triangleColor, 3, 3);
    renderer.AddDrawable(cubePositions, 3, cubeColor, 3, 4);

    let rotationMatrix = [
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ];

    let triangleUniform = {
        position: [0.0, 0.0, 0.0],
        rotation: rotationMatrix,
        color: [0.0, 0.0, 0.0]
    };

    let cubeUniform = {
        position: [0.0, 0.0, 0.0],
        rotation: rotationMatrix,
        color: [0.0, 0.0, 0.0]
    };

    let objectUniform = renderer.update();
    renderer.renderFrame([objectUniform, objectUniform]);
    sleep(1000);
    renderer.renderFrame([objectUniform, objectUniform]);
    sleep(1000);
    renderer.renderFrame([objectUniform, objectUniform]);
    sleep(1000);
    renderer.renderFrame([objectUniform, objectUniform]);
    sleep(1000);
    renderer.renderFrame([objectUniform, objectUniform]);
    sleep(1000);
    renderer.renderFrame([objectUniform, objectUniform]);
    sleep(1000);
    renderer.renderFrame([objectUniform, objectUniform]);
    sleep(1000);
    renderer.renderFrame([objectUniform, objectUniform]);
    sleep(1000);
    renderer.renderFrame([objectUniform, objectUniform]);
    sleep(1000);
}


function getRenderer(canvas) {
    // initialize gl context
    const gl = canvas.getContext('webgl', {alpha: true, depth: true});

    // initialize Array with ObjectData
    const objectsLocalData = [];

    const RENDERER = {};
    RENDERER.init = (function(vsSource, fsSource)
    {
        gl.clearColor(0.42, 0.6, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT |	gl.DEPTH_BUFFER_BIT);

        // Shader erstellen
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
        RENDERER.SHADER = initShaderProgram(gl, vertexShader, fragmentShader);
    });

    RENDERER.AddDrawable = (function(positions, positionDataDimension, color, colorDataDimension, numbVertices)
    {
        const objectData = {};
        const bufferData = initBuffers(gl, positions, color);
        objectData.positionBuffer = bufferData.positions;
        objectData.colorBuffer = bufferData.color;
        objectData.positionDataDimension = positionDataDimension;
        objectData.colorDataDimension = colorDataDimension;
        objectData.numbVertices = numbVertices;

        objectsLocalData.push(objectData);
    });

    RENDERER.update = (function() {
        update();
    });

    RENDERER.renderFrame = (function(objectsUniformData)
    {
        if (objectsLocalData.length != objectsUniformData.length)
        {
            alert("'objectsLocalData' and 'objectsUniformData' have to be of the same size.");
        }

        renderFrame(gl, RENDERER.SHADER, objectsLocalData, objectsUniformData);
    });

    RENDERER.shutdown = (function()
    {
        gl.deleteBuffer(RENDERER.SHADER.vertexPosition);
        gl.deleteBuffer(RENDERER.SHADER.vertexColor);
        gl.detachShader(RENDERER.SHADER.program, RENDERER.SHADER.vertexShader);
        gl.detachShader(RENDERER.SHADER.program, RENDERER.SHADER.fragmentShader);
        gl.deleteShader(RENDERER.SHADER.vertexShader);
        gl.deleteShader(RENDERER.SHADER.fragmentShader);
        gl.deleteProgram(RENDERER.SHADER.program);
    });

    return RENDERER;
}

function renderFrame(gl, shader, objectsLocalData, objectsUniformData)
{
    let angle = -6.0;
    let rotationMatrix = [
        Math.cos(angle), -Math.sin(angle), 0, 0,
        Math.sin(angle), Math.cos(angle), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    //alert(objectsUniformData[0].uniformColor);
    for (let i = 0; i < objectsLocalData.length; i++) {
        gl.useProgram(shader.program);
        gl.uniform3f(shader.uniformColor, 0, 0, 0);
        gl.uniform3f(shader.uniformTranslation, 0, 0, 0);
        gl.uniformMatrix4fv(shader.uniformRotation, false, new Float32Array(rotationMatrix));

        // Den Position Buffer binden und das Zeichnen vorbereiten.
        gl.bindBuffer(gl.ARRAY_BUFFER, objectsLocalData[i].positionBuffer);
        gl.vertexAttribPointer(shader.vertexPosition, objectsLocalData[i].positionDataDimension, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader.vertexPosition);

        // Den color Buffer binden und das Zeichnen vorbereiten
        gl.bindBuffer(gl.ARRAY_BUFFER, objectsLocalData[i].colorBuffer);
        gl.vertexAttribPointer(shader.vertexColor, objectsLocalData[i].colorDataDimension, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader.vertexColor);

        // Das Objekt zeichnen.
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, objectsLocalData[i].numbVertices);

        // Aufräumen
        gl.disableVertexAttribArray(shader.vertexPosition);
        gl.disableVertexAttribArray(shader.vertexColor);
    }
}

function update()
{
    let angle = 6.0;
    let rotationMatrix = [
        Math.cos(angle), -Math.sin(angle), 0, 0,
        Math.sin(angle), Math.cos(angle), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    let objectData = {
        uniformPosition: [0.0, 0.0, 0.0],
        uniformRotation: rotationMatrix,
        uniformColor: [0.0, 0.0, 0.0]
    };

    return objectData;
}

function initBuffers(gl, positions, color)
{
    const bufferData = {};
    // Den PositionBuffer erstellen und mit den Positionen füllen.
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW);

    bufferData.positions = positionBuffer;

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(color),
        gl.STATIC_DRAW);

    bufferData.color = colorBuffer;

    return bufferData;
}


// Initialize a shade program, so WebGL knows how to draw our data
function initShaderProgram(gl, vertexShader, fragmentShader)
{
    // Create the shader program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // if creating the shader program failed, alert
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
        return null;
    }

    const SHADER = {};
    SHADER.program = program;
    SHADER.vertexPosition = gl.getAttribLocation(program, "position");
    SHADER.vertexColor = gl.getAttribLocation(program, "color");
    SHADER.uniformTranslation = gl.getUniformLocation(program, "translation");
    SHADER.uniformColor = gl.getUniformLocation(program, "uColor");
    SHADER.uniformRotation = gl.getUniformLocation(program, "rotation");
    SHADER.vertexShader = vertexShader;
    SHADER.fragmentShader = fragmentShader;

    return SHADER;
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}