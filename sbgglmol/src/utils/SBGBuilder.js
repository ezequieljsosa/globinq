import {SBGParser} from './SBGParser.js'
import {SBGGLMol} from '../model/SBGGLMol.js'
import {GLmol} from '../GLmol.js'
import {Pocket} from '../model/Pocket.js'
import {Layer} from '../model/Layer.js'

import {CartoonStyle} from '../model/style/CartoonStyle.js'
import {StickStyle} from '../model/style/StickStyle.js'
import {SphereStyle} from '../model/style/SphereStyle.js'
import {AtomColorer} from '../model/colorer/AtomColorer.js'

export class SBGBuilder {
	constructor() {
		
	this.default_chain_colors = [ parseInt('0xDA9629'), parseInt('0xDA2929'),
			parseInt('0x29DA4F'), parseInt('0x294CDA'), 
			parseInt('0x3A9629'), parseInt('0x29DA40'),
			parseInt('0xDA0029'), parseInt('0x204C0A'),
			parseInt('0xDA9620'), parseInt('0xDA2920'),
			parseInt('0x29DA40'), parseInt('0x294CD0'), 
			parseInt('0x3A9620'), parseInt('0x29DA49'),
			parseInt('0xDA0020'), parseInt('0x204C00'),
			
			parseInt('0xDA9629'), parseInt('0xDA2929'),
			parseInt('0x29DA4F'), parseInt('0x294CDA'), 
			parseInt('0x3A9629'), parseInt('0x29DA40'),
			parseInt('0xDA0029'), parseInt('0x204C0A'),
			parseInt('0xDA9620'), parseInt('0xDA2920'),
			parseInt('0x29DA40'), parseInt('0x294CD0'), 
			parseInt('0x3A9620'), parseInt('0x29DA49'),
			parseInt('0xDA0020'), parseInt('0x204C00')
			]
	
	this._urls = [];
	this._data = null;
	this._download_fail = function(e) {
		alert("Error loading " + this._urls + " -> " + e)
	};
	this._data_loaded_fn = function(sbgglmol) {
		
	}
	this._div_name = null;
	this.parser = new SBGParser();
	this.pockets_to_load = [];
	this.pockets_data = [];
	
	this.pdb_strs_to_add = [];
	
}

