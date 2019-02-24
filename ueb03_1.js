import Webgl from "./Engine/Webgl.js";
import Renderer from "./Engine/Renderer.js";
import Camera from "./Engine/Camera.js";
import Cube3D from "./Engine/GameObjects/Cube3D.js";
import Sphere3D from "./Engine/GameObjects/Sphere3D.js";

// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);

let cube = new Cube3D(null);
let sphere = new Sphere3D(null);
let canvasColor = [0.42, 0.6, 0.0, 1.0];

// initialize Application
let renderer = new Renderer();
let camera = new Camera();


camera.viewMatrix.translate([0.0, 0.0, -10.0]);
cube.drawable.transform.modelMatrix.translate([-2, 0, 0]);
sphere.drawable.transform.modelMatrix.translate([2, 0, 0]);

requestAnimationFrame(render);

function render(now)
{
    renderer.clear(canvas, canvasColor);
    cube.drawable.transform.modelMatrix.rotate(1, [1, 1, 1]);
    sphere.drawable.transform.modelMatrix.rotate(1, [1, 1, 1]);
    renderer.drawDrawable(cube.drawable, camera);
    renderer.drawDrawable(sphere.drawable, camera);
    requestAnimationFrame(render);
}

canvas.setAttribute("tabindex", "0");
canvas.addEventListener('keydown', (event) =>
{
        switch(event.keyCode)
        {
            case 37:    // left
                camera.viewMatrix.translate([-0.01, 0, 0]);
                break;
            case 38:    // up
                camera.viewMatrix.translate([0, 0.01, 0]);
                break;
            case 39:    // right
                camera.viewMatrix.translate([0.01, 0, 0]);
                break;
            case 40:    // down
                camera.viewMatrix.translate([0, -0.01, 0]);
                break;
            case 107:   // +
            case 187:
                camera.viewMatrix.translate([0, 0, 0.01]);
                break;
            case 109:   // -
            case 189:
                camera.viewMatrix.translate([0, 0, -0.01]);
                break;
        }
}, true);


