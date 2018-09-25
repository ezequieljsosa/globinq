$.CartoonStyle.prototype.layer_list_renderer = function() {
	return new $.UICartoonStyle(this);
}

$.UICartoonStyle = function(style) {
	this.style = style;
	this.on_change = function(){}
}

$.UICartoonStyle.prototype = {
	appendTo : function(row) {
		var me = this;
		var style = this.style;
//		var td = $("<td/>").html("width:").appendTo(row)
//
//		var curveWidthTd = $("<input/>", {
//			type : "number",
//			width : "40px"
//		}).val(style.curveWidth).appendTo(td)
//		curveWidthTd.change(function(evt) {
//			style.curveWidth = $(this).val();
//		});
//
//		td = $("<td/>").html("thickness:").appendTo(row)
//		var thicknessTd = $("<input/>", {
//			type : "number",
//			width : "40px"
//		}).val(style.thickness).appendTo(td)
//		thicknessTd.change(function(evt) {
//			style.thickness = $(this).val();
//		});

		var td = $("<td/>").appendTo(row)
		var color_style_ui = this.style.colorer.layer_list_renderer()
		color_style_ui.appendTo(td);
		color_style_ui.on_change = function(){
			me.on_change();
		};
	}
}