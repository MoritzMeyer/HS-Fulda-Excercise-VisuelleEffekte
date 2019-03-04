import RenderObject from "../RenderObject.js";
import Color from "../Color.js";
import Shader from "../Shader.js";
import Cube3D from "./Cube3D.js";
import GameObject from "../GameObject.js";

class Tree3D extends RenderObject
{
    constructor()
    {
        let color1 = new Color(Shader.getDefaultColorShader(false), [0.8, 0.0, 0.0]);
        let color2 = new Color(Shader.getDefaultColorShader(false), [0.0, 0.8, 0.0]);
        let color3 = new Color(Shader.getDefaultColorShader(false), [0.0, 0.0, 0.8]);
        let color4 = new Color(Shader.getDefaultColorShader(false), [0.8, 0.8, 0.0]);

        let trunk = new Cube3D(color1);
        let limb1 = new Cube3D(color2);
        let limb2 = new Cube3D(color3);
        let limb3 = new Cube3D(color4);

        let limb1Parent = GameObject.createEmpty();
        let limb2Parent = GameObject.createEmpty();
        let limb3Parent = GameObject.createEmpty();

        limb1Parent.addChild(limb1.gameObject);
        limb2Parent.addChild(limb2.gameObject);
        limb3Parent.addChild(limb3.gameObject);

        trunk.gameObject.transform.setScale([0.5, 2.0, 0.5]);
        limb1.gameObject.transform.setScale([0.5, 2.0, 0.5]);
        limb2.gameObject.transform.setScale([0.5, 2.0, 0.5]);
        limb3.gameObject.transform.setScale([0.5, 2.0, 0.5]);

        trunk.gameObject.transform.translate([0.0, -2, 0.0]);
        limb1.gameObject.transform.translate([0.0, 1.7, 0.0]);
        limb2.gameObject.transform.translate([0.0, 1.7, 0.0]);
        limb3.gameObject.transform.translate([0.0, 1.7, 0.0]);

        trunk.gameObject.transform.rotateY(45);

        limb2Parent.transform.rotateY([120]);
        limb3Parent.transform.rotateY([240]);

        limb1Parent.transform.rotateX([60]);
        limb2Parent.transform.rotateX([60]);
        limb3Parent.transform.rotateX([60]);

        let gameObject = GameObject.createEmpty();
        gameObject.addChild(trunk.gameObject);
        gameObject.addChild(limb1Parent);
        gameObject.addChild(limb2Parent);
        gameObject.addChild(limb3Parent);

        super(null, null, gameObject);
    }
}
export default Tree3D;