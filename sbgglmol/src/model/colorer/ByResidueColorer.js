
export class ByResidueColorer { constructor(color_map) {
	this.atom_color_map = color_map
}

	color (glmol, atoms) {
		glmol.colorByResidue(atoms, this.atom_color_map);
	}
}