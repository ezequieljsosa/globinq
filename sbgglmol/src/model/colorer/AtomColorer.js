export class AtomColorer  { 
	constructor(color) {

	this._color = color
}


	color (glmol, atoms) {
		glmol.colorAtoms(atoms, this._color);
	}
}
