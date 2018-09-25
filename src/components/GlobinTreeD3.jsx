import React from 'react';

import * as d3 from "d3";

//https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd

class GlobinTree extends React.Component {
    constructor( props ) {
        super( props )
        /*
        const nodeCircleClass = {
            'cursor': "pointer",
            'fill': "#fff",
            'stroke': "steelblue",
            'stroke-width': "1.5px"
        }

        const nodeTextClass = {
            'font-size': "11px"
        }

        const pathLinkClass = {
            'fill': "none",
            'stroke': "#ccc",
            'stroke-width': "1.5px",
        }
        */
        this.i = 0;
        this.duration = 750;

        this.bubbleUp = this.bubbleUp.bind( this );
        this.walk = this.walk.bind( this );
        this.update = this.update.bind( this );
        this.collapse = this.collapse.bind( this );
        this.nodeClick = this.nodeClick.bind( this );

    }
    componentDidMount() {

        // Set the dimensions and margins of the diagram
        var margin = { top: 20, right: 90, bottom: 30, left: 90 };
        this.width = 960 - margin.left - margin.right;
        this.height = 500 - margin.top - margin.bottom;


        //let fakeDom = ReactFauxDOM.createElement( 'div' );
        this.svg = d3.select( "#tree" ).append( "svg" )
            .attr( "width", this.width + margin.right + margin.left )
            .attr( "height", this.height + margin.top + margin.bottom )
            .append( "g" )
            .attr( "transform", "translate("
            + margin.left + "," + margin.top + ")" );


        this.treeData =
            {
                "name": "Gobina primordial sagrada",
                "children": [
                    {
                        "name": "Globinas de pez",
                        "children": [
                            { "name": "Globina Evangelica" },
                            { "name": "Globina cristiana" },
                            {
                                "name": "Globinas locas",
                                "children": [
                                    { "name": "Globina MadMax" },
                                    { "name": "Globina cucu" }
                                ]
                            },
                        ]
                    },

                    { "name": "Globina loca" }
                ]
            };

        // declares a tree layout and assigns the size
        this.treemap = d3.tree().size( [this.height, this.width] );

        // Assigns parent, children, height, depth
        this.root = d3.hierarchy( this.treeData, function( d ) { return d.children; });
        this.root.x0 = this.height / 2;
        this.root.y0 = 0;

        this.root.children.forEach( this.collapse );



        this.walk( this.root, function( d ) {

            if ( ["Globina cristiana", "Globina loca"].find( x => x === d.data.name ) ) {
                d.data.selected = true;
                this.bubbleUp( d )
            }
        }.bind( this ) );
        this.update( this.root );
    }
    bubbleUp( d ) {

        if ( !d.children ) {
            d.children = d._children;
            d._children = null;
        }
        if ( d.parent ) {
            this.bubbleUp( d.parent );
        }
    }
    walk( d, callback ) {
        callback( d )
        if ( d._children ) {

            d._children.forEach( x => this.walk( x, callback ) )

        } else if ( d.children ) {

            d.children.forEach( x => this.walk( x, callback ) )

        }
    }

    collapse( d ) {
        if ( d.children ) {
            d._children = d.children
            d._children.forEach( this.collapse )
            d.children = null
        }
    }

    update( source ) {

        let me = this.props;
        // Assigns the x and y position for the nodes
        var treeData = this.treemap( this.root );

        // Compute the new tree layout.
        var nodes = treeData.descendants(),
            links = treeData.descendants().slice( 1 );

        // Normalize for fixed-depth.
        nodes.forEach( function( d ) { d.y = d.depth * 180 });

        // ****************** Nodes section ***************************

        // Update the nodes...
        var node = this.svg.selectAll( 'g.node' )
            .data( nodes, function( d ) { return d.id || ( d.id = ++this.i ); }.bind( this ) );

        // Enter any new modes at the parent's previous position.
        var nodeEnter = node.enter().append( 'g' )
            .attr( 'class', 'node' )
            .attr( "transform", function( d ) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on( 'click', this.nodeClick )
            .on( "contextmenu", function( d, i ) {
                d3.event.preventDefault();
                if ( d._children || d.children ) {
                    me.toList();
                } else {
                    me.toGlobin();
                }

            }).style( "stroke", function( d ) { return ( d.data.selected ) ? "red" : null });

        // Add Circle for the nodes
        nodeEnter.append( 'circle' )
            .attr( 'class', 'node' )
            .attr( 'r', 1e-6 )
            .style( "fill", function( d ) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        // Add labels for the nodes
        nodeEnter.append( 'text' )
            .attr( "dy", ".35em" )
            .attr( "x", function( d ) {
                return d.children || d._children ? -13 : 13;
            })
            .attr( "text-anchor", function( d ) {
                return d.children || d._children ? "end" : "start";
            })
            .text( function( d ) { return d.data.name; });
           

        // UPDATE
        var nodeUpdate = nodeEnter.merge( node );

        // Transition to the proper position for the node
        nodeUpdate.transition()
            .duration( this.duration )
            .attr( "transform", function( d ) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        // Update the node attributes and style
        nodeUpdate.select( 'circle.node' )
            .attr( 'r', 10 )
            .style( "fill", function( d ) {
                return d._children ? "lightsteelblue" : "#fff";
            })
            .attr( 'cursor', 'pointer' );


        // Remove any exiting nodes
        var nodeExit = node.exit().transition()
            .duration( this.duration )
            .attr( "transform", function( d ) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        // On exit reduce the node circles size to 0
        nodeExit.select( 'circle' )
            .attr( 'r', 1e-6 );

        // On exit reduce the opacity of text labels
        nodeExit.select( 'text' )
            .style( 'fill-opacity', 1e-6 );

        // ****************** links section ***************************

        // Update the links...
        var link = this.svg.selectAll( 'path.link' )
            .data( links, function( d ) { return d.id; });

        // Enter any new links at the parent's previous position.
        var linkEnter = link.enter().insert( 'path', "g" )
            .attr( "class", "link" )
            .attr( 'd', function( d ) {
                var o = { x: source.x0, y: source.y0 }
                return diagonal( o, o )
            });

        // UPDATE
        var linkUpdate = linkEnter.merge( link );

        // Transition back to the parent element position
        linkUpdate.transition()
            .duration( this.duration )
            .attr( 'd', function( d ) { return diagonal( d, d.parent ) });

        // Remove any exiting links
        link.exit().transition()
            .duration( this.duration )
            .attr( 'd', function( d ) {
                var o = { x: source.x, y: source.y }
                return diagonal( o, o )
            })
            .remove();

        // Store the old positions for transition.
        nodes.forEach( function( d ) {
            d.x0 = d.x;
            d.y0 = d.y;
        });


        // Creates a curved (diagonal) path from parent to the child nodes
        function diagonal( s, d ) {

            let path = `M ${s.y} ${s.x}
                  C ${( s.y + d.y ) / 2} ${s.x},
                    ${( s.y + d.y ) / 2} ${d.x},
                    ${d.y} ${d.x}`

            return path
        }
    }

    nodeClick( d ) {
        // Toggle children on click.
        if ( d.children ) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        this.update( d );
    }

    render() {
        return (<div id="tree" /> );
    }
};
export default GlobinTree;