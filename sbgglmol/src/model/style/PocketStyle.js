export class PocketStyle { 
	constructor(style) {
	
	this.alpha_spheres_style = new $.SphereStyle(new $.ByAtomNameColorer({													   
		'POL' : parseInt('0x000000'),
		'APOL' : parseInt('0xD9D9D9')
	}), 1.5);
	
	this.atoms_style = style;
	this.show_alpha_spheres = false;
	
}


		render (glmol, atoms) {
			
			if (this.show_alpha_spheres) {
				
				this.alpha_spheres_style.render(glmol, atoms);
			} else {
				this.atoms_style.render(glmol, atoms);
			}
		}
	}