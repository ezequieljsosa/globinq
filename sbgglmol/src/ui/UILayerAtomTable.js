$.UILayerAtomTable = function(htmldiv, atoms) {
	this.atoms = atoms;
	this.htmldiv = htmldiv;
}

$.UILayerAtomTable.prototype = {
	on_change : function(atom, status) {
		alert(atom + "" + status)
	},
	init : function() {
		var table = $('<table/>').appendTo(this.htmldiv);
		$.each(this.atoms, function(i, atom) {
			if (typeof atom != "undefined") {
				this.atomRow(atom).appendTo(table);
			}
		}.bind(this));

	},
	atomRow : function(atom) {
		var row = $('<tr/>');
		/*
		 * atom: "N" b: 38.97 bondOrder: Array[0] bonds: Array[0] chain: "A"
		 * color: 16777215 elem: "N" hetflag: false resi: 36 resn: "GLY" serial:
		 * 1 ss: "c" x: 0.227 y: -45.901 z: -4.543
		 */
		$.each([ "serial", "atom", "chain", "resi", "resn", "x", "y", "z" ],
				function(i, attr) {
					$('<td/>').html(atom[attr]).appendTo(row);
				});
		var td = $('<td/>').appendTo(row);
		var input = $('<input/>', {
			type : "checkbox"
		}).appendTo(td);
		input.change(function(evt) {
			this.on_change(atom, input.prop('checked'));
		}.bind(this));
		return row;
	}
}
