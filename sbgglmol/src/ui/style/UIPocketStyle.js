$.PocketStyle.prototype.layer_list_renderer = function() {
	return new $.UIPocketStyle(this);
}

$.UIPocketStyle = function(style) {	
	this.style = style;		
	this.selected_style = "false";
	this.on_change = function(){}	
}

$.UIPocketStyle.prototype = {
	appendTo : function(row) {
		
		var me = this;
		var uiPocketStyle = this;
		var td = $("<td/>").appendTo(row);
		$('<select><option value="false">atoms</options><option value="true">alpha</option></select>').appendTo(td).change(function(evt){
			uiPocketStyle.selected_style = $(this).val();
			uiPocketStyle.style.show_alpha_spheres = $.parseJSON($(this).val())
			uiPocketStyle.on_change()
		}).val(this.selected_style);
		
		td = $("<td/>").appendTo(row);
		var subtable = $("<table/>").appendTo(td);
		var subrow = $("<tr/>").appendTo(subtable);
		
		
		this.style.atoms_style.colorer.on_change = function(){			
			uiPocketStyle.on_change()
		}
		
		var style_ui = null;
		if (this.style.show_alpha_spheres){
			style_ui = this.style.alpha_spheres_style.layer_list_renderer();
			
		} else {
			style_ui = this.style.atoms_style.layer_list_renderer();			
			
		}
				
		
		style_ui.on_change = function(){
			me.on_change();
		}
			
		style_ui.appendTo(subrow);
		subrow = $("<tr/>").appendTo(subtable);
		
		
		
		
		return this;
	}
}