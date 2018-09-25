export class ChainColorer { 
	constructor() {
	this.color_map = {}
	}

	color(glmol, atoms) {
		glmol.colorByChain(atoms);
	}
}