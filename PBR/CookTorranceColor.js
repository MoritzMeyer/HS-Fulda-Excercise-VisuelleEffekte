import Webgl from "../Engine/Webgl.js";
import Renderer from "../Engine/Renderer.js";
import Camera from "../Engine/Camera.js";
import Color from "../Engine/Color.js";
import Shader from "../Engine/Shader.js";
import Light from "../Engine/Light.js";
import Plane from "../Engine/GameObjects/Plane.js";
import OBJ from "../Engine/OBJ.js";
import Cube3D from "../Engine/GameObjects/Cube3D.js";
import Sphere3D from "../Engine/GameObjects/Sphere3D.js";
import DirectionalLight from "../Engine/DirectionalLight.js";
import PointLight from "../Engine/PointLight.js";
import SpotLight from "../Engine/SpotLight.js";
import {LightType} from "../Engine/LightType.js";
import MaterialPBR from "../Engine/MaterialPBR.js";
import CoordinateAxises3D from "../Engine/GameObjects/CoordinateAxises3D.js";



Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);
let canvasColor = [0.0, 0.66, 1, 1.0];


// initialize Application
let renderer = new Renderer();
let camera = new Camera();
Webgl.addNavigationListener2(canvas, camera);
Webgl.addCameraRotation(canvas, camera);
//Webgl.addCameraExamine(canvas, camera);

camera.gameObject.transform.translate([-5.8, -3.4, -12.0]);
camera.gameObject.transform.rotateY(-90);

// Get Light with Shadows
//let directionLight = DirectionalLight.getDefaultDirectionalLight();
//directionLight.activateShadows();
let light1 = new Light([1, 1, 1], false, LightType.point, "lights[0]");
let light2 = new Light([1, 1, 1], false, LightType.point, "lights[1]");
let light3 = new Light([1, 1, 1], false, LightType.point, "lights[2]");
let light4 = new Light([1, 1, 1], false, LightType.point, "lights[3]");
light1.gameObject.transform.setPosition([1, 1, -3]);
light2.gameObject.transform.setPosition([1, 1, -9]);
light3.gameObject.transform.setPosition([1, 7, -3]);
light4.gameObject.transform.setPosition([1, 7, -9]);
renderer.pushLight(light1);
renderer.pushLight(light2);
renderer.pushLight(light3);
renderer.pushLight(light4);

renderer.lights.forEach((l) => l.setLightIntensity(100));


// Set canvas width and height for Shadow rendering
renderer.setCanvasDimensions(canvas.width, canvas.height);

let sphere1 = new Sphere3D(new MaterialPBR(Shader.getCookTorrancePBR(renderer.pointLights), [0, 0, 0.5], 0.5, 0.5, 1.0), 30);
sphere1.gameObject.transform.setPosition([0, 0, 5]);
let coords = new CoordinateAxises3D();
let elements = [sphere1];

let rowSize = 7;
let colSize = 7;
let yStart = 8;
let offset = 1.5;
let zStart = -1.5;
for (let row = 0; row < rowSize; row++)
{
    for (let col = 0; col < colSize; col++)
    {
        let sphere = new Sphere3D(new MaterialPBR(Shader.getCookTorrancePBR(renderer.pointLights), [0.5, 0, 0], (row + 1)/rowSize, ((col + 1)/colSize).clamp(0.05, 1.0), 1.0), 30);
        //let sphere = new Sphere3D(new MaterialPBR(Shader.getCookTorrancePBR(renderer.pointLights), [0.5, 0, 0], 0.5, 0.5, 1.0), 30);
        sphere.gameObject.transform.setPosition([-2, yStart - (col * offset), zStart - (row * offset)]);
        sphere.gameObject.transform.setScale([0.75, 0.75, 0.75]);
        //sphere.gameObject.material.setAlbedo([0.2 * col, 0, 0]);
        elements.push(sphere);
    }
}




//Webgl.addSlider("Metallic", 0.5, 0.05, 1.0, 0.05, (value) => {sphere1.gameObject.material.setMetallic(value)});
//Webgl.addSlider("Roughness", 0.5, 0.05, 1.0, 0.05, (value) => {sphere1.gameObject.material.setRoughness(value)});
Webgl.addSlider("LightIntensity", 100, 10, 500, 50, (value) => {renderer.lights.forEach((l) => l.setLightIntensity(value))});

requestAnimationFrame(render);


function render(now)
{


    renderer.clear(canvas, canvasColor);
    renderer.drawElements(elements, camera);
    requestAnimationFrame(render);
}