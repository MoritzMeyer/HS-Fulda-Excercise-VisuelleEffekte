class Matrix
{
    constructor()
    {
        this.matrix = mat4.create();
    }

    translate(translation)
    {
        mat4.translate(this.matrix, this.matrix, translation);
    }

    rotate(angle, axis)
    {
        let angleRadians = glMatrix.toRadian(angle);
        mat4.rotate(this.matrix, this.matrix, angleRadians, axis);
    }

    scale(scale)
    {
        mat4.scale(this.matrix, this.matrix, scale);
    }

    rotateX(angle)
    {
        this.rotate(angle, [1, 0, 0]);
    }

    rotateY(angle)
    {
        this.rotate(angle, [0, 1, 0]);
    }

    rotateZ(angle)
    {
        this.rotate(angle, [0, 0, 1]);
    }
}
export default Matrix;