import {GLmol} from '../GLmol.js'

import {StickStyle} from './style/StickStyle.js'
import {SphereStyle} from './style/SphereStyle.js'
import {Pocket} from './Pocket.js'
import {AtomColorer} from './colorer/AtomColorer.js'

export class SBGGLMol extends GLmol {
    constructor( id, supress ) {
        super( id,supress );/*
        this.selected_atoms_color = parseInt( "0x9F00FF" )
        this.selected_atoms = [];    
        this.layers = []
        this.selected_atoms = []
        this.atom_labels = []
        this.selected_atoms_bond_renderer = new StickStyle(
            new AtomColorer( this.selected_atoms_color ) );
        this.selected_atoms_renderer = new SphereStyle( new AtomColorer(
            this.selected_atoms_color ), 0.1 );
        */

    }

    getAtomsByName( atomlist ) {
        var ret = []
        for ( var i in atomlist ) {
            atom = atomlist[i].split( "." );
            chain = atom[0];
            resi = atom[1];
            atom = atom[2];

            for ( var j in this.atoms ) {
                if ( this.atoms[j].chain == chain && this.atoms[j].resi == resi
                    && this.atoms[j].atom == atom ) {
                    ret.push( this.atoms[j].serial );
                }
            }
        }
        return ret
    }

    residue_atoms( res_ids ) {

        if ( $.isArray( res_ids ) ) {
            return $.grep( this.atoms, function( x ) {
                if ( typeof x != "undefined" ) {

                    return res_ids.indexOf( x.chain + "." + x.resi ) != -1
                }
            });
        } else {
            return $.grep( this.atoms, function( x ) {
                if ( typeof x != "undefined" ) {

                    return [x.chain, x.resi].join( "." ) == res_ids
                }
            });
        }
    }

    select_residues( res_ids ) {

        this.selected_atoms = $.map( this.residue_atoms( res_ids ), function( x ) {
            return x.serial;
        });
        if ( this.selected_atoms.length > 0 ) {
            this.zoomInto( this.selected_atoms )
            this.refreshAll();
        }

    }

    chain_atoms( chain ) {
        var atmIndexes = [];
        $.each( this.atoms, function( i, atm ) {
            if ( ( typeof ( atm ) != "undefined" ) && ( atm.chain == chain )
                && ( atm.resn != "STP" ) ) {
                atmIndexes.push( i )
            }
        });
        return this.removeSolvents( atmIndexes )
    }

    defineRepresentation() {
        this._render_selected();
        $.each( this.layers, function( i, layer ) {
            layer.render();
        }.bind( this ) );

    }
    _render_selected() {

        if (this.selected_atoms && this.selected_atoms.length > 0 ) {

            var atomsIndex = this.selected_atoms;
            this.selected_atoms_renderer.render( this, this.getHetatms( atomsIndex ) );
            this.selected_atoms_bond_renderer.render( this, this
                .removeSolvents( atomsIndex ) );
        }
    }

    add_to_selected( atom_serial ) {
        if ( $.isArray( atom_serial ) ) {
            $.each( atom_serial, function( i, x ) {
                this.selected_atoms.push( x );
            }.bind( this ) )
        } else {
            this.selected_atoms.push( atom_serial );
        }
        this.refreshAll()
    }

    remove_from_selected( atom_serial ) {
        if ( $.isArray( atom_serial ) ) {
            this.selected_atoms = $.grep( this.selected_atoms, function( x ) {
                return atom_serial.indexOf( x ) == -1
            });
        } else {
            this.selected_atoms = $.grep( this.selected_atoms, function( x ) {
                return x != atom_serial
            });
        }
        this.refreshAll()
    }
    clear_selection() {
        this.selected_atoms = [];
        this.refreshAll()
    }
    select_by_atom_name( atom_name_list ) {
        this.selected_atoms = this.getAtomsByName( atom_name_list );
        this.refreshAll()
    }

    load_data( data ) {
        this.data = data;
        this.loadMoleculeStr( undefined, this.data )

        this.chains = $.unique( $.map( this.atoms, function( atm, i ) {
            if ( ( typeof ( atm ) != "undefined" ) && ( atm.resn != "STP" ) )
                return atm.chain
        }) );
        this.chains = $.unique( this.chains.sort() )
        this.data_loaded()
        this.refreshAll()
    }
    refreshAll() {
        this.rebuildScene();
        this.show();
    }

