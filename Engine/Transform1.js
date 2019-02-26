import Matrix from "./Matrix.js";

class Transform1
{
    constructor()
    {
        this.childs = [];
        this.parent = null;

        this.localSpace = mat4.create();
        this.worldSpace = mat4.create();

        this.worldChanged = true;
    }

    getWorldSpaceMatrix()
    {
        if (this.worldChanged)
        {
            if (this.parent)
            {
                mat4.multiply(this.worldSpace, this.parent.getWorldSpaceMatrix(), this.localSpace);
            }
            else
            {
                mat4.copy(this.worldSpace, this.localSpace);
            }

            this.worldChanged = false;
        }

        return this.worldSpace;
    }

    setParent(parent)
    {
        this.parent = parent;
        parent.childs.push(this);
    }

    addChild(child)
    {
        child.parent = this;
        this.childs.push(child);
    }

    getLocalTranslation()
    {
        let translation = vec3.create();
        mat4.getTranslation(translation, this.localSpace);
    }

    getLocalScaling()
    {
        let scaling = vec3.create();
        mat4.getScaling(scaling, this.localSpace);
        return scaling;
    }

    getWorldTranslation()
    {
        let translation = vec3.create();
        mat4.getTranslation(translation, this.getWorldSpaceMatrix());
        return translation;
    }

    getWorldScaling()
    {
        let scaling = vec3.create();
        mat4.getScaling(scaling, this.getWorldSpaceMatrix());
        return scaling;
    }

    setLocalChanged()
    {
        this.childs.forEach((child) => child.setWorldChanged());
    }

    setWorldChanged()
    {
        this.worldChanged = true;
        this.childs.forEach((child) => child.setWorldChanged());
    }

    translate(translation)
    {
        //let translation = vec3.fromValues(trans[0], trans[1], trans[2]);
        mat4.translate(this.localSpace, this.localSpace, translation);
        this.setLocalChanged();
    }

    rotateX(angle)
    {
        mat4.rotateX(this.localSpace, this.localSpace, glMatrix.toRadian(angle));
        this.setLocalChanged();
    }

    rotateY(angle)
    {
        mat4.rotateY(this.localSpace, this.localSpace, glMatrix.toRadian(angle));
        this.setLocalChanged();
    }

    rotateZ(angle)
    {
        mat4.rotateZ(this.localSpace, this.localSpace, glMatrix.toRadian(angle));
        this.setLocalChanged();
    }

    rotate(angle, axis)
    {
        mat4.rotate(this.localSpace, this.localSpace, glMatrix.toRadian(angle), axis);
        this.setLocalChanged();
    }

    scale(factor)
    {
        //let scale = vec3.fromValues(factor[0], factor[1], factor[2]);
        mat4.scale(this.localSpace, this.localSpace, factor);
        this.setLocalChanged();
    }
}

export default Transform1