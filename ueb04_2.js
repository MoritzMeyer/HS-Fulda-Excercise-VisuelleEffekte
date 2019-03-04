import Webgl from "./Engine/Webgl.js";
import Renderer from "./Engine/Renderer.js";
import Camera from "./Engine/Camera.js";
import Color from "./Engine/Color.js";
import Shader from "./Engine/Shader.js";
import Light from "./Engine/Light.js";
import Plane from "./Engine/GameObjects/Plane.js";
import OBJ from "./Engine/OBJ.js";



// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);
let canvasColor = [0.42, 0.6, 0.0, 1.0];

// initialize Application
let renderer = new Renderer();
let camera = new Camera();
Webgl.addNavigationListener(canvas, camera);
Webgl.addCameraRotation(canvas, camera);
//Webgl.addCameraExamine(canvas, camera);
camera.gameObject.transform.translate([0, 2, -15.0]);
camera.gameObject.transform.rotateX(35);


let light = Light.getDefaultLight();
renderer.lights.push(light);


//light.gameObject.transform.translate([0, -5.0, -5.0]);
light.gameObject.transform.translate([2.0, 1.0, 0]);
let capsule = new OBJ("./textures/capsule/capsule.obj", 1, true, null);
//let cube = new Cube3D(new Color("uObjectColor", Shader.getDefaultColorLightShader(), [0.5, 0.1, 0.1]));
//let plane = new Plane(new Color("uObjectColor", Shader.getDefaultColorLightShader(), [0.5, 0.1, 0.1]));
//plane.gameObject.transform.setScale([2.0, 0, 2.0]);

capsule.checkLoaded(() =>
{
    capsule.gameObject.transform.rotateX(90);
});

requestAnimationFrame(render);
function render(now)
{
    renderer.clear(canvas, canvasColor);
    renderer.drawWithoutLights(light.lightObject.gameObject, camera);
    if (capsule.isLoaded)
    {
        renderer.drawGameObject(capsule.gameObject, camera);
    }
    requestAnimationFrame(render);
}


