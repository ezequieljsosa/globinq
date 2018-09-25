$.UILayerList = function(htmltable, layers) {
	this.layers = layers;
	this.htmltable = htmltable;
	this.uilayers = {}
	
	this.style_list = [];
	this.data_renderers = []
}

$.UILayerList.prototype = {
	init : function() {

		var tbody = this.htmltable.find("tbody")
		$.each(this.layers, function(i, layer) {
			var on_change = function() {
				layer.refresh();

				tbody.empty();

				$.each(this.uilayers, function(i, layer_renderer) {

					layer_renderer.appendTo(tbody);
					layer_renderer.on_change = on_change;
				});
			}.bind(this)

			var layer_renderer = layer.layer_list_renderer()

			
				$.each(this.style_list,function(i,style_name){
					layer_renderer[style_name]();
				});
			layer_renderer.data_renderers = this.data_renderers ;

			this.uilayers[layer.name] = layer_renderer;
			layer_renderer.appendTo(tbody)
			layer_renderer.on_change = on_change;			

		}.bind(this));
	}

}