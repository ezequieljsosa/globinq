export ByAtomNameColorer { 
	constructor(color_map) {

	this.atom_color_map = color_map
}


	color (glmol, atoms) {
		glmol.colorByAtomName(atoms, this.atom_color_map);
	}
}