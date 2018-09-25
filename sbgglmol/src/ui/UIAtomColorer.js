function lpad(padString, length) {
	str = padString
    while (str.length < length)
        str = "0" + str;
    return str;
}

$.AtomColorer.prototype.layer_list_renderer = function() {
	return new $.UIAtomColorer(this);
}

$.UIAtomColorer = function(atom_colorer) {
	this.atom_colorer = atom_colorer;
	this.on_change = function() {
	}
	
	this.color_input = $('<input/>', {
		id : "color1",
		name : "color1",
		type : "text",
		value : '#' + lpad( this.atom_colorer._color.toString(16),6)
	});
}

$.UIAtomColorer.prototype = {
	appendTo : function(element) {
		this.color_input.change(this.on_color_change.bind(this));
		element.append(this.color_input);
		this.color_input.colorPicker();
		return this;
	},
	on_color_change : function(evt) {
		this.atom_colorer._color = parseInt(this.color_input.val().replace('#',
				'0x'));		
		
		this.on_change()
		return this;
	}
}