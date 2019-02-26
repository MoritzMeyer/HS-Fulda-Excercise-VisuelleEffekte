import Webgl from "./Engine/Webgl.js";
import Renderer from "./Engine/Renderer.js";
import Camera from "./Engine/Camera.js";
import Cube3D from "./Engine/GameObjects/Cube3D.js";
import Sphere3D from "./Engine/GameObjects/Sphere3D.js";
import Tree3D from "./Engine/GameObjects/Tree3D.js";

// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);

let tree = new Tree3D();
let canvasColor = [0.42, 0.6, 0.0, 1.0];

// initialize Application
let renderer = new Renderer();
let camera = new Camera();


camera.viewMatrix.translate([0, 0, -15.0]);

Webgl.addNavigationListener(canvas, camera);
Webgl.addCameraRotation(canvas, camera);

requestAnimationFrame(render);
function render(now)
{
    renderer.clear(canvas, canvasColor);
    renderer.drawGameObject(tree.gameObject, camera);
    requestAnimationFrame(render);
}


