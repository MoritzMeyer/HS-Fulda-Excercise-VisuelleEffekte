import Webgl from "./Engine/Webgl.js";
import Renderer from "./Engine/Renderer.js";
import Camera from "./Engine/Camera.js";
import Color from "./Engine/Color.js";
import Shader from "./Engine/Shader.js";
import Light from "./Engine/Light.js";
import Plane from "./Engine/GameObjects/Plane.js";
import OBJ from "./Engine/OBJ.js";
import Cube3D from "./Engine/GameObjects/Cube3D.js";
import Sphere3D from "./Engine/GameObjects/Sphere3D.js";
import DirectionalLight from "./Engine/DirectionalLight.js";
import PointLight from "./Engine/PointLight.js";
import SpotLight from "./Engine/SpotLight.js";



// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);
let canvasColor = [0.0, 0.66, 1, 1.0];
let rotation = false;

// initialize Application
let renderer = new Renderer();
let camera = new Camera();
Webgl.addNavigationListener(canvas, camera);
Webgl.addCameraRotation(canvas, camera);

camera.gameObject.transform.translate([0, -1, -25.0]);
camera.gameObject.transform.rotateX(35);

// Get Light with Shadows
let directionLight = DirectionalLight.getDefaultDirectionalLight();
directionLight.activateShadows();

renderer.pushLight(directionLight);

// Set canvas width and height for Shadow rendering
renderer.setCanvasDimensions(canvas.width, canvas.height);


let cube = new Cube3D(new Color(Shader.getDirectLightColorShadowShader(), [0.9, 0.1, 0.1]));
let plane = new Plane(new Color(Shader.getDirectLightColorShadowShader(), [0.3, 0.3, 0.3]));
let sphere1 = new Sphere3D(new Color(Shader.getDirectLightColorShadowShader(), [0, 1, 0.85]));
let sphere2 = new Sphere3D(new Color(Shader.getDirectLightColorShadowShader(), [0.95, 0.65, 0.06]));
let sphere3 = new Sphere3D(new Color(Shader.getDirectLightColorShadowShader(), [0.06, 0.95, 0.2]));
let sphere4 = new Sphere3D(new Color(Shader.getDirectLightColorShadowShader(), [0.6, 0.03, 0.83]));
plane.gameObject.transform.setScale([15.0, 0, 15.0]);

cube.gameObject.transform.setPosition([0, 1.5, 0]);
sphere1.gameObject.transform.setPosition([6, 1.5, 0]);
sphere2.gameObject.transform.setPosition([-6, 1.5, 0]);
sphere3.gameObject.transform.setPosition([0, 1.5, 6]);
sphere4.gameObject.transform.setPosition([0, 1.5, -6]);

let elements = [cube, plane, sphere1, sphere2, sphere3, sphere4];

//Webgl.addSlider("Ambient", light.ambient, 0.0, 1.0, 0.05, (value) => {light.setAmbientByFactor(value)});
//Webgl.addSlider("Diffuse", light.diffuse, 0.0, 1.0, 0.05, (value) => {light.setDiffuseByFac(value)});
//Webgl.addSlider("Specular", light.specular, 0.0, 1.0, 0.05, (value) => {light.setSpecularByFac(value)});
Webgl.addSlider("Material-Shininess", elements[0].gameObject.material.shininess, 1, 64, 1, (value) => {elements[0].gameObject.material.setShininess(value)});

requestAnimationFrame(render);


function render(now)
{
    renderer.clear(canvas, canvasColor);
    renderer.drawElements(elements, camera);
    requestAnimationFrame(render);
}