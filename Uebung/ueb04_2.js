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
import Materials from "../Engine/Materials.js";



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
//Webgl.addCameraExamine(canvas, camera);
//camera.gameObject.transform.translate([0, 5 , 0]);
//camera.viewMatrix.rotateY(90);
//camera.gameObject.transform.rotateX(-90);
camera.gameObject.transform.translate([0, -1, -25.0]);
camera.gameObject.transform.rotateX(35);


let directionLight = new DirectionalLight([1, 1, 1], [1, -3, 1.5], "directLights[0]");
let spotLight = new SpotLight([1, 1, 1], [0, 2, 0], [0, -1, 0], 12.5, 17.5, "spotLights[0]");
let pointLight0 = new PointLight([0, 1, 0], [0, 5, -7], "pointLights[0]");
let pointLight1 = new PointLight([1, 0.97, 0], [7, 5, 0], "pointLights[1]");
let pointLight2 = new PointLight([0, 0.3, 1], [-7, 5, 0], "pointLights[2]");
let pointLight3 = new PointLight([0.9, 0.1, 0.1], [0, 5, 7], "pointLights[3]");

spotLight.drawLightObject = true;
pointLight0.drawLightObject = true;
pointLight1.drawLightObject = true;
pointLight2.drawLightObject = true;
pointLight3.drawLightObject = true;

spotLight.gameObject.transform.setPosition([0, 5, 0]);

renderer.pushLight(directionLight);
renderer.pushLight(spotLight);
renderer.pushLight(pointLight0);
renderer.pushLight(pointLight1);
renderer.pushLight(pointLight2);
renderer.pushLight(pointLight3);

//let cube = new Cube3D(new Color(Shader.getMultiLightColorShader(4, 1, 1), [0.9, 0.1, 0.1]));
let plane = new Plane(new Color(Shader.getMultiLightColorShader(renderer.pointLights, renderer.spotLights, renderer.directionalLights), [0.3, 0.3, 0.3]));
//let sphere1 = new Sphere3D(new Color(Shader.getMultiLightColorShader(4, 1, 1), [0, 1, 0.85]));
//let sphere2 = new Sphere3D(new Color(Shader.getMultiLightColorShader(4, 1, 1), [0.95, 0.65, 0.06]));
//let sphere3 = new Sphere3D(new Color(Shader.getMultiLightColorShader(4, 1, 1), [0.06, 0.95, 0.2]));
//let sphere4 = new Sphere3D(new Color(Shader.getMultiLightColorShader(4, 1, 1), [0.6, 0.03, 0.83]));
let cube = new Cube3D(Materials.RedPlastic(Shader.getMultiLightColorShader(renderer.pointLights, renderer.spotLights, renderer.directionalLights)));
//let plane = new Plane(Materials.BlackPlastic(Shader.getMultiLightColorShader(4, 1, 1)));
let sphere1 = new Sphere3D(Materials.Bronze(Shader.getMultiLightColorShader(renderer.pointLights, renderer.spotLights, renderer.directionalLights)));
let sphere2 = new Sphere3D(Materials.Gold(Shader.getMultiLightColorShader(renderer.pointLights, renderer.spotLights, renderer.directionalLights)));
let sphere3 = new Sphere3D(Materials.CyanRubber(Shader.getMultiLightColorShader(renderer.pointLights, renderer.spotLights, renderer.directionalLights)));
let sphere4 = new Sphere3D(Materials.Turquoise(Shader.getMultiLightColorShader(renderer.pointLights, renderer.spotLights, renderer.directionalLights)));
plane.gameObject.transform.setScale([15.0, 0, 15.0]);

cube.gameObject.transform.setPosition([0, 1.5, 0]);
sphere1.gameObject.transform.setPosition([6, 1.5, 0]);
sphere2.gameObject.transform.setPosition([-6, 1.5, 0]);
sphere3.gameObject.transform.setPosition([0, 1.5, 6]);
sphere4.gameObject.transform.setPosition([0, 1.5, -6]);

let elements = [cube, plane, sphere1, sphere2, sphere3, sphere4];
let pointLights = [pointLight0, pointLight1, pointLight2, pointLight3];

//Webgl.addSlider("Ambient", light.ambient, 0.0, 1.0, 0.05, (value) => {light.setAmbientByFactor(value)});
//Webgl.addSlider("Diffuse", light.diffuse, 0.0, 1.0, 0.05, (value) => {light.setDiffuseByFac(value)});
//Webgl.addSlider("Specular", light.specular, 0.0, 1.0, 0.05, (value) => {light.setSpecularByFac(value)});
Webgl.addSlider("Material-Shininess", elements[0].gameObject.material.shininess, 1, 64, 1, (value) => {elements[0].gameObject.material.setShininess(value)});

requestAnimationFrame(render);

let time = 0.0;
let spotLightOffsetY = 0;
let spotLightYSign = 0.025;
let pointLightOffset = 1.6;
function render(now)
{

    if (rotation)
    {

        time += 0.025;
        //let time = now * 0.00005;
        //let x = Math.cos(time * 10) * 4;
        //let y= Math.cos(time * 7) * 3;
        //let z = Math.cos(time * 8) * 4;
        //light.gameObject.transform.setPosition([x, light.gameObject.transform.getWorldPosition()[1], z]);

        // animate SpotLight
        if (spotLightOffsetY >= 1 || spotLightOffsetY <= -1)
        {
            spotLightYSign = spotLightYSign * -1;
        }

        spotLightOffsetY += spotLightYSign;
        let position = spotLight.gameObject.transform.position;
        spotLight.gameObject.transform.setPosition([position[0], position[1] + spotLightYSign, position[2]]);

        // animate pointLights
        for (let i = 1; i <= pointLights.length; i++)
        {
            let p = pointLights[i-1];
            let lightX = p.gameObject.transform.position[0];
            let lightY = p.gameObject.transform.position[1];
            let lightZ = p.gameObject.transform.position[2];

            p.gameObject.transform.rotateY(1);
            p.gameObject.transform.setPosition([7 * Math.cos(time + (i * pointLightOffset)), lightY, 7 * Math.sin(time + (i * pointLightOffset))]);
        }
    }

    renderer.clear(canvas, canvasColor);
    renderer.drawElements(elements, camera);
    requestAnimationFrame(render);
}

$('#spotLight').change((e) =>
{
    if ($('#spotLight').is(":checked"))
    {
        console.log("SpotLight added");
        spotLight.setActive();
    }
    else
    {
        console.log("SpotLight removed");
        spotLight.setInActive();
    }
});

$('#directLight').change((e) =>
{
    if ($('#directLight').is(":checked"))
    {
        console.log("DirectLight added");
        directionLight.setActive();
    }
    else
    {
        console.log("DirectLight removed");
        directionLight.setInActive();
    }
});

$('#pointLights').change((e) =>
{
    if ($('#pointLights').is(":checked"))
    {
        console.log("PointLights added");
        pointLights.forEach((p) => p.setActive());
    }
    else
    {
        console.log("PointLights removed");
        pointLights.forEach((p) => p.setInActive());
    }
});

$('#rotation').change((e) =>
{
    if ($('#rotation').is(":checked"))
    {
        rotation = true;
    }
    else
    {
        rotation = false;
    }
});