	build () {
		if (this._div_name == null) {
			throw "div not initialized...";
		}
		
		if (this._urls.length > 0){
			this._load_urls(this._urls.reverse())
			return null;
		}
		
		if (this._data == null) {
			throw "pdb data not initialized"
		} else {
			return this._build();
		}	
	}
	_load_urls(urls){
		if (urls.length > 0 ){
			var url_handler = urls.pop()
			if (url_handler.length == 2){
				$.get(url_handler[0]).
				done( function(data){
					url_handler[1](data);
					this._load_urls(urls);
				}.bind(this) ).
				fail(this._download_fail.bind(this));	
			} else {
				this._execute_cascade_url(url_handler[0].reverse(),url_handler[1],url_handler[2],urls);
			}
				
		}		
	}
	_execute_cascade_url (urls,handler,params,url_groups){
		if(urls.length == 0){	
			
			handler.apply(this,params)
			if(url_groups.length == 0){
				this._build();
			} else {
				this._load_urls(url_groups);
			}
		} else {
			var url = urls.pop();
			$.get(url).
				success(function(data){
					params.push(data);
					this._execute_cascade_url(urls,handler,params,url_groups)
				}.bind(this)).
				fail(this._download_fail.bind(this));
		}
	}
	data (data){
		this._data = data;
		return this;
	}
	div (div_name) {
		this._div_name = div_name
		return this;
	}
	pdb (pdb) {		
		this.url('http://www.rcsb.org/pdb/files/' + pdb + '.pdb');
		return this;
	}
	url (url) {
		this._urls = [[url,this._build_first_phase.bind(this)]];
		return this;

	}
	layer_list(div_id){
		this.layer_list_id =  div_id ;		
		return this
	}
	pocket_url (pocket_name,url_pdb_str_residues,url_pdb_str_alphaSpheres){
		this.pdb_strs_to_add.push(url_pdb_str_alphaSpheres)
		this._urls.push([[url_pdb_str_residues,url_pdb_str_alphaSpheres],this._handle_pocket_data.bind(this),[pocket_name]]);
		return this;
		
	}
	add_pdb_str_data_url(url){
		this.pdb_strs_to_add.push(url)
		return this;
	}
	_handle_pocket_data (pocket_name,pocket_atoms_str,pocket_alpha_spheres_str){
		this.pockets_data.push([pocket_name,pocket_atoms_str,pocket_alpha_spheres_str])
	}
	load_pocket(glmol,pocket_name,pocket_atoms_str,pocket_alpha_spheres_str){
		
		glmol.add_pdb_str(pocket_alpha_spheres_str);
		
		var pocket_atom_index_list = pocket_atoms_str;// this.parser.atomIds_from_pdb(pocket_atoms_str) ;
		var alpha_spheres_index_list =  this.parser.atomIds_from_pdb(pocket_alpha_spheres_str)  ;
		
		var style = new StickStyle(
				new AtomColorer(glmol.selected_atoms_color));
		var pocket = new Pocket(pocket_name, pocket_atom_index_list,
				alpha_spheres_index_list, style);
		glmol.add_layer(pocket)
	}
	_load_data (data){
		this._data = data;
		this._build();
	}
	_build_first_phase(data){
		this.data(data);
		this.glmol = new GLmol(this._div_name, true);
		this.glmol.data_loaded = function(glmol) {}
		this.glmol.load_data(this._data)
	}
	_build () {		
			if (this.glmol == null){
				this.glmol = new GLmol(this._div_name, true);
				this.glmol.layers = []
				this.glmol.selected_atoms = []
				this.glmol.atom_labels = []
				this.glmol._init_click_event()
			}
			var glmol = this.glmol;
			glmol.data_loaded = function() {
				this._default_init(glmol);
				this._data_loaded_fn(glmol);
			}.bind(this);		
			glmol.load_data(this._data);
			$.each(this.pdb_strs_to_add,function(i,pdb_str){
				glmol.add_pdb_str (pdb_str);
			});
			return glmol
		

	}
	_default_init (glmol) {		
		
		this._init_chains(glmol);
		this._init_heatoms(glmol);
		
		this._init_pockets(glmol);
		this._init_controls(glmol);
		
	}
	_init_pockets(glmol){
		
		if(this.pockets_data.length > 0) {
			
			$.each(this.pockets_data,function(i,pocket_arr){
				
				var pocket_name = pocket_arr[0]; 
				var pocket_atoms_str = pocket_arr[1];
				var raw_str_alpha_spheres = pocket_arr[2];	
				
				var str_alpha_spheres = this.parser.alpha_spheres_from_pdb(raw_str_alpha_spheres);
				this.load_pocket(glmol,pocket_name,pocket_atoms_str,str_alpha_spheres);
				
			}.bind(this));
			
		
		}
		
	}
	_init_controls(glmol){
		
		if(this.layer_list_id != null ){
			this._layer_list = new $.UILayerList($('#'  + this.layer_list_id ), glmol);
			this._layer_list.init();
		}		
	}
	/**
	 * Carga un layer por cadena
	 */
	_init_chains (glmol) {
		
		$.each(glmol.chains, function(i, chain) {
				//if (chain != " ") {
				// BORRAR esta cond es para que no cuente a las alpha spheres
				// como un layer mas, si hay un modelo esto no anda
				var chain_style = new CartoonStyle(new $.AtomColorer(
						this.default_chain_colors[i]), 0.2, 0.2);
				var layer = new Layer(chain, glmol.chain_atoms(chain),
						chain_style, false);
				glmol.add_layer(layer)
			
		}.bind(this))
	}
	/**
	 * Carga el layer de heatoms
	 */
	_init_heatoms (glmol) {
		var heatoms = glmol.removeAlphaSpheres( glmol.removeSolvents(glmol.getHetatms(glmol.getAllAtoms())));
		if (heatoms.length > 0) {
			style = new SphereStyle(new ByAtomColorer({}), 1)
			layer = new Layer('heatoms', heatoms, style, true);
			glmol.add_layer(layer)
		}
	}

}