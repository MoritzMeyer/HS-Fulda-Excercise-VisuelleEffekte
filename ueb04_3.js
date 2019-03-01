import Webgl from "./Engine/Webgl.js";
import Renderer from "./Engine/Renderer.js";
import Camera from "./Engine/Camera.js";
import OBJ from "./Engine/OBJ.js";
import Shader from "./Engine/Shader.js";

// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);
let canvasColor = [0.42, 0.6, 0.0, 1.0];

// initialize Application
let renderer = new Renderer();
let camera = new Camera();
Webgl.addNavigationListener(canvas, camera);
Webgl.addCameraRotation(canvas, camera);
camera.gameObject.transform.translate([0, 0, -10.0]);

let capsule = new OBJ("./textures/capsule/capsule.obj", 1, Shader.getDefaultTextureShader());
//let capsule = new OBJ("./textures/bunny/bunny.obj", 1, Shader.getDefaultTextureShader());
capsule.checkLoaded(() =>
{
    capsule.gameObject.transform.rotateX(90);
});

requestAnimationFrame(render);
function render(now)
{
    renderer.clear(canvas, canvasColor);
    if (capsule.isLoaded)
    {
        renderer.drawGameObject(capsule.gameObject, camera);
    }
    requestAnimationFrame(render);
}


