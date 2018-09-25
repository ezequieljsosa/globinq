export class Layer {
    constructor( name, atoms, style, hetatm ) {
        this.name = name;
        this.atoms = atoms;
        this.style = style;
        this.visible = true;
        this.hetatm = hetatm;
        this.show_labels = false;
    }


    refresh() {
        this.glmol.refreshAll()
    }
    render() {
        if ( this.visible ) {
            if ( this.show_labels ) {
                this.glmol.draw_labels( this.atoms )
            }

            this.style.render( this.glmol, this.atoms );
        }
    }
    center_view() {
        this.glmol.zoomInto( this.atoms )
        this.glmol.refreshAll();
    }

}
