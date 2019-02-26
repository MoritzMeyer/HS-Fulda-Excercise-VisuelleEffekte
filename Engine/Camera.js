import Webgl from "./Webgl.js";
import Matrix from "./Matrix.js";
import ProjectionMatrix from "./ProjectionMatrix.js";

class Camera
{
    constructor()
    {
        this.gl = Webgl.getGL();
        this.viewMatrix = new Matrix();
        this.projectionMatrix = new ProjectionMatrix();
        this.cameraMatrix = new Matrix();
        this.viewProjectionMatrix = mat4.create();
    }

    getViewProjectionMatrix()
    {
        this.viewProjectionMatrix = mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix.matrix, this.viewMatrix.matrix);
        return this.viewProjectionMatrix;
    }

    applyViewProjectionMatricesToShader(shader)
    {
        shader.bind();
        shader.setUniformMatrix4fv("uProjectionMatrix", false, this.projectionMatrix.matrix);
        shader.setUniformMatrix4fv("uViewMatrix", false, this.viewMatrix.matrix);
    }

    getViewMatrix()
    {
        return this.viewMatrix.matrix;
    }

    getProjectionMatrix()
    {
        return this.projectionMatrix.matrix;
    }

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

    examineModeGl(target, angleAlpha, angleBeta)
    {
        let radAngleAlpha = glMatrix.toRadian(angleAlpha);
        let radAngleBeta = glMatrix.toRadian(angleBeta);

        let worldCam = this.viewMatrix.inverse();
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

        mat4.invert(this.viewMatrix, cameraMatrix);
    }

    examineModelX3Dom(target, angleAlpha, angleBeta)
    {
        let radAngleAlpha = glMatrix.toRadian(angleAlpha);
        let radAngleBeta = glMatrix.toRadian(angleBeta);
        let centerOfRotation = new x3dom.fields.SFVec3f(target[0], target[1], target[2]);

        let vM = this.viewMatrix.matrix;
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

        this.viewMatrix.matrix = mat4.fromValues(vM.at(0, 0), vM.at(1, 0), vM.at(2, 0), vM.at(3, 0), vM.at(0, 1), vM.at(1, 1), vM.at(2, 1), vM.at(3, 1), vM.at(0, 2), vM.at(1, 2), vM.at(2, 2), vM.at(3, 2), vM.at(0, 3), vM.at(1, 3), vM.at(2, 3), vM.at(3, 3));
    }
}
export default Camera;