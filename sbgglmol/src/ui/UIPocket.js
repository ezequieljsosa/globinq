$.Pocket.prototype.layer_list_renderer = function() {
	return new $.UIPocket(this);
}

$.UIPocket = function(pocket) {
	this.pocket = pocket;
	this.on_change = function(){};
	this.style_ui = this.pocket.style.layer_list_renderer();
}

$.UIPocket.prototype = {
	appendTo : function(tbody) {
		var me = this;
		var pocket = this.pocket;
		
		var row = $('<tr/>').appendTo(tbody)

		//Visibility
		var td = $("<td/>").appendTo(row)
		var select = $('<input/>', {
			type : "checkbox",
		
		});
		if (pocket.visible) {
			select.attr("checked", "checked");
		}
		select.data(pocket).click(function(evt) {			
			pocket.visible = $(this).prop('checked');
			me.on_change()
		}).appendTo(td);
		//Name
		td = $("<td/>").html( parseInt( this.pocket.name ) ).appendTo(row)
		
		td = $("<td/>").appendTo(row);
		$("<button/>").html('<i class="fa fa-fw fa-search-plus"></i>').appendTo(td).click(function(evt){
			pocket.center_view();
		});
		
		td = $("<td/>").appendTo(row)
		
		
		this.style_ui.on_change = function(){			
			me.on_change();
		}
		this.style_ui.appendTo(td);

		$.each(this.data_renderers,function(i,renderer){			
			 td  = $("<td/>").appendTo(row);
			 renderer.render(td,me.pocket);
		}.bind(this));
		
		return this;
	},
	on_color_change : function(evt) {

		return this;
	}
}