import RenderObject from "../RenderObject.js";
import Color from "../Color.js";
import Cube3D from "./Cube3D.js";
import GameObject from "../GameObject.js";
import Shader from "../Shader.js";

class CoordinateAxises3D extends RenderObject
{
    constructor(lightning = false)
    {
        let shader = Shader.getDefaultColorShader(lightning);

        let blue = new Color(shader, [0, 0, 0.8]);
        let green = new Color(shader, [0, 0.8, 0]);
        let red = new Color(shader, [0.8, 0, 0]);

        let xAxis = new Cube3D(red);
        let yAxis = new Cube3D(green);
        let zAxis = new Cube3D(blue);

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