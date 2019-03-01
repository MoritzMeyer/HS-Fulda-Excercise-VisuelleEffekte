import Webgl from "./Engine/Webgl.js";
import Renderer from "./Engine/Renderer.js";
import Camera from "./Engine/Camera.js";
import Color from "./Engine/Color.js";
import Shader from "./Engine/Shader.js";
import Light from "./Engine/Light.js";
import Plane from "./Engine/GameObjects/Plane.js";
import Cube3Dnormals from "./Engine/GameObjects/Cube3Dnormals.js";
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
camera.gameObject.transform.translate([0, -1, -8.0]);
//camera.viewMatrix.rotateY(90);
camera.gameObject.transform.rotateX(40);


let light = Light.getDefaultLight();
renderer.lights.push(light);
//light.gameObject.transform.translate([0, -5.0, -5.0]);
light.gameObject.transform.translate([0, 1.0, 0]);
let cube = new Cube3Dnormals(new Color("uObjectColor", Shader.getDefaultColorLightShader(), [0.5, 0.1, 0.1]));
let plane = new Plane(new Color("uObjectColor", Shader.getDefaultColorLightShader(), [0.5, 0.1, 0.1]));
let capsule = new OBJ("./textures/capsule/capsule.obj", 1, Shader.getDefaultTextureLightShader());
plane.gameObject.transform.setScale([2.0, 0, 2.0]);
capsule.checkLoaded(() =>
{
    capsule.gameObject.transform.rotateX(90);
});

let elements = [plane];

requestAnimationFrame(render);
function render(now)
{
    renderer.clear(canvas, canvasColor);
    renderer.drawWithoutLights(light.lightObject.gameObject, camera);
    renderer.drawElements(elements, camera);
    requestAnimationFrame(render);
}

$('#cube').change((e) =>
{
    if ($('#cube').is(":checked"))
    {
        $('#error').hide();
        light.gameObject.transform.setPosition([2.0, 2.0, 0]);
        elements = [cube];
        console.log("Checkbox Cube is checked. Elements: ", elements);
        $('#plane').prop('checked', false);
        $('#capsule').prop('checked', false);
    }
    else
    {
        elements = [];
        $('#error').hide();
    }
});

$('#plane').change((e) =>
{
    if ($('#plane').is(":checked"))
    {
        $('#error').hide();
        light.gameObject.transform.setPosition([0, 1.0, 0]);
        elements = [plane];
        console.log("Checkbox Plane is checked. Elements: ", elements);
        $('#cube').prop('checked', false);
        $('#capsule').prop('checked', false);
    }
    else
    {
        elements = [];
        $('#error').hide();
    }
});

$('#capsule').change((e) =>
{
    if ($('#capsule').is(":checked"))
    {
        if (capsule.isLoaded)
        {
            $('#error').hide();
            light.gameObject.transform.setPosition([2.0, 1.0, 0]);
            elements = [capsule];
            console.log("Checkbox Capsule is checked. Elements: ", elements);
            $('#cube').prop('checked', false);
            $('#plane').prop('checked', false);
        }
        else
        {
            $('#capsule').prop('checked', false);
            $('#error').show();
        }
    }
    else
    {
        elements = [];
        $('#error').hide();
    }
});

