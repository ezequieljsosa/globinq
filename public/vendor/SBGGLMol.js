GLmol.prototype.selected_atoms_color = parseInt("0x9F00FF")

GLmol.prototype.selected_atoms_bond_renderer = new StickStyle(
		new $.AtomColorer(this.selected_atoms_color));
GLmol.prototype.selected_atoms_renderer = new $.SphereStyle(new $.AtomColorer(
		this.selected_atoms_color), 0.1);

GLmol.prototype.getAtomsByName = function(atomlist) {
	var ret = []
	for ( var i in atomlist) {
		atom = atomlist[i].split(".");
		chain = atom[0];
		resi = atom[1];
		atom = atom[2];

		for ( var j in this.atoms) {
			if (this.atoms[j].chain == chain && this.atoms[j].resi == resi
					&& this.atoms[j].atom == atom) {
				ret.push(this.atoms[j].serial);
			}
		}
	}
	return ret
}

GLmol.prototype.residue_atoms = function(res_ids) {

	if ($.isArray(res_ids)) {
		return $.grep(this.atoms, function(x) {
			if (typeof x != "undefined") {

				return res_ids.indexOf(x.chain + "." + x.resi) != -1
			}
		});
	} else {
		return $.grep(this.atoms, function(x) {
			if (typeof x != "undefined") {

				return [ x.chain, x.resi ].join(".") == res_ids
			}
		});
	}
}

GLmol.prototype.select_residues = function(res_ids) {

	this.selected_atoms = $.map(this.residue_atoms(res_ids), function(x) {
		return x.serial;
	});
	if (this.selected_atoms.length > 0) {
		this.zoomInto(this.selected_atoms)
		this.refreshAll();
	}

}

GLmol.prototype.chain_atoms = function(chain) {
	var atmIndexes = [];
	$.each(this.atoms, function(i, atm) {
		if ((typeof (atm) != "undefined") && (atm.chain == chain)
				&& (atm.resn != "STP")) {
			atmIndexes.push(i)
		}
	});
	return this.removeSolvents(atmIndexes)
}

GLmol.prototype.defineRepresentation = function() {
	this._render_selected();
	$.each(this.layers, function(i, layer) {
		layer.render();
	}.bind(this));

}
GLmol.prototype._render_selected = function() {

	if (this.selected_atoms.length > 0) {

		var atomsIndex = this.selected_atoms;
		this.selected_atoms_renderer.render(this, this.getHetatms(atomsIndex));
		this.selected_atoms_bond_renderer.render(this, this
				.removeSolvents(atomsIndex));
	}
}

GLmol.prototype.add_to_selected = function(atom_serial) {
	if ($.isArray(atom_serial)) {
		$.each(atom_serial, function(i, x) {
			this.selected_atoms.push(x);
		}.bind(this))
	} else {
		this.selected_atoms.push(atom_serial);
	}
	this.refreshAll()
}

GLmol.prototype.remove_from_selected = function(atom_serial) {
	if ($.isArray(atom_serial)) {
		this.selected_atoms = $.grep(this.selected_atoms, function(x) {
			return atom_serial.indexOf(x) == -1
		});
	} else {
		this.selected_atoms = $.grep(this.selected_atoms, function(x) {
			return x != atom_serial
		});
	}
	this.refreshAll()
}
GLmol.prototype.clear_selection = function() {
	this.selected_atoms = [];
	this.refreshAll()
}
GLmol.prototype.select_by_atom_name = function(atom_name_list) {
	this.selected_atoms = this.getAtomsByName(atom_name_list);
	this.refreshAll()
}

GLmol.prototype.load_data = function(data) {
	this.data = data;
	this.loadMoleculeStr(undefined, this.data)

	this.chains = $.unique($.map(this.atoms, function(atm, i) {
		if ((typeof (atm) != "undefined") && (atm.resn != "STP"))
			return atm.chain
	}));
	this.chains = $.unique(this.chains.sort())
	this.data_loaded()
	this.refreshAll()
}
GLmol.prototype.refreshAll = function() {
	this.rebuildScene();
	this.show();
}

GLmol.prototype.add_layer = function(layer) {
	this.layers.push(layer);
	layer.glmol = this;
}
GLmol.prototype.add_pdb_str = function(pdb_str) {

	var arr = this.data.split("\n")
	var end = arr.length - 3;
	var foo = [];
	for (var i = 0; i <= end; i++) {
		foo.push(arr[i]);
	}

	this.data = foo.join('\n') + pdb_str // .join("\n")

	this.loadMoleculeStr(undefined, this.data);
	this.refreshAll()
}
/**
 * Agrego los métodos que necesito al prototipo de GLmol
 */
