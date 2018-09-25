export class StickStyle {
	constructor(colorer) {

	this.colorer = colorer;
	this.bondRadius = 0.2;
	this.atomRadius = 0.4;
	this.ignoreNonbonded = true;
	this.multipleBonds = false;
	this.scale = 0.3;
	}

	render(glmol, atoms) {
		this.colorer.color(glmol, atoms)
		//var residues = glmol.getResidues(atoms);
		glmol.drawBondsAsStick(glmol.modelGroup, atoms, this.bondRadius,
				this.atomRadius, this.ignoreNonbonded, this.multipleBonds,
				this.scale);
	}
}

