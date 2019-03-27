import Webgl from "../Engine/Webgl.js";
import Renderer from "../Engine/Renderer.js";
import Camera from "../Engine/Camera.js";
import Tree3D from "../Engine/GameObjects/Tree3D.js";
import CoordinateAxises3D from "../Engine/GameObjects/CoordinateAxises3D.js";

// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);

let canvasColor = [0.42, 0.6, 0.0, 1.0];




// initialize Application
let renderer = new Renderer();
let camera = new Camera();
let tree = new Tree3D();
let coord = new CoordinateAxises3D();

camera.gameObject.transform.translate([0.0, 0.0, -20.0]);
camera.gameObject.transform.rotateX(35);
tree.gameObject.transform.translate([-4, 0, 0]);

Webgl.addNavigationListener(canvas, camera);
let elements = [coord, tree];
requestAnimationFrame(render);
function render(now)
{
    renderer.clear(canvas, canvasColor);
    tree.gameObject.transform.rotateY(1);
    renderer.drawElements(elements, camera);
    requestAnimationFrame(render);
}


