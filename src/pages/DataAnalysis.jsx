import React from 'react';
import $ from 'jquery';

import { Grid, Row, Col } from 'react-bootstrap';

import Phylocanvas from 'phylocanvas';

import metadata from 'phylocanvas-plugin-metadata';
Phylocanvas.plugin( metadata );

import msa from "msa";
import fasta from "biojs-io-fasta";
import "msa/css/msa.css";

/*
const tree = Phylocanvas.createTree('root', {
metadata: {
  active: true,
  showHeaders: true,
  showLabels: true,
  blockLength: 32,
  blockSize: null,
  padding: 8,
  columns: [],
  propertyName: 'data',
  underlineHeaders: true,
  headerAngle: 90,
  fillStyle: 'black',
  strokeStyle: 'black',
  lineWidth: 1,
  font: null,
}
})

tree.on('loaded', function () {
// add metadata to leaves
for (const leaf of tree.leaves) {
  leaf.data = {
    columnA: 'value',
    columnB: true,
    columnC: 10,
  };
}
tree.viewMetadataColumns();
tree.draw();
});
*/

const groupColors = { 'O': "#0056e2", 'N': "#27aa00", '?': "black", 'X': "brown", 'P': "#ff7200", 'Q': "#ffdd00" };

class DataAnalysis extends React.Component {
    
    constructor(props){
        super(props);
        this.selectedBranch = null;
    }
    
    componentDidMount(){
        
        const me = this;
        const opts = {};
        opts.el = '#msaDiv';
        //opts.importURL = "./generated/msa.fasta";
        opts.vis = {
                
                labelId: false,
          conserv: true,
          overviewbox: false,
          seqlogo: true,
        };
        opts.zoomer = {
          boxRectHeight: 1,
          boxRectWidth: 1,
          labelNameLength: 230,
          alignmentHeight: window.innerHeight * 0.8,
          labelFontsize: 12,
          labelIdLength: 50
        };
        const m = msa(opts);
        $('#msaDiv').data(m);
        m.g.on("row:click", data => {
            //const name = m.seqs.at(data.seqId).attributes.name;
            //console.log(name);        
            
            const branch = me.tree.branches[data.seqId + "__"];
            
            if(this.selectedBranch  != null){
                this.selectedBranch.selected = false;
                this.selectedBranch.highlighted = false;
                
                this.selectedBranch.setDisplay(this.defStyle)
                
            }    else {
                this.defStyle = {
                        colour: branch.tree.branchColour,
                        shape: branch.nodeShape, 
                        size: branch.radius, 
                        leafStyle:  branch.leafStyle,
                        labelStyle: branch.labelStyle
                      }
            }            
            
            
            this.selectedBranch = branch;
            branch.selected = true;
            branch.highlighted = true;
            
            branch.cascadeFlag('selected', true);
            branch.setDisplay({
                colour: 'red',
                shape: 'circle', // or square, triangle, star
                size: 3, // ratio of the base node size
                leafStyle: {
                  strokeStyle: 'red', //'#0000ff',
                  fillStyle: 'red', // 'rgb(0, 255, 0)',
                  lineWidth: 2,
                },
                labelStyle: {
                  colour: 'black',
                  textSize: 20, // points
                  font: 'Arial',
                  format: 'bold',
                },
              }
            );
            
            
            
            me.tree.draw()
        
        ;});
        
        
        
        
        
        fetch( 'tree.newick' )
        .then( function( response ) {            
            return response.text();
        }).then( function( text ) {    
            
            fetch( 'generated/tree_data.json' )
            .then( function( response ) {            
                return response.json();
            }).then( function( tree_data ) {    
            
                fasta.read("generated/msa.fasta", function(err, seqs){
                    seqs.forEach(seq => {
                        seq.id = seq.name;
                        seq.name = tree_data[seq.id + "__"].organism;
                    });
                    m.seqs.reset(seqs);
                    m.render();
                    $("span:contains('Label')").html("")
                });

                
            const tree = Phylocanvas.createTree( 'tree' ,{multiSelect:false,disableZoom:false,textSize : 30});
            //tree.setTreeType('rectangular');
            tree.alignLabels = true;
            
            tree.on( 'beforeFirstDraw', function() {
                tree.textSize = 24 //tree.textSize - 2
                for ( var i = 0; i < tree.leaves.length; i++ ) {
                    
                    const leave_data =tree_data[tree.leaves[i].id];
                    tree.leaves[i].label = leave_data.organism;
                    tree.leaves[i].data = {
                        column1: {
                            colour: groupColors[leave_data.g]
                            //label: leave_data.g,
                        },
                        column2:  {
                            colour: (leave_data.e) ? "violet" : "white"
                            //label: (leave_data.e) ? "Exp" : null,
                        },
                        column3:  {
                            colour: (leave_data.s > 0) ? "red" : "white"
                            //label:  (leave_data.s > 0) ? "PDB" : "",
                        }
                        
                        
                    };
                }
            });
            
            
            
            tree.load( text );
            tree.setTreeType( 'circular' );
             
            me.tree = tree;
            });
        });
    }
    
    render(props ) {

        return <Grid>
        
        
        
            <Row>
                <Col md={12}>
                    <h1 id="msa_title">MSA</h1>
<div id="msaDiv"></div>

                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    
                    <h1 id="tree_title" style={{float: "left"}}>Tree
                    </h1>
                    <table id="legend" style={{float: "right"}}>
                    <tr><td>Experimental Data</td><td style={{width:50, backgroundColor:"violet"}} ></td></tr>
                    <tr><td>PDB Avaliable</td><td style={{width:50, backgroundColor:"red"}} ></td></tr>
                    
                    <tr><td>N Group</td><td style={{width:50, backgroundColor:"#27aa00"}} ></td></tr>
                    <tr><td>O Group</td><td style={{width:50, backgroundColor:"#0056e2"}} ></td></tr>
                    <tr><td>P Group</td><td style={{width:50, backgroundColor:"#ff7200"}} ></td></tr>
                    <tr><td>Q Group</td><td style={{width:50, backgroundColor:"#ffdd00"}} ></td></tr>
                    </table>
                    
                   
                    <div style={{height:1000}} id="tree" >
                    
                   
                    </div>
                   
                </Col>
            </Row>

           
        </Grid>
    }
} 


export default DataAnalysis;
