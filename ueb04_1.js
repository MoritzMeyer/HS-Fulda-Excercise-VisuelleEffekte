import Webgl from "./Engine/Webgl.js";
import Renderer from "./Engine/Renderer.js";
import Camera from "./Engine/Camera.js";
import Color from "./Engine/Color.js";
import Shader from "./Engine/Shader.js";
import Light from "./Engine/Light.js";
import Plane from "./Engine/GameObjects/Plane.js";
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
//Webgl.addCameraExamine(canvas, camera);
camera.viewMatrix.translate([0, 2, -15.0]);
camera.viewMatrix.rotateX(35);


let light = Light.getDefaultLight();
//light.gameObject.transform.translate([0, -5.0, -5.0]);
light.gameObject.transform.translate([2.0, 2.0, 0]);
let cube = new Cube3Dnormals(new Color("uObjectColor", Shader.getDefaultColorLightShader(), [0.5, 0.1, 0.1]));
//let plane = new Plane(new Color("uObjectColor", Shader.getDefaultColorLightShader(), [0.7, 0, 0]));
//plane.gameObject.transform.translate([0, -7.0, -5.0]);


requestAnimationFrame(render);
function render(now)
{
    renderer.clear(canvas, canvasColor);
    renderer.drawWithoutLights(light.lightObject.gameObject, camera);
    renderer.drawWithLight(cube.gameObject, camera, light);
    requestAnimationFrame(render);
}


