import Webgl from "./Engine/Webgl.js";
import Renderer from "./Engine/Renderer.js";
import Camera from "./Engine/Camera.js";
import Cube3D from "./Engine/GameObjects/Cube3D.js";
import Sphere3D from "./Engine/GameObjects/Sphere3D.js";
import Cylinder3D from "./Engine/GameObjects/Cylinder3D.js";
import OBJ from "./Engine/OBJ.js";

// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);

let cube = new Cube3D(null);
let sphere = new Sphere3D(null);
let cylinder = new Cylinder3D();
let cone = new OBJ("./textures/cone.obj", 1, false, null);
let canvasColor = [0.42, 0.6, 0.0, 1.0];

// initialize Application
let renderer = new Renderer();
let camera = new Camera();


camera.gameObject.transform.translate([0.0, 0.0, -15.0]);
cube.gameObject.transform.translate([-2, 0, 0]);
sphere.gameObject.transform.translate([2, 0, 0]);
//cylinder.gameObject.transform.translate([4, 0, 0]);
cone.checkLoaded(() =>
{
   cone.gameObject.transform.translate([4, 0, 0]);
});


Webgl.addNavigationListener(canvas, camera);

requestAnimationFrame(render);
function render(now)
{
    renderer.clear(canvas, canvasColor);
    cube.gameObject.transform.rotate(1, [1, 1, 1]);
    sphere.gameObject.transform.rotate(1, [1, 1, 1]);
    cylinder.gameObject.transform.rotate(1, [1, 1, 1]);
    renderer.drawGameObject(cube.gameObject, camera);
    renderer.drawGameObject(sphere.gameObject, camera);
    renderer.drawGameObject(cylinder.gameObject, camera);
    requestAnimationFrame(render);
}


