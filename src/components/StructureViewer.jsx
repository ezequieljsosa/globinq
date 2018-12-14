import React from 'react';
import $ from 'jquery';
import { Table, Grid, Col, Row } from 'react-bootstrap';
import { GLmol, StickStyle, CartoonStyle, Layer, ByAtomColorer, AtomColorer } from 'sbgglmol';
import Checkbox from 'rc-checkbox';

//
//const LayerRow = ( props ) => (
//    <tr>
//        <td><input type="checkbox" checked={props.layer.visible} /></td>
//        <td>{props.layer.name}</td>
//    </tr>
//);
//
//const LayerList = ( props ) => (
//    <Table>
//        <thead><tr><th>Visible</th><th> Name </th></tr></thead>
//        <tbody>
//            {props.layers.map(( layer, i ) =>
//                <LayerRow key={i} layer={layer} />
//
//            )}
//        </tbody>
//    </Table>
//);

//const FeatureRow = ( props ) => (
//
//    <tr>
//        <td><input type="checkbox" checked={props.feature.visible} /></td>
//        <td>{props.feature.name}</td>
//        <td><Button><Glyphicon glyph="zoom-in" /></Button></td>
//        <td><Button /></td>
//        <td><input type="checkbox" checked={props.feature.labels_visible} /></td>
//    </tr>
//
//
//);
//
//const FeaturesList = ( props ) => (
//    <Table>
//        <thead><tr><th>Visible</th><th> Name </th><th>  Center In  </th><th>   Style</th><th>   Labels</th></tr></thead>
//        <tbody>
//            {props.features.map(( feature, i ) =>
//                <FeatureRow key={i} feature={feature} />
//
//            )}
//        </tbody>
//
//    </Table>
//);

const ResidueCol = ( {residueSetName,residueChange, residue}) => {


    return <tr>
        <td width="10px"> <Checkbox name={"siteCheck" + residueSetName + "_" + residue.name} checked={residue.status}
                                    onChange={( x ) => residueChange( residue, x.target.checked )} />
        </td> <td width="10px"> {residue.aa}</td><td> {residue.name}</td>
    </tr>
};

const ResiduesRow = ( props ) => {


    return <Table condensed>

        <tbody>
            <tr><td colSpan={3}><b>{props.residueSet.name}</b></td></tr>
            {props.residueSet.residues.map(( residue, i ) => {

                return <ResidueCol key={i} residueSetName={props.residueSet.name} residue={residue} residueChange={props.residueChange} />

            })}

        </tbody>
    </Table>

};

const ResiduesList = ( props ) => (
    <div>
        {props.residueSets.map(( residueSet, i ) =>
            <ResiduesRow key={i} residueSet={residueSet} residueChange={props.residueChange} />

        )}
    </div>
);


class StructureViewer extends React.Component {
    constructor( props ) {
        super( props );



        this.state = { layers: [{ name: "heatoms" }, { name: "chain A" }], features: [], residueSets: [] };
        this.default_chain_colors = [parseInt( '0xDA9629', 16 ), parseInt( '0xDA2929', 16 ),
        parseInt( '0x29DA4F', 16 ), parseInt( '0x294CDA', 16 ),
        parseInt( '0x3A9629', 16 ), parseInt( '0x29DA40', 16 ),
        parseInt( '0xDA0029', 16 ), parseInt( '0x204C0A', 16 ),
        parseInt( '0xDA9620', 16 ), parseInt( '0xDA2920', 16 ),
        parseInt( '0x29DA40', 16 ), parseInt( '0x294CD0', 16 ),
        parseInt( '0x3A9620', 16 ), parseInt( '0x29DA49', 16 ),
        parseInt( '0xDA0020', 16 ), parseInt( '0x204C00', 16 ),

        parseInt( '0xDA9629', 16 ), parseInt( '0xDA2929', 16 ),
        parseInt( '0x29DA4F', 16 ), parseInt( '0x294CDA', 16 ),
        parseInt( '0x3A9629', 16 ), parseInt( '0x29DA40', 16 ),
        parseInt( '0xDA0029', 16 ), parseInt( '0x204C0A', 16 ),
        parseInt( '0xDA9620', 16 ), parseInt( '0xDA2920', 16 ),
        parseInt( '0x29DA40', 16 ), parseInt( '0x294CD0', 16 ),
        parseInt( '0x3A9620', 16 ), parseInt( '0x29DA49', 16 ),
        parseInt( '0xDA0020', 16 ), parseInt( '0x204C00', 16 )
        ];


        this.div_style = {
            'width': '100%', 'height': '100%', 'backgroundColor': 'black',
            "minWidth": 500, "minHeight": 500
        }
        this.properties = {
            'showLineNumbers': !this.props.flat,
            'wrapAminoAcids': !this.props.flat,
            'charsPerLine': this.props.charsPerLine,
            'toolbar': !this.props.flat,
            'search': !this.props.flat,
            'title': this.props.title,
            //'sequenceMaxHeight': "30px",
            'badge': false
        }
    }

