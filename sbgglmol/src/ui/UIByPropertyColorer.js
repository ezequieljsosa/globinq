$.ByResidueColorer.prototype.layer_list_renderer = function() {
	return new $.UIByPropertyColorer(this);
}

$.ByAtomColorer.prototype.layer_list_renderer = function() {
	return new $.UIByPropertyColorer(this);
}
$.ByAtomNameColorer.prototype.layer_list_renderer = function() {
	return new $.UIByPropertyColorer(this);
}

$.UIByPropertyColorer = function(atom_colorer) {
	this.atom_colorer = atom_colorer;
	this.on_change = function() {
	}

}

$.UIByPropertyColorer.prototype = {
	appendTo : function(element) {
		
		var table = $('<table/>').appendTo(element);
		var tr = $('<tr/>').appendTo(table);
		$.each(this.atom_colorer.atom_color_map,function(key,value){
			$('<td/>').appendTo(tr).html(key);
		});
		tr = $('<tr/>').appendTo(table);
		$.each(this.atom_colorer.atom_color_map,function(key,value){
			var td = $('<td/>').appendTo(tr)
			$('<input/>', {
				id : "color1",
				name : key,
				type : "text",
				value : '#' + lpad( value.toString(16),6)
			}).appendTo(td).change(this.on_color_change.bind(this)).colorPicker();
		}.bind(this));
		
		
	},
	on_color_change : function(evt) {
		
		this.atom_colorer.atom_color_map[$(evt.target).attr("name")] = parseInt($(evt.target).val().replace('#',
				'0x'));		
		
		this.on_change()
		return this;
	}
	
}