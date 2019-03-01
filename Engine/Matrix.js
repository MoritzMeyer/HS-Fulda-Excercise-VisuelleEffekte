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

    translatePosition(x, y, z)
    {
        mat4.set(this.matrix, this.matrix[0], this.matrix[1], this.matrix[2], this.matrix[3],
                              this.matrix[4], this.matrix[5], this.matrix[6], this.matrix[7],
                              this.matrix[8], this.matrix[9], this.matrix[10], this.matrix[11],
                              this.matrix[12] + x, this.matrix[13] + y, this.matrix[14] + z, this.matrix[15]);
    }

    inverse()
    {
        let inverse = this.matrix;
        mat4.invert(inverse, inverse);
        return inverse;
    }
}
export default Matrix;