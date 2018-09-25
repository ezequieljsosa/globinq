$.SphereStyle.prototype.layer_list_renderer = function() {
	return new $.UISphereStyle(this);
}

$.UISphereStyle = function(style) {
	this.style = style;
}

$.UISphereStyle.prototype = {
	appendTo : function(row) {
		var me = this;
		var style = this.style;
		
		var td = $("<td/>").appendTo(row)
//
//		var sphereRadius = $("<input/>", {
//			type : "number",
//			width : "40px"
//		}).val(style.sphereRadius).appendTo(td)
//		sphereRadius.change(function(evt) {
//			style.sphereRadius = parseFloat($(this).val());
//		});
//		td = $("<td/>").appendTo(row)
		
		var color_style_ui = this.style.colorer.layer_list_renderer()
		color_style_ui.appendTo(td);
		color_style_ui.on_change = function(){
			me.on_change();
		}
	}
}