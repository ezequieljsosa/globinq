export class SBGParser {
	_atom_from_line(line){

		return parseInt(line.substr(6, 5));
	}
	_residue_from_line(line){
		return line.substring(22, 26).trim();
	}
	isATOMLine ( pdbLine ) {
	return pdbLine.substring(0, 4) == 'ATOM';
	}
	isHETATMLine( pdbLine ) {
		return pdbLine.substring(0, 6) == 'HETATM';
	}
	isAlphaSphereLine ( pdbLine ) {		
		return pdbLine.substr(17, 3) == 'STP';
	}
	atomIds_from_pdb(pdb_str){		
		var atom_index_list = [];
		$.each(pdb_str.split("\n"), function(i, line) {
			if (this.isATOMLine(line) || this.isHETATMLine(line)){
				atomSeq = this._atom_from_line(line);
				atom_index_list.push(atomSeq);
			}
		}.bind(this));
		return atom_index_list
	}
	/**
	 * Return a map of pocketNumber:pocketAlphaSpheresPDBString
	 */
	map_alpha_spheres_from_pdb(pdb_str,pocket_numbers){
		/**
		 * Alpha sphere "residue" is the pocket number
		 */		
		
		var pocket_alpha_spheres_str = {};
		$.each(pocket_numbers,function(j,pocket_number){
			pocket_alpha_spheres_str[pocket_number + 1] = "";
		});
		
		
		$.each(pdb_str.split("\n"), function(i,
				line) {
			if (this.isAlphaSphereLine(line)) {
				var pocket_number = parseInt( this._residue_from_line(line) )  ;
				if ( $.isDefAndNotNull(pocket_alpha_spheres_str[pocket_number  +1])){
					pocket_alpha_spheres_str[pocket_number + 1] += line + "\n";	
				}
				
			}
		}.bind(this));
		return pocket_alpha_spheres_str;
	}
	alpha_spheres_from_pdb(pdb_str){
		var pocket_alpha_spheres = [];
		$.each(pdb_str.split("\n"), function(i,
				line) {
			
			if (this.isAlphaSphereLine(line)) {				
				pocket_alpha_spheres.push(line);
			}
		}.bind(this));
		return pocket_alpha_spheres.join("\n");
	}
}