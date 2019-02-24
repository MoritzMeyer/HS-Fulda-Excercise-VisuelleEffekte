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
}

export default Webgl;