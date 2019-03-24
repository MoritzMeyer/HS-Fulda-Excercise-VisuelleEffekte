import Webgl from "./Webgl.js";
import Matrix from "./Matrix.js";
import ProjectionMatrix from "./ProjectionMatrix.js";
import GameObject from "./GameObject.js";

class Camera
{
    constructor()
    {
        this.gl = Webgl.getGL();
        //this.viewMatrix = new Matrix();
        this.projectionMatrix = new ProjectionMatrix();
        this.cameraMatrix = new Matrix();
        this.viewProjectionMatrix = mat4.create();

        this.gameObject = GameObject.createEmpty();
    }

    getViewProjectionMatrix()
    {
        this.viewProjectionMatrix = mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix.matrix, this.getViewMatrix());
        return this.viewProjectionMatrix;
    }

    applyViewProjectionMatricesToShader(shader)
    {
        shader.bind();
        shader.setUniformMatrix4fv("uProjectionMatrix", false, this.projectionMatrix.matrix);
        shader.setUniformMatrix4fv("uViewMatrix", false, this.camera.getViewMatrix());
    }

    getViewMatrix()
    {
        //return this.viewMatrix.matrix;
        return this.gameObject.transform.getWorldSpaceMatrix();
        //let viewMat = this.gameObject.transform.getWorldSpaceMatrix();
        //mat4.invert(viewMat, viewMat);
        //return viewMat;
    }

    getCameraMatrix()
    {
        //return this.cameraMatrix.matrix;
        return this.gameObject.transform.getLocalSpaceMatrix();
    }

    setViewMatrix(matrix)
    {
        //throw "Method not implemented";
        //mat4.copy(this.viewMatrix.matrix, matrix);
        this.gameObject.transform.setMatrix(matrix);
    }

    lookAt(target)
    {
        let centerOfRotation = vec3.fromValues(target[0], target[1], target[2]);
        let lookAtMat = mat4.create();
        mat4.lookAt(lookAtMat, this.getEye(), centerOfRotation, this.getUp());
        //mat4.invert(lookAtMat, lookAtMat);
        this.setViewMatrix(lookAtMat);
    }

    getEye()
    {
        let viewMatrix = this.getViewMatrix();
        let cam = mat4.create();
        mat4.invert(cam, viewMatrix);
        //let cam = this.getViewMatrix();
        let eye = vec3.fromValues(cam[12], cam[13], cam[14]);
        return eye;
    }

    getUp()
    {
        let viewMatrix = this.getViewMatrix();
        let cam = mat4.create();
        mat4.invert(cam, viewMatrix);
        //let cam = this.getViewMatrix();
        let up = vec3.fromValues(cam[4], cam[5], cam[6]);
        return up;
    }

    getFront()
    {
        let viewMatrix = this.getViewMatrix();
        let front = vec3.fromValues(viewMatrix[8], viewMatrix[9], viewMatrix[10], viewMatrix[11]);
        //vec3.negate(front, front);
        /*
        let cam = mat4.create();
        //mat4.invert(cam, viewMatrix);
        mat4.copy(cam, viewMatrix);
        let front = vec3.create();
        let forward = vec3.fromValues(0, 0, -1);
        vec3.transformMat4(front, forward, cam);
        */

        return front;
    }

    getProjectionMatrix()
    {
        return this.projectionMatrix.matrix;
    }

    moveForwards(lookAtPosition, movementSpeed)
    {
        let cameraPosition = this.getEye();
        let forwardVector = vec3.create();
        let movement = vec3.create();
        let newLookAt = vec3.create();

        vec3.subtract(forwardVector, lookAtPosition, cameraPosition);
        vec3.normalize(forwardVector, forwardVector);
        vec3.scale(movement, forwardVector, movementSpeed);

        // Move forward and adjust new lookAt
        //this.viewMatrix.translatePosition(movement[0], movement[1], movement[2]);
        this.gameObject.transform.setPosition(movement);
        vec3.add(newLookAt, lookAtPosition, movement);

        // next calc won't work, if they are equal
        if (vec3.equals(this.getEye(), newLookAt))
        {
            //this.viewMatrix.translatePosition(movement[0], movement[1], movement[2]);
            this.gameObject.transform.setPosition(movement);
            vec3.add(newLookAt, lookAtPosition, movement);
        }

        return newLookAt;
    }

    moveBackwards(lookAtPosition, movementSpeed)
    {
        let cameraPosition = this.getEye();
        let forwardVector = vec3.create();
        let movement = vec3.create();
        let newLookAt = vec3.create();

        vec3.subtract(forwardVector, lookAtPosition, cameraPosition);
        vec3.normalize(forwardVector, forwardVector);
        vec3.scale(movement, forwardVector, movementSpeed);
        vec3.negate(movement, movement);

        // Move backward and adjust new LookAt
        //this.viewMatrix.translatePosition(movement[0], movement[1], movement[2]);
        this.gameObject.transform.setPosition(movement);
        vec3.add(newLookAt, lookAtPosition, movement);

        // next calc won't work, if they are equal
        if (vec3.equals(this.getEye(), newLookAt))
        {
            //this.viewMatrix.translatePosition(movement[0], movement[1], movement[2]);
            this.gameObject.transform.setPosition(movement);
            vec3.add(newLookAt, lookAtPosition, movement);
        }

        return newLookAt;
    }

    moveLeft(lookAtPosition, movementSpeed)
    {
        let upVector = this.getUp();
        let cameraPosition = this.getEye();
        let forwardVector = vec3.create();
        let movement = vec3.create();
        let leftVector = vec3.create();
        let newLookAt = vec3.create();

        vec3.subtract(forwardVector, lookAtPosition, cameraPosition);
        vec3.normalize(forwardVector, forwardVector);
        vec3.cross(leftVector, upVector, forwardVector);
        vec3.scale(movement, leftVector, movementSpeed);

        // Move left and adjust new LookAt
        //this.viewMatrix.translatePosition(movement[0], movement[1], movement[2]);
        this.gameObject.transform.setPosition(movement);
        vec3.add(newLookAt, lookAtPosition, movement);

        // next calc won't work, if they are equal
        if (vec3.equals(this.getEye(), newLookAt))
        {
            //this.viewMatrix.translatePosition(movement[0], movement[1], movement[2]);
            this.gameObject.transform.setPosition(movement);
            vec3.add(newLookAt, lookAtPosition, movement);
        }

        return newLookAt;
    }

    moveRight(lookAtPosition, movementSpeed)
    {
        let upVector = this.getUp();
        let cameraPosition = this.getEye();
        let forwardVector = vec3.create();
        let movement = vec3.create();
        let rightVector = vec3.create();
        let newLookAt = vec3.create();

        vec3.subtract(forwardVector, lookAtPosition, cameraPosition);
        vec3.normalize(forwardVector, forwardVector);
        vec3.cross(rightVector, forwardVector, upVector);
        vec3.scale(movement, rightVector, movementSpeed);

        // Move right and adjust new LookAt
        //this.viewMatrix.translatePosition(movement[0], movement[1], movement[2]);
        this.gameObject.transform.setPosition(movement);
        vec3.add(newLookAt, lookAtPosition, movement);

        // next calc won't work, if they are equal
        if (vec3.equals(this.getEye(), newLookAt))
        {
            //this.viewMatrix.translatePosition(movement[0], movement[1], movement[2]);
            this.gameObject.transform.setPosition(movement);
            vec3.add(newLookAt, lookAtPosition, movement);
        }

        return newLookAt;
    }
    /*
    lookAt(target) {
        // calc lookAtMatrix
        let worldCam = this.viewMatrix.inverse();
        let cameraPosition = worldCam[3];
        let upVec = worldCam[1];
        let targetVec = vec3.subtract(cameraPosition - target);

        // calc zAxis
        let zAxis = null;
        vec3.normalize(zAxis, targetVec);

        // calc xAxis
        let xAxis = null;
        vec3.cross(xAxis, upVec, zAxis);
        vec3.normalize(xAxis, xAxis);

        // calc yAxis
        let yAxis = null;
        vec3.cross(yAxis, zAxis, xAxis);
        vec3.normalize(yAxis, yAxis);

        let cameraMatrix = mat4.fromValues( xAxis[0], xAxis[1], xAxis[2], 0,
                                            yAxis[0], yAxis[1], yAxis[2], 0,
                                            zAxis[0], zAxis[1], zAxis[2], 0,
                                            cameraPosition[0], cameraPosition[1], cameraPosition[2], 1
        );

        // set inverse camera Matrix as view Matrix
        mat4.invert(this.viewMatrix, cameraMatrix);
    }
    */

    examineModeGl(target, angleAlpha, angleBeta)
    {
        let radAngleAlpha = glMatrix.toRadian(angleAlpha);
        let radAngleBeta = glMatrix.toRadian(angleBeta);

        let worldCam = this.getViewMatrix();
        mat4.invert(worldCam, worldCam);
        let eye = vec3.fromValues(worldCam[12], worldCam[13], worldCam[14]);
        vec3.subtract(eye, eye, target);

        let up = vec3.fromValues(worldCam[4], worldCam[5], worldCam[6]);
        let mat = mat4.create();
        mat4.fromRotation(mat, radAngleBeta, up);
        vec3.transformMat4(eye, eye, mat);

        let viewVector = vec3.create();
        vec3.negate(viewVector, eye);
        vec3.normalize(viewVector, viewVector);

        let sideVector = vec3.create();
        vec3.cross(sideVector, viewVector, up);

        mat4.fromRotation(mat, radAngleAlpha, sideVector);
        vec3.transformMat4(eye, eye, mat);

        vec3.negate(viewVector, eye);
        vec3.normalize(viewVector, viewVector);

        vec3.cross(up, sideVector, viewVector);
        vec3.add(eye, eye, target);

        vec3.negate(viewVector, viewVector);



        let cameraMatrix = mat4.fromValues( sideVector[0], sideVector[1], sideVector[2], 0,
                                            up[0], up[1], up[2], 0,
                                            viewVector[0], viewVector[1], viewVector[2], 0,
                                            eye[0], eye[1], eye[2], 1);


        /*
        let cameraMatrix = mat4.fromValues( sideVector[0], up[0], viewVector[0], eye[0],
                                            sideVector[1], up[1], viewVector[1], eye[1],
                                            sideVector[2], up[2], viewVector[2], eye[2],
                                            0, 0, 0, 1);
        */

        let vm = mat4.create();
        mat4.invert(vm, cameraMatrix);
        this.setViewMatrix(vm);
    }

    examineModelX3Dom(target, angleAlpha, angleBeta)
    {
        let radAngleAlpha = glMatrix.toRadian(angleAlpha);
        let radAngleBeta = glMatrix.toRadian(angleBeta);
        let centerOfRotation = new x3dom.fields.SFVec3f(target[0], target[1], target[2]);

        let vM = this.getViewMatrix();
        //let test = new x3dom.fields.SFMatrix4f(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ,13, 14, 15);
        //let e3 = test.e3(); // 3, 7, 11
        //let e1 = test.e1();

        let cam = new x3dom.fields. SFMatrix4f(vM[0], vM[4], vM[8], vM[12], vM[1], vM[5], vM[9], vM[13], vM[2], vM[6], vM[10], vM[14], vM[3], vM[7], vM[11], vM[15]);
        cam = cam.inverse();

        let eye = cam.e3();
        eye = eye.subtract(centerOfRotation);

        let up = cam.e1();

        let mat = x3dom.fields.Quaternion.axisAngle(up, radAngleBeta).toMatrix();
        eye = mat.multMatrixPnt(eye);

        let v = eye.negate().normalize();
        let s = v.cross(up);

        mat = x3dom.fields.Quaternion.axisAngle(s, radAngleAlpha).toMatrix();
        eye = mat.multMatrixPnt(eye);

        v = eye.negate().normalize();
        up = s.cross(v);
        eye = eye.add(centerOfRotation);

        cam.setValue(s, up, v.negate(), eye);
        vM = cam.inverse();

        let viewMat = mat4.fromValues(vM.at(0, 0), vM.at(1, 0), vM.at(2, 0), vM.at(3, 0), vM.at(0, 1), vM.at(1, 1), vM.at(2, 1), vM.at(3, 1), vM.at(0, 2), vM.at(1, 2), vM.at(2, 2), vM.at(3, 2), vM.at(0, 3), vM.at(1, 3), vM.at(2, 3), vM.at(3, 3));
        this.setViewMatrix(viewMat);
    }
}
export default Camera;