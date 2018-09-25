class Pocket { 
	constructor(name, atoms, alpha_spheres, style) {

	this.name = name;
	this.atoms = atoms;
	this.alpha_spheres = alpha_spheres;	
	this.visible = false;

	this.style = new $.PocketStyle(style);
}


	refresh () {
		this.glmol.refreshAll()
	}
	render () {
		if (this.visible) {
			var atoms = [];
			
			if (this.style.show_alpha_spheres) {
				atoms = this.alpha_spheres;
			} else {
				atoms = this.atoms;
			}
			this.style.render(this.glmol, atoms);
		}
	}
	center_view(){
		this.glmol.zoomInto(this.atoms)
		this.glmol.refreshAll();	
	}
}
export default Pocket;
