import RenderObject from "../RenderObject.js";
import Color from "../Color.js";
import Cube3Dnormals from "./Cube3Dnormals.js";
import Cube3D from "./Cube3D.js";
import GameObject from "../GameObject.js";
import Shader from "../Shader.js";

class CoordinateAxises3D extends RenderObject
{
    constructor(lightning = false)
    {
        let shader = Shader.getDefaultColorShader();
        if (lightning)
        {
            shader = Shader.getDefaultColorLightShader();
        }

        let blue = new Color("uObjectColor", shader, [0, 0, 0.8]);
        let green = new Color("uObjectColor", shader, [0, 0.8, 0]);
        let red = new Color("uObjectColor", shader, [0.8, 0, 0]);


        let xAxis = null;
        let yAxis = null;
        let zAxis = null;

        if (lightning)
        {
            xAxis = new Cube3Dnormals(red);
            yAxis = new Cube3Dnormals(green);
            zAxis = new Cube3Dnormals(blue);
        }
        else
        {
            xAxis = new Cube3D(red);
            yAxis = new Cube3D(green);
            zAxis = new Cube3D(blue);
        }

        xAxis.gameObject.transform.setScale([1, 0.01, 0.01]);
        yAxis.gameObject.transform.setScale([0.01, 1, 0.01]);
        zAxis.gameObject.transform.setScale([0.01, 0.01, 1]);

        xAxis.gameObject.transform.setPosition([-0.7, 0, 0]);
        yAxis.gameObject.transform.setPosition([0, 0.7, 0]);
        zAxis.gameObject.transform.setPosition([0, 0, 0.7]);

        let gameObject = GameObject.createEmpty();
        gameObject.addChild(xAxis.gameObject);
        gameObject.addChild(yAxis.gameObject);
        gameObject.addChild(zAxis.gameObject);

        super(null, null, gameObject);
    }
}
export default CoordinateAxises3D;