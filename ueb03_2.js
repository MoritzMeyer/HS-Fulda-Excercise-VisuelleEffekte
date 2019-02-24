import Webgl from "./Engine/Webgl.js";
import Renderer from "./Engine/Renderer.js";
import Camera from "./Engine/Camera.js";
import Cube3D from "./Engine/GameObjects/Cube3D.js";
import Color from "./Engine/Color.js";
import Shader from "./Engine/Shader.js";
import GameObject from "./Engine/GameObject.js";
import Tree3D from "./Engine/GameObjects/Tree3D.js";

// Webgl context holen und laden.
const canvas = document.querySelector('#glcanvas');
Webgl.loadGL(canvas);

let canvasColor = [0.42, 0.6, 0.0, 1.0];




// initialize Application
let renderer = new Renderer();
let camera = new Camera();
let tree = new Tree3D();

camera.viewMatrix.translate([0.0, 0.0, -20.0]);
tree.gameObject.transform.rotateX(35);


requestAnimationFrame(render);


function render(now)
{
    renderer.clear(canvas, canvasColor);
    tree.gameObject.transform.rotateY(1);
    renderer.drawGameObject(tree.gameObject, camera);
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