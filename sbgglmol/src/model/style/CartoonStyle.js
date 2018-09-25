export class CartoonStyle {
    constructor( colorer, curveWidth, thickness ) {
        this.colorer = colorer;
        this.curveWidth = curveWidth;
        this.thickness = thickness;
    }


    render( glmol, atoms ) {
        this.colorer.color( glmol, atoms )
        glmol.drawCartoon( glmol.modelGroup, atoms, this.curveWidth,
            this.thickness );
    }
}
