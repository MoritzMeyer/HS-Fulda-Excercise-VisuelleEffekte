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
import PBRTexture from "../Engine/PBRTexture.js";



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

camera.gameObject.transform.rotateY(-90);
camera.gameObject.transform.translate([-5.8, -3.4, -7.0]);
//camera.gameObject.transform.translate([-6, -3.1, .0]);

// Get Light with Shadows
//let directionLight = DirectionalLight.getDefaultDirectionalLight();
//directionLight.activateShadows();
let light1 = new Light([1, 1, 1], true, LightType.point, "lights[0]");
let light2 = new Light([1, 1, 1], true, LightType.point, "lights[1]");
let light3 = new Light([1, 1, 1], true, LightType.point, "lights[2]");
let light4 = new Light([1, 1, 1], true, LightType.point, "lights[3]");
light1.gameObject.transform.setPosition([0, 1, -1]);
light2.gameObject.transform.setPosition([0, 1, -10]);
light3.gameObject.transform.setPosition([0, 5, -1]);
light4.gameObject.transform.setPosition([0, 5, -10]);
renderer.pushLight(light1);
renderer.pushLight(light2);
renderer.pushLight(light3);
renderer.pushLight(light4);


renderer.lights.forEach((l) => l.setLightIntensity(40));


// Set canvas width and height for Shadow rendering
renderer.setCanvasDimensions(canvas.width, canvas.height);

let sphere1 = Sphere3D.getRustedIronSphere(4, 30);
let sphere2 = Sphere3D.getGrimmyMetalSphere(4, 30);
let sphere3 = Sphere3D.getMetalgridSphere(4, 30);
let sphere4 = Sphere3D.getRustyPanelSphere(4, 30);

sphere1.gameObject.transform.setPosition([-2, 3, -2]);
sphere2.gameObject.transform.setPosition([-2, 3, -4.5]);
sphere3.gameObject.transform.setPosition([-2, 3, -7]);
sphere4.gameObject.transform.setPosition([-2, 3, -9.5]);



let elements = [sphere1, sphere2, sphere3, sphere4];

/*
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
*/


//Webgl.addSlider("Metallic", 0.5, 0.05, 1.0, 0.05, (value) => {sphere1.gameObject.material.setMetallic(value)});
//Webgl.addSlider("Roughness", 0.5, 0.05, 1.0, 0.05, (value) => {sphere1.gameObject.material.setRoughness(value)});
Webgl.addSlider("LightIntensity", 40, 0, 200, 10, (value) => {renderer.lights.forEach((l) => l.setLightIntensity(value))});

requestAnimationFrame(render);


function render(now)
{


    renderer.clear(canvas, canvasColor);
    renderer.drawElements(elements, camera);
    requestAnimationFrame(render);
}