    _init_heatoms = ( glmol ) => {

        let heatoms = glmol.removeAlphaSpheres( glmol.removeSolvents( glmol.getHetatms( glmol.getAllAtoms() ) ) );
        const chain_atoms = glmol.chain_atoms( "A" );
        if ( glmol.chains.length > 1 ) {
            heatoms = heatoms.filter( heatom => {
                const h = glmol.atoms[heatom]
                let i = 0
                for ( ; i < chain_atoms.length; i++ ) {
                    const atm = glmol.atoms[chain_atoms[i]]
                    if ( Math.sqrt(
                        ( atm.x - h.x ) * ( atm.x - h.x ) +
                        ( atm.y - h.y ) * ( atm.y - h.y ) +
                        ( atm.z - h.z ) * ( atm.z - h.z )
                    ) < 3 )
                        return true;
                }
                return false;
            });
        }


        // if ( heatoms.length > 0 ) {

        let style = new StickStyle( new ByAtomColorer( {}) )
        //  style.bondRadius = glmol.cylinderRadius;
        //  style.atomRadius = glmol.cylinderRadius;
        let layer = new Layer( 'heatoms', heatoms, style, true );
        glmol.add_layer( layer )
        //}
    }

    _init_chains = ( glmol ) => {

        glmol.chains.forEach(( chain, i ) => {

            let chain_style = new CartoonStyle( new AtomColorer(
                this.default_chain_colors[i] ), 0.2, 0.2 );
            let layer = new Layer( chain, glmol.chain_atoms( chain ),
                chain_style, false );
            layer.visible = ( glmol.chains.length === 1 ) || chain === "A";
            glmol.add_layer( layer )

        })
    }

    residueChange = ( residue, status ) => {

        this.glmol.clear_selection();
//        this.glmol.zoomInto( this.glmol.layer[1].atoms );
//        atoms.forEach( atom => {
//            this.glmol.modelGroup.remove( this.glmol.atom_labels[this.glmol.atom_label_id( atom )] );
//            //delete this.glmol.atom_labels[this.glmol.atom_label_id( atom )]
//        });

        let residueSets = this.state.residueSets;
        const active_residues = []
        Object.keys( residueSets ).forEach( x => {
            residueSets[x].residues.forEach( r => {
                if ( r.name === residue.name ) {
                    r.status = status;
                }
                if ( r.status ) {
                    const rid = r.res_id.replace( " ", "" );
                    if ( active_residues.indexOf( rid ) == -1 ) {
                        active_residues.push( rid )
                    }

                }
            })
        })
        let atoms = this.glmol.residue_atoms( active_residues );
        this.setState( residueSets )

        //this.glmol.zoomInto( this.glmol.residue_atoms( ["A.1"] ).map( x => x.serial ) );
        //this.glmol.select_residues( residue.res_id.replace( " ", "" ) );
        this.glmol.select_residues( active_residues );

        this.glmol._draw_labels( atoms.filter( x => x.atom === "CA" ) )
        //this.glmol._draw_labels( atoms );







        this.glmol.show();

    }
    //    shouldComponentUpdate  (nextProps, nextState) {
    //       
    //        nextProps.pdb != this.props.pdb;
    //    }
    loadPDB = ( pdb ) => {
        const me = this;
        fetch( "https://files.rcsb.org/download/" + pdb.pdb + ".pdb" )
            .then( function( response ) {
                return response.text();
            }).then( function( text ) {
                me.glmol = new GLmol( me.props.div_id, true );
                me.glmol.load_data( text );
                me._init_heatoms( me.glmol );
                me._init_chains( me.glmol );
                me.glmol._init_click_event()
                me.glmol.zoomInto( me.glmol.layers[1].atoms );

                me.glmol.refreshAll();
                console.log( me.props.regions )
                console.log( me.props.positions )
                me.setState( {
                    residueSets: Object.keys( me.props.regions ).map( region => {
                        return {
                            name: region,
                            residues: me.props.regions[region].residues.map( res => {
                                return {
                                    status: false,
                                    name: res.name,
                                    aa: res.res,
                                    res_id: me.props.positions[res.name].pdb_pos[me.props.pdb.pdb]
                                }
                            })
                        };
                    })
                });
            });
    }

    componentWillUpdate( nextProps, nextState ) {
        if ( nextProps.pdb !== this.props.pdb ) {
            $( "#" + this.props.div_id ).empty()
            this.loadPDB( nextProps.pdb )
        }


    }



    componentDidMount() {
        this.loadPDB( this.props.pdb )
    }
    render() {


        return ( <Grid>
            <Row>
                <Col md={9}> <div id={this.props.div_id} style={this.div_style}></div></Col>
                <Col md={3}>

                    {/*<LayerList layers={this.state.layers} />*/}
                    <ResiduesList residueSets={this.state.residueSets} residueChange={this.residueChange} />
                </Col>
            </Row> </Grid> )
    }

};
StructureViewer.defaultProps = {
    sequence: "A_SEQUENCE",
    flat: false,
    div_id: "glmol02",
    charsPerLine: 30,
    title: "YOUR SEQUENCE",

}
StructureViewer.propTypes = {
    flat: React.PropTypes.bool,
    div_id: React.PropTypes.string,
    sequence: React.PropTypes.string,
    charsPerLine: React.PropTypes.number,
    title: React.PropTypes.string,
    pdb: React.PropTypes.object


}
export default StructureViewer;
