main();

function main()
{
    drawScene();
}

function drawScene()
{
    const renderer = getRenderer();

    const vsSource = `
		attribute vec2 position;
		void main() {
		    gl_PointSize = 10.0;
			gl_Position = vec4(position, 1.0, 1.0);
		}
	`;

    const fsBlue = `
        void main() {
            gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
        }
    `;

    const fsRed = `
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `;

    const fsGreen = `
        void main() {
            gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
        }
    `;

    const fsWhite = `
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `;

    const point1 = [-0.5, 0.2];
    const point2 = [0.5, 0.2];
    const point3 = [-0.5, -0.75];
    const point4 = [0.5, -0.75];

    renderer.ClearCanvas();
    //renderer.DrawObject(cubePositions, vsSource, fsSourceCube, 4);
    renderer.DrawObject(point1, vsSource, fsRed, 1);
    renderer.DrawObject(point2, vsSource, fsGreen, 1);
    renderer.DrawObject(point3, vsSource, fsBlue, 1);
    renderer.DrawObject(point4, vsSource, fsWhite, 1);
}


function getRenderer() {
    // initialize gl context
    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl', {alpha: true, depth: true});

    const RENDERER = {};
    RENDERER.ClearCanvas = (function()
    {
        //gl.clearColor(0.42, 0.6, 0.0, 1.0);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT |	gl.DEPTH_BUFFER_BIT);
    });

    RENDERER.DrawObject = (function(positions, vsSource, fsSource, numbVertices)
    {
       drawObject(gl, positions, vsSource, fsSource, numbVertices);
    });

    return RENDERER;
}

function drawObject(gl, positions, vsSource, fsSource, numbVertices)
{
    // Shader erstellen
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // das Shader Programm erstellen
    const shaderProgram = initShaderProgram(gl, vertexShader, fragmentShader);

    // den positionBuffer erstellen.
    const positionBuffer = initPositionBuffer(gl, positions);
    const vertexAttribLocation = gl.getAttribLocation(shaderProgram, "position");

    // Den Buffer binden und das Zeichnen vorbereiten.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(vertexAttribLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexAttribLocation);
    gl.useProgram(shaderProgram);

    // Das Objekt zeichnen.
    gl.drawArrays(gl.POINTS, 0, numbVertices);

    // Aufräumen
    gl.disableVertexAttribArray(vertexAttribLocation);
    gl.deleteBuffer(positionBuffer);
    gl.detachShader(shaderProgram, vertexShader);
    gl.detachShader(shaderProgram, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.deleteProgram(shaderProgram);
}

function initPositionBuffer(gl, positions)
{
    // Den PositionBuffer erstellen und mit den Positionen füllen.
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW);

    return positionBuffer;
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