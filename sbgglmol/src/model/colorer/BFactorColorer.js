export class BFactorColorer {
	constructor(color) {


}


	color (glmol, atoms) {
		glmol.colorByBFactor(atoms);
	}
}