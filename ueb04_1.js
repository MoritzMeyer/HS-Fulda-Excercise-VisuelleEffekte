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



// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);
let canvasColor = [0.42, 0.6, 0.0, 1.0];
let rotation = false;

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


Webgl.addSlider("Ambient", 0.8, 0.0, 1.0, 0.05, (value) => {light.setAmbientByFactor(value)});
Webgl.addSlider("Diffuse", 0.8, 0.0, 1.0, 0.05, (value) => {light.setDiffuseByFac(value)});
Webgl.addSlider("Specular", 1.0, 0.0, 1.0, 0.05, (value) => {light.setSpecularByFac(value)});
Webgl.addSlider("Material-Shininess", 16, 1, 64, 1, (value) => {elements[0].gameObject.material.setShininess(value)});

//light.gameObject.transform.translate([0, -5.0, -5.0]);
light.gameObject.transform.translate([0, 1.0, 0]);
let cube = new Cube3D(new Color(Shader.getDefaultColorShader(true), [0.5, 0.1, 0.1]));
let plane = new Plane(new Color(Shader.getDefaultColorShader(true), [0.5, 0.1, 0.1]));
let capsule = new OBJ("./textures/capsule/capsule.obj", 1, true, null);
let sphere = new Sphere3D(new Color(Shader.getDefaultColorShader(true), [0.1, 0.1, 0.5]));
//let bunny = new OBJ("./textures/bunny/bunny.obj", 1, true, null);
//let f16 = new OBJ("./textures/f16tex/f16.obj", 1, true, null);
//let teapot = new OBJ("./textures/teapot.obj", 1, true, null);
plane.gameObject.transform.setScale([2.0, 0, 2.0]);

capsule.checkLoaded(() =>
{
    capsule.gameObject.transform.rotateX(90);
});

/*
teapot.checkLoaded(() =>
{
    teapot.gameObject.transform.setScale([0.25, 0.25, 0.25]);
});
*/
let elements = [plane];

requestAnimationFrame(render);

let time = 0.0;
function render(now)
{
    if (rotation)
    {
        /*
        let time = now * 0.00005;
        let x = Math.cos(time * 10) * 4;
        let y= Math.cos(time * 7) * 3;
        let z = Math.cos(time * 8) * 4;
        light.gameObject.transform.setPosition([x, light.gameObject.transform.getWorldPosition()[1], z]);
        */
        let lightY = light.gameObject.transform.position[1];
        time += 0.05;
        light.gameObject.transform.rotateY(1);
        light.gameObject.transform.setPosition([4 * Math.cos(time), lightY, 4 * Math.sin(time)]);
    }

    renderer.clear(canvas, canvasColor);
    //renderer.drawWithoutLights(light.lightObject.gameObject, camera);
    renderer.drawElements(elements, camera);
    requestAnimationFrame(render);
}

$('#plane').change((e) =>
{
    if ($('#plane').is(":checked"))
    {
        $('#error').hide();
        if (!$('#rotation').is(":checked"))
        {
            light.gameObject.transform.setPosition([0, 1.0, 0]);
        }
        elements = [plane];
        console.log("Checkbox Plane is checked. Elements: ", elements);
        $('#cube').prop('checked', false);
        $('#capsule').prop('checked', false);
        $('#sphere').prop('checked', false);
    }
    else
    {
        elements = [];
        $('#error').hide();
    }
});

$('#cube').change((e) =>
{
    if ($('#cube').is(":checked"))
    {
        $('#error').hide();
        if (!$('#rotation').is(":checked"))
        {
            light.gameObject.transform.setPosition([2.0, 1.0, 0]);
        }
        elements = [cube];
        console.log("Checkbox Cube is checked. Elements: ", elements);
        $('#plane').prop('checked', false);
        $('#capsule').prop('checked', false);
        $('#sphere').prop('checked', false);
    }
    else
    {
        elements = [];
        $('#error').hide();
    }
});

$('#sphere').change((e) =>
{
    if ($('#sphere').is(":checked"))
    {
        $('#error').hide();
        if (!$('#rotation').is(":checked"))
        {
            light.gameObject.transform.setPosition([2.0, 1.0, 0]);
        }
        elements = [sphere];
        console.log("Checkbox Sphere is checked. Elements: ", elements);
        $('#plane').prop('checked', false);
        $('#capsule').prop('checked', false);
        $('#cube').prop('checked', false);
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
            if (!$('#rotation').is(":checked"))
            {
                light.gameObject.transform.setPosition([2.0, 1.0, 0]);
            }
            //elements = [capsule];
            elements = [capsule];
            console.log("Checkbox Capsule is checked. Elements: ", elements);
            $('#cube').prop('checked', false);
            $('#plane').prop('checked', false);
            $('#sphere').prop('checked', false);
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

$('#rotation').change((e) =>
{
   if ($('#rotation').is(":checked"))
   {
       rotation = true;
   }
   else
   {
       if ($('#capsule').is(":checked"))
       {
           light.gameObject.transform.setPosition([2.0, 1.0, 0]);
       }

       if ($('#cube').is(":checked"))
       {
           light.gameObject.transform.setPosition([2.0, 1.0, 0]);
       }

       if ($('#plane').is(":checked"))
       {
           light.gameObject.transform.setPosition([0, 1.0, 0]);
       }

        rotation = false;
   }
});