    add_layer( layer ) {
        this.layers.push( layer );
        layer.glmol = this;
    }
    add_pdb_str( pdb_str ) {

        var arr = this.data.split( "\n" )
        var end = arr.length - 3;
        var foo = [];
        for ( var i = 0; i <= end; i++ ) {
            foo.push( arr[i] );
        }

        this.data = foo.join( '\n' ) + pdb_str // .join("\n")

        this.loadMoleculeStr( undefined, this.data );
        this.refreshAll()
    }
	/**
	 * Agrego los métodos que necesito al prototipo de GLmol
	 */
    removeAlphaSpheres( atomlist ) {
        var ret = [];
        for ( var i in atomlist ) {
            var atom = this.atoms[atomlist[i]];
            if ( atom == undefined )
                continue;

            if ( atom.resn != 'STP' )
                ret.push( atom.serial );
        }
        return ret;
    };

    getAlphaSpheres( atomlist ) {

        var ret = [];
        var alpha_pol = [];
        var alpha_apol = [];
        for ( var i in atomlist ) {
            var atom = this.atoms[atomlist[i]];
            if ( atom == undefined )
                continue;

            if ( atom.resn == 'STP' ) {
                if ( atom.atom == 'POL' ) {
                    alpha_pol.push( atom.serial )
                } else if ( atom.atom == 'APOL' ) {
                    alpha_apol.push( atom.serial )
                }
            }
        }
        return new Array( alpha_pol, alpha_apol );
    };
    chain_layers() {

        return $.grep( this.layers, function( l ) {
            return !( l instanceof Pocket )
        });
    }
    pocket_layers() {

        return $.grep( this.layers, function( l ) {
            return ( l instanceof Pocket )
        });
    }

    colorByAtomName( atomlist, residueColors ) {
        for ( var i in atomlist ) {
            var atom = this.atoms[atomlist[i]];
            if ( atom == undefined )
                continue;

            c = residueColors[atom.atom]
            if ( c != undefined )
                atom.color = c;
        }
    };

    draw_labels( atoms_id ) {
        var me = this;
        this._draw_labels( $.map( atoms_id, atom_id => me.atoms[atom_id] ) )
    }

    _draw_labels( atoms ) {
        var me = this;
        $.each( atoms, function( i, atom ) {
            var bb = me.billboard( me.createTextTex( me.atom_label_id( atom ), "30",
                "#ffffff" ) );
            bb.position.set( atom.x, atom.y, atom.z );
            me.atom_labels[me.atom_label_id( atom )] = bb;
            me.modelGroup.add( bb );
        }.bind( this ) );

    }
    atom_label_id( atom ) {
        // atom.chain + ":" + ... + ":" + atom.atom
        return  atom.resn + ":" + atom.resi            ;
    }

    _init_click_event() {
        var me = this;
        $( this.container ).bind(
            'mouseup touchend',
            function( ev ) {
                me.isDragging = false;

                me.adjustPos( ev );
                var x = ev.x, y = ev.y;
                if ( x == undefined )
                    return;
                var dx = x - me.mouseStartX, dy = y - me.mouseStartY;
                var r = Math.sqrt( dx * dx + dy * dy );
                if ( r > 2 )
                    return;
                x -= me.container.position().left;
                y -= me.container.position().top;

                x = ev.offsetX
                y = ev.offsetY

                var mvMat = new THREE.Matrix4().multiply(
                    $.glmol.camera.matrixWorldInverse,
                    me.modelGroup.matrixWorld );
                var pmvMat = new THREE.Matrix4().multiply(
                    $.glmol.camera.projectionMatrix, mvMat );
                var pmvMatInv = new THREE.Matrix4().getInverse( pmvMat );
                var tx = x / me.WIDTH * 2 - 1, ty = 1 - y / me.HEIGHT * 2;
                var nearest = [1, undefined, new TV3( 0, 0, 1000 )];

                for ( var i = 0, ilim = me.atoms.length; i < ilim; i++ ) {
                    var atom = me.atoms[i];
                    if ( atom == undefined )
                        continue;
                    if ( atom.x == undefined )
                        continue;
                    if ( atom.resn == "HOH" )
                        continue;

                    var v = new TV3( atom.x, atom.y, atom.z );
                    pmvMat.multiplyVector3( v );
                    var r2 = ( v.x - tx ) * ( v.x - tx ) + ( v.y - ty ) * ( v.y - ty );
                    if ( r2 > 0.001 )
                        continue;
                    if ( v.z < nearest[2].z )
                        nearest = [r2, atom, v];
                    if ( r2 > 0.001 )
                        continue;
                    if ( r2 < nearest[0] )
                        nearest = [r2, atom, v];
                }
                var atom = nearest[1];
                if ( atom == undefined )
                    return;


                if ( me.atom_labels[me.atom_label_id( atom )] == undefined ) {
                    me._draw_labels( [atom] );

                } else {
                    me.modelGroup.remove( me.atom_labels[me.atom_label_id( atom )] );
                    delete me.atom_labels[me.atom_label_id( atom )]
                }

                me.show();
            });

    };

}
