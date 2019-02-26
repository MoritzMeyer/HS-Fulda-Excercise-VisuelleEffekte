class Webgl
{
    static loadGL(canvas) 
    {
        return Webgl.instance = canvas.getContext('webgl2', {alpha: true, depth: true});
    }

    static getGL() 
    {
        return Webgl.instance;
    }

    static addNavigationListener(canvas, camera)
    {
        canvas.setAttribute("tabindex", "0");
        canvas.addEventListener('keydown', (event) =>
        {
            switch(event.keyCode)
            {
                case 37:    // left
                    camera.viewMatrix.translate([-0.1, 0, 0]);
                    break;
                case 38:    // up
                    camera.viewMatrix.translate([0, 0.1, 0]);
                    break;
                case 39:    // right
                    camera.viewMatrix.translate([0.1, 0, 0]);
                    break;
                case 40:    // down
                    camera.viewMatrix.translate([0, -0.1, 0]);
                    break;
                case 107:   // +
                case 187:
                    camera.viewMatrix.translate([0, 0, 0.1]);
                    break;
                case 109:   // -
                case 189:
                    camera.viewMatrix.translate([0, 0, -0.1]);
                    break;
            }
        }, true);

        let handleWheel = function (event)
        {
            // cross-browser wheel delta
            // Chrome / IE: both are set to the same thing - WheelEvent for Chrome, MouseWheelEvent for IE
            // Firefox: first one is undefined, second one is MouseScrollEvent
            let e = window.event || event;
            // Chrome / IE: first one is +/-120 (positive on mouse up), second one is zero
            // Firefox: first one is undefined, second one is -/+3 (negative on mouse up)
            let delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));

            camera.viewMatrix.translate([0, 0, delta]);
            camera.examineModelX3Dom([0.1, 0.1, 0.1], 0, 0);

            e.preventDefault();
        };

        Webgl.addMouseWheelEventListener(canvas, handleWheel);
    }

    static addMouseWheelEventListener(canvas, scrollHandler)
    {
        if (canvas.addEventListener)
        {
            // IE9+, Chrome, Safari, Opera
            canvas.addEventListener("mousewheel", scrollHandler, false);
            // Firefox
            canvas.addEventListener("DOMMouseScroll", scrollHandler, false);
        }
        else
        {
            // // IE 6/7/8
            canvas.attachEvent("onmousewheel", scrollHandler);
        }
    }

    static addCameraRotation(canvas, camera)
    {
        let mouseIsDown = false;
        canvas.setAttribute("tabindex", "0");
        canvas.addEventListener('mousedown', (event) =>
        {
            mouseIsDown = true;
        });

        canvas.addEventListener('mouseup', (event) =>
        {
            mouseIsDown = false;
        });

        canvas.addEventListener('mousemove', (event) =>
        {
            if (mouseIsDown)
            {
                let rotationX = event.movementX / 2;
                let rotationY = event.movementY / 2;
                camera.examineModelX3Dom([0.1, 0.1, 0.1], rotationY, rotationX);
            }
        });
    }
}

export default Webgl;