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

    static addNavigationListener(canvas, camera, lookAtPosition = vec3.fromValues(0, 0, 0))
    {
        canvas.setAttribute("tabindex", "0");
        canvas.addEventListener('keydown', (event) =>
        {
            console.log("LookAt: " + lookAtPosition);
            switch(event.keyCode)
            {
                case 37:    // left
                    camera.gameObject.transform.translate([0.1, 0, 0]);
                    //lookAtPosition = camera.moveLeft(lookAtPosition, 0.1);
                    break;
                case 38:    // up
                    camera.gameObject.transform.translate([0, 0.1, 0]);
                    break;
                case 39:    // right
                    camera.gameObject.transform.translate([-0.1, 0, 0]);
                    //lookAtPosition = camera.moveRight(lookAtPosition, 0.1);
                    break;
                case 40:    // down
                    camera.gameObject.transform.translate([0, -0.1, 0]);
                    break;
                case 107:   // +
                case 187:
                    camera.gameObject.transform.translate([0, 0, 0.1]);
                    break;
                case 109:   // -
                case 189:
                    camera.gameObject.transform.translate([0, 0, -0.1]);
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
            /*
            if (delta > 0)
            {
                lookAtPosition = camera.moveForwards(lookAtPosition, delta);
            }
            else
            {
                delta = delta * (-1);
                lookAtPosition = camera.moveBackwards(lookAtPosition, delta);
            }*/
            camera.gameObject.transform.translate([0, 0, delta]);
            /*
            camera.viewMatrix.translate([0, 0, delta]);
            let cameraPosition = camera.getEye();
            let upVector = camera.getUp();
            let forwardVector = vec3.create();
            let movement = vec3.create();

            vec3.subtract(forwardVector, lookAtPosition, cameraPosition);
            vec3.normalize(forwardVector, forwardVector);
            vec3.scale(movement, forwardVector, delta);

            camera.viewMatrix.translate(movement);
            vec3.add(lookAtPosition, )
            */




            //camera.lookAt([0, 0, 0]);
            //camera.examineModelX3Dom([0.1, 0.1, 0.1], 0, 0);

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

    static addCameraExamine(canvas, camera)
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
                camera.gameObject.transform.rotateY(rotationX);
                camera.gameObject.transform.rotateZ(rotationY);
            }
        });
    }

    static addSlider(sliderId, value, min, max, step, func)
    {
        $('#sliderContainer').append("" +
            "<p id=\"" + sliderId + "_Value\">" + sliderId  + ": " + value + "</p>" +
            "<input type=\"range\" min=\"" + min + "\" max=\"" + max + "\" value=\"" + value +
            "\" step=\"" + step + "\" class=\"slider\" id=\"" + sliderId + "\"/>");

        let slider = $('#' + sliderId);
        slider.on("change", function(e)
        {
            $('#' + sliderId + '_Value').text(sliderId  + ": " + slider.val());
            func(slider.val());
        });
    }
}

export default Webgl;