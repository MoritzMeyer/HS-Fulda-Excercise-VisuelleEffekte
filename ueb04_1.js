import Webgl from "./Engine/Webgl.js";
import Renderer from "./Engine/Renderer.js";
import Camera from "./Engine/Camera.js";
import LightSource from "./Engine/LightSource.js";
import Cube3D from "./Engine/GameObjects/Cube3D.js";
import Color from "./Engine/Color.js";
import Shader from "./Engine/Shader.js";
import Cube3Dnormals from "./Engine/GameObjects/Cube3Dnormals.js";



// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);
let canvasColor = [0.42, 0.6, 0.0, 1.0];

// initialize Application
let renderer = new Renderer();
let camera = new Camera();
Webgl.addNavigationListener(canvas, camera);
Webgl.addCameraRotation(canvas, camera);
camera.viewMatrix.translate([0, 0, -10.0]);

let lightSource = LightSource.getDefaultLightSource();
lightSource.gameObject.transform.translate([2.0, 2.0, 0]);

let cube = new Cube3Dnormals(new Color("uObjectColor", Shader.getDefaultColorLightShader(), [0.25, 0.25, 0.25]));


requestAnimationFrame(render);
function render(now)
{
    renderer.clear(canvas, canvasColor);
    lightSource.drawLightObject(camera);
    renderer.drawGameObject(cube.gameObject, camera, lightSource);
    requestAnimationFrame(render);
}


