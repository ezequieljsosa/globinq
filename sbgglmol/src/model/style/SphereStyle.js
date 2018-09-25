export class SphereStyle { 
	constructor(colorer, sphereRadius) {
	this.colorer = colorer;
	this.sphereRadius = sphereRadius;
}


	render (glmol, atoms) {
		this.colorer.color(glmol, atoms)
		glmol.drawAtomsAsSphere(glmol.modelGroup, atoms, this.sphereRadius,this.sphereRadius * glmol.thickness );
	}
}

