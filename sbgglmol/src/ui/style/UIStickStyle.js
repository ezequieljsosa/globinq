$.StickStyle.prototype.layer_list_renderer = function() {
	return new $.UIStickStyle(this);
}

$.UIStickStyle = function(style) {
	this.style = style;
	this.on_change = function(e){}
	
}

$.UIStickStyle.prototype = {
	appendTo : function(row) {
		var me = this;
		var style = this.style;

//		var td = $("<td/>").html("bond radius:").appendTo(row)
//		
//		var bondRadius = $("<input/>", {
//			type : "number",
//			width : "40px"
//		}).val(style.bondRadius).appendTo(td)
//		bondRadius.change(function(evt) {
//			style.bondRadius = $(this).val();
//		});

		var td = $("<td/>").appendTo(row)
		this.color_style_ui = this.style.colorer.layer_list_renderer()
		this.color_style_ui.appendTo(td);
		this.color_style_ui.on_change = function(){
			me.on_change();
		}
		
	}
}