GLmol.prototype.removeAlphaSpheres = function(atomlist) {
	var ret = [];
	for ( var i in atomlist) {
		var atom = this.atoms[atomlist[i]];
		if (atom == undefined)
			continue;

		if (atom.resn != 'STP')
			ret.push(atom.serial);
	}
	return ret;
};

GLmol.prototype.getAlphaSpheres = function(atomlist) {

	var ret = [];
	var alpha_pol = [];
	var alpha_apol = [];
	for ( var i in atomlist) {
		var atom = this.atoms[atomlist[i]];
		if (atom == undefined)
			continue;

		if (atom.resn == 'STP') {
			if (atom.atom == 'POL') {
				alpha_pol.push(atom.serial)
			} else if (atom.atom == 'APOL') {
				alpha_apol.push(atom.serial)
			}
		}
	}
	return new Array(alpha_pol, alpha_apol);
};
GLmol.prototype.chain_layers = function() {

	return $.grep(this.layers, function(l) {
		return !(l instanceof $.Pocket)
	});
}
GLmol.prototype.pocket_layers = function() {

	return $.grep(this.layers, function(l) {
		return (l instanceof $.Pocket)
	});
}

GLmol.prototype.colorByAtomName = function(atomlist, residueColors) {
	for ( var i in atomlist) {
		var atom = this.atoms[atomlist[i]];
		if (atom == undefined)
			continue;

		c = residueColors[atom.atom]
		if (c != undefined)
			atom.color = c;
	}
};

GLmol.prototype.draw_labels = function(atoms_id){
	var me = this;
	this._draw_labels( $.map(atoms_id,atom_id => me.atoms[atom_id]) )
}

GLmol.prototype._draw_labels = function(atoms){
	var me = this;
	$.each(atoms,function(i,atom){
		var bb = me.billboard(me.createTextTex(me.atom_label_id(atom), "30",
		"#ffffff"));
		bb.position.set(atom.x, atom.y, atom.z);
		me.atom_labels[me.atom_label_id(atom)] = bb;
		me.modelGroup.add(bb);	
	}.bind(this));
	
}
GLmol.prototype.atom_label_id = function(atom){
	return  atom.chain + ":" + atom.resn + ":" + atom.resi
	+ ":" + atom.atom;
}

GLmol.prototype._init_click_event = function() {
	var me = this;
	$(this.container).bind(
			'mouseup touchend',
			function(ev) {
				me.isDragging = false;

				me.adjustPos(ev);
				var x = ev.x, y = ev.y;
				if (x == undefined)
					return;
				var dx = x - me.mouseStartX, dy = y - me.mouseStartY;
				var r = Math.sqrt(dx * dx + dy * dy);
				if (r > 2)
					return;
				x -= me.container.position().left;
				y -= me.container.position().top;

				x = ev.offsetX
				y = ev.offsetY

				var mvMat = new THREE.Matrix4().multiply(
						$.glmol.camera.matrixWorldInverse,
						me.modelGroup.matrixWorld);
				var pmvMat = new THREE.Matrix4().multiply(
						$.glmol.camera.projectionMatrix, mvMat);
				var pmvMatInv = new THREE.Matrix4().getInverse(pmvMat);
				var tx = x / me.WIDTH * 2 - 1, ty = 1 - y / me.HEIGHT * 2;
				var nearest = [ 1, undefined, new TV3(0, 0, 1000) ];

				for (var i = 0, ilim = me.atoms.length; i < ilim; i++) {
					var atom = me.atoms[i];
					if (atom == undefined)
						continue;
					if (atom.x == undefined)
						continue;
					if (atom.resn == "HOH")
						continue;
					if (atom.resn == "STD")
						continue;

					var v = new TV3(atom.x, atom.y, atom.z);
					pmvMat.multiplyVector3(v);
					var r2 = (v.x - tx) * (v.x - tx) + (v.y - ty) * (v.y - ty);
					if (r2 > 0.001)
						continue;
					if (v.z < nearest[2].z)
						nearest = [ r2, atom, v ];
					if (r2 > 0.001)
						continue;
					if (r2 < nearest[0])
						nearest = [ r2, atom, v ];
				}
				var atom = nearest[1];
				if (atom == undefined)
					return;
				

				if ($.glmol.atom_labels[me.atom_label_id(atom)] == undefined) {
					me._draw_labels([atom]);

				} else {
					me.modelGroup.remove(me.atom_labels[me.atom_label_id(atom)]);
					delete me.atom_labels[me.atom_label_id(atom)]
				}

				me.show();
			});

};
