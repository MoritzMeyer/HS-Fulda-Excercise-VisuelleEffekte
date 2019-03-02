class Cone3D
{

    static calcConeData()
    {
        var pt = [], nt = [];
        var Phi = 0, dPhi = 2*Math.PI / (nPhi-1),
            Nx = r1 - r2, Ny = h, N = Math.sqrt(Nx*Nx + Ny*Ny);
        Nx /= N; Ny /= N;
        for (var i = 0; i < nPhi; i++ ){
            var cosPhi = Math.cos( Phi );
            var sinPhi = Math.sin( Phi );
            var cosPhi2 = Math.cos( Phi + dPhi/2 );
            var sinPhi2 = Math.sin( Phi + dPhi/2 );
            pt.push ( -h/2, cosPhi * r1, sinPhi * r1 );   // points
            nt.push ( Nx, Ny*cosPhi, Ny*sinPhi );         // normals
            pt.push ( h/2, cosPhi2 * r2, sinPhi2 * r2 );  // points
            nt.push ( Nx, Ny*cosPhi2, Ny*sinPhi2 );       // normals
            Phi   += dPhi;

        return {"vertices": }
    }
}
export default Cone3D;