main();

function main()
{
    drawScene();
}


function drawScene()
{
    const renderer = getRenderer();
    const gl = renderer.gl;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.viewport(0, 0, renderer.canvas.width, renderer.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT |	gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, renderer.positionBuffer);
    gl.vertexAttribPointer(renderer.vertexAttribLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(renderer.vertexAttribLocation);

    gl.useProgram(renderer.shaderProgram);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
    gl.disableVertexAttribArray(renderer.vertexAttribLocation);
    gl.deleteBuffer(renderer.positionBuffer);

    // aufräumen
    clearRenderer(renderer);
}



function getRenderer()
{
    // Idee für Renderer => mit dem Objekt wird jedes Frame gerendert, d.h. hier wird einmal die Zeichenfläche etc. erstellt und dann
    // alle Positionen mit Shadern und farben etc. in einem Objekt liefern.
    // Den Renderer dann mit

    const canvas = document.querySelector('#glcanvas');
    const gl = canvas.getContext('webgl', {alpha: true, depth: true});


    const vsSource = `
		attribute vec2 position;
		void main() {
			gl_Position = vec4(position, 1.0, 1.0);
		}
	`;

    const fsSource = `
		void main() {
			gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
		}
	`;

    // Shader erstellen
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // das Shader Programm erstellen
    const shaderProgram = initShaderProgram(gl, vertexShader, fragmentShader);

    const positionBuffer = initSimplePointBuffers(gl);
    const vertexAttribLocation = gl.getAttribLocation(shaderProgram, "position");



    return {
        canvas: canvas,
        gl: gl,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        shaderProgram: shaderProgram,
        positionBuffer: positionBuffer,
        vertexAttribLocation: vertexAttribLocation,
    }
}



function initSimplePointBuffers(gl)
{
    // Position des Punktes
    const positions = [-0.5, 0, 0.5, 0, 0, 0.5];

    // Den PositionBuffer erstellen und mit den Positionen füllen.
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW);

    return positionBuffer;
}

function clearRenderer(renderer)
{
    // aufräumen
    renderer.gl.detachShader(renderer.shaderProgram, renderer.vertexShader);
    renderer.gl.detachShader(renderer.shaderProgram, renderer.fragmentShader);
    renderer.gl.deleteShader(renderer.vertexShader);
    renderer.gl.deleteShader(renderer.fragmentShader);
    renderer.gl.deleteProgram(renderer.shaderProgram);
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