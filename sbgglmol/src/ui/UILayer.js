$.Layer.prototype.layer_list_renderer = function() {
	return new $.UILayer(this);
}

$.ChainbowColorer.prototype.layer_list_renderer = function() {
	return {
		appendTo : function(x) {
		}
	};
}
$.BFactorColorer.prototype.layer_list_renderer = function() {
	return {
		appendTo : function(x) {
		}
	};
}

$.UILayer = function(layer) {
	this.layer = layer;
	this.render_style = true;
	this.render_style_detail = false;
	this.on_change = function() {
	}
	this.selected_style = null;
	this._style_options = {};
	this.data_renderers = [];
}

$.UILayer.prototype = {
	cartoon : function() {
		var option = {
			name : "cartoon",
			display : "Cartoon",
			style : new $.CartoonStyle(new $.AtomColorer(parseInt('0x294CDA')),
					0.1, 0.3)
		};
		this._style_options["cartoon"] = option;
		return this;
	},
	
	spectrum : function() {
		var option = {
			name : "spectrum",
			display : "Spectrum",
			style : new $.CartoonStyle(
					new $.ChainbowColorer(), 0.1,
					0.3)
		};
		this._style_options["spectrum"] = option;
		return this;
	},
	
	bfactor : function() {
		var option = {
			name : "bfactor",
			display : "Beta Factor",
			style : new $.CartoonStyle(
					new $.BFactorColorer(), 0.1,
					0.3)
		};
		this._style_options["bfactor"] = option;
		return this;
	},
	
	atom : function() {
		var option = {
			name : "atom",
			display : "Atoms",
			style : new StickStyle(
					new ByAtomColorer({}))
		};
		this._style_options["atom"] = option;
		return this;
	},
	all_styles: function(){
		this.cartoon().bfactor().spectrum().atom()
		return this;
	},	
	appendTo : function(tbody) {
		if (this.selected_style == null){
			if (  $.isEmptyObject(this._style_options)){
				this.cartoon();
				this.selected_style = "cartoon";
			} else {
				this.selected_style = this._style_options[Object.keys(this._style_options)[0]].name
			}	
		}
		
		
		var me = this;
		var layer = this.layer;
		var row = $('<tr/>').appendTo(tbody)

		var td = $("<td/>").appendTo(row);

		var select = $('<input/>', {
			type : "checkbox"
		});
		if (layer.visible) {
			select.attr("checked", "checked");
		}
		select.data(layer).click(function(evt) {
			layer.visible = $(this).prop('checked');
			me.on_change()
		}).appendTo(td);

		td = $("<td/>").html(this.layer.name).appendTo(row);
		
		td = $("<td/>").appendTo(row);
		$("<button/>").html('<i class="fa fa-fw fa-search-plus"></i>').appendTo(td).click(function(evt){
			layer.center_view();
		});

		if (this.render_style) {

			if (!layer.hetatm) {
				td = $("<td/>").appendTo(row)
				var select = $(
						'<select/>')
						.appendTo(td).change(
								function(evt) {

									me.selected_style = $(this).val();
									layer.style = me._style_options[$(this)
											.val()].style;
									me.on_change()			

								})
				$.each(this._style_options, function(i, style_option) {
					$('<option/>', {
						value : style_option.name
					}).html(style_option.display).appendTo(select);
				});
				select.val(this.selected_style);
			}
		}
		// if (this.render_style_detail) {
		td = $("<td/>").appendTo(row)
		var style_ui = this.layer.style.layer_list_renderer();
		style_ui.appendTo(td);
		style_ui.on_change = function() {
			me.on_change();
		}
		
		
		$.each(this.data_renderers,function(i,renderer){
			 td  = $("<td/>").appendTo(row);
			 renderer.render(td,this.layer);
			 
			
		}.bind(this));
		
		
		
		// }
		
		td = $("<td/>").appendTo(row)
		select = $('<input/>', {
			type : "checkbox"
		});
		if (layer.show_labels) {
			select.attr("checked", "checked");
		}
		select.data(layer).click(function(evt) {
			layer.show_labels = $(this).prop('checked');
			me.on_change()
		}).appendTo(td);
		
		return this;
	},
	on_color_change : function(evt) {
		return this;
	}
}