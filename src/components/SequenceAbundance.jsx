import React from 'react';
import $ from 'jquery';
import * as d3 from "d3";
import { Grid, Row, Col, Table } from 'react-bootstrap';


//http://bl.ocks.org/kerryrodden/7090426

class SequenceAbundance extends React.Component {
    constructor( props ) {
        super( props )

        // Dimensions of sunburst.
        this.width = 300;
        this.height = 325;
        this.radius = Math.min( this.width, this.height ) / 2;

        // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
        this.b = {
            w: 75, h: 30, s: 3, t: 10
        };

        // Mapping of step names to colors.
        this.colors = {
            "G": "#001f3f",
            "A": "#0074D9",
            "V": "#7FDBFF",
            "L": "#39CCCC",
            "I": "#3D9970",
            "M": "#2ECC40",

            "F": "#01FF70",
            "W": "#FFDC00",
            "P": "#FF851B",
            "S": "#FF4136",
            "T": "#85144b",
            "C": "#F012BE",

            "Y": "#B10DC9",
            "N": "#111111",
            "Q": "#AAAAAA",
            "D": "#DDDDDD",
            "E": "#D0DD0D",
            "K": "#A000AA",
            "R": "#39CC00",
            "H": "#66CC46"

        };

        // Total size of all segments; we set this later, after loading the data.
        this.totalSize = 0;

        this.buildHierarchy = this.buildHierarchy.bind( this );
        this.drawLegend = this.drawLegend.bind( this );
        this.getAncestors = this.getAncestors.bind( this );
        this.mouseleave = this.mouseleave.bind( this );
        this.mouseover = this.mouseover.bind( this );
        this.createVisualization = this.createVisualization.bind( this );
        //this.breadcrumbPoints = this.breadcrumbPoints.bind( this );
        //this.updateBreadcrumbs = this.updateBreadcrumbs.bind( this );

        this.state = { path: [], percentage: "" }
    }

    // Main function to draw and set up the visualization, once we have the data.
    createVisualization( root ) {
        root = d3.hierarchy( root );
        root = root
            .sum( function( d ) {

                return d.size;
            });


        // Basic setup of page elements.
        //this.initializeBreadcrumbTrail();
        this.drawLegend();


        // Bounding circle underneath the sunburst, to make it easier to detect
        // when the mouse leaves the parent g.

        // For efficiency, filter nodes to keep only those large enough to see.
        let partition = d3.partition()
            .size( [2 * Math.PI, this.radius * this.radius] );

        this.vis = d3.select( "#chart"  + this.label() ).append( "svg" ).attr( "width", this.width ).attr( "height", this.height )
            .append( "svg:g" )
            .attr( "id", "container" )
            .attr( "transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")" );

        root = partition( root );
        let data = root.descendants();



        data = data
            .filter( function( d ) {
                return ( d.x1 > 0.005 ); // 0.005 radians = 0.29 degrees
            });

         let selection2 = this.vis.selectAll( "path" ).data( data );


        const arc = d3.arc()
            .startAngle( function( d ) { return d.x0; })
            .endAngle( function( d ) { return d.x1; })
            .innerRadius( function( d ) { return Math.sqrt( d.y0 ); })
            .outerRadius( function( d ) { return Math.sqrt( d.y1 ); });



        selection2.enter().append( "path" )
            .attr( "display", function( d ) { return d.depth ? null : "none"; })
            .attr( "d", arc )
            .attr( "fill-rule", "evenodd" )
            .style( "fill", function( d ) { ; return this.colors[d.data.name]; }.bind( this ) )
            .style( "opacity", 1 )
            .on( "mouseover", this.mouseover )
            .on( "mouseleave", this.mouseleave );

        // Add the mouseleave handler to the bounding circle.
        //d3.select( "#container" )

    };

    label = () => this.props.group + "_" + this.props.site

    // Fade all but the current sequence, and show it in the breadcrumb trail.
    mouseover( d ) {

        const getseq = x => (x.parent.data.name !== "root" ) ?  getseq(x.parent) + x.data.name : x.data.name;

        const seq = getseq(d);
        const me = this;
        this.props.positions.forEach((pos,i) => {
            const val = (seq.length <= i  ) ? "-" : seq[i];
            $("#" + pos + me.label() ).html( val );
        });

        let percentage = ( 100 * d.value / this.totalSize ).toPrecision( 3 );
        let percentageString = percentage + "%";
        if ( percentage < 0.1 ) {
            percentageString = "< 0.1%";
        }

        d3.select( "#percentage" + this.label() )
            .text( percentageString );

        d3.select( "#explanation" + this.label() )
            .style( "visibility", "" );

        let sequenceArray = this.getAncestors( d );
        //this.updateBreadcrumbs( sequenceArray, percentageString );
        this.setState( { path: sequenceArray.map(x=>x.data.name), percentage: percentageString })

        // Fade all the segments.
        d3.selectAll( "path" )
            .style( "opacity", 0.3 );

        // Then highlight only those that are an ancestor of the current segment.
        this.vis.selectAll( "path" )
            .filter( function( node ) {
                return ( sequenceArray.indexOf( node ) >= 0 );
            })
            .style( "opacity", 1 );

    }

    // Restore everything to full opacity when moving off the visualization.
    mouseleave( d ) {

        // Hide the breadcrumb trail
        d3.select( "#trail" + this.label())
            .style( "visibility", "hidden" );

        // Deactivate all segments during transition.
        //        this.vis.selectAll( "path" ).on( "mouseover", null );

        // Transition each segment to full opacity and then reactivate it.
        this.vis.selectAll( "path" )
            //            .transition()
            //            .duration( 1000 )
            .style( "opacity", 1 )
        //            .on( "end", function() {
        //                d3.select( this ).on( "mouseover", me.mouseover );
        //            });

        d3.select( "#explanation" + this.label() )
            .style( "visibility", "hidden" );

    }

    // Given a node in a partition layout, return an array of all of its ancestor
    // nodes, highest first, but excluding the root.
    getAncestors( node ) {
        let path = [];
        let current = node;
        while ( current.parent ) {
            path.unshift( current );
            current = current.parent;
        }
        return path;
    }

    drawLegend() {

        // Dimensions of legend item: width, height, spacing, radius of rounded rect.
        let li = {
            w: 75, h: 20, s: 3, r: 3
        };

        let legend = d3.select( "#SequenceAbundancelegend" +  this.label() ).append( "svg:svg" )
            .attr( "width", li.w )
            .attr( "height", d3.keys( this.colors ).length * ( li.h + li.s ) );

        let g = legend.selectAll( "g" )
            .data( d3.entries( this.colors ) )
            .enter().append( "svg:g" )
            .attr( "transform", function( d, i ) {
                return "translate(0," + i * ( li.h + li.s ) + ")";
            });

        g.append( "svg:rect" )
            .attr( "rx", li.r )
            .attr( "ry", li.r )
            .attr( "width", li.w )
            .attr( "height", li.h )
            .style( "fill", function( d ) { return d.value; });

        g.append( "svg:text" )
            .attr( "x", li.w / 2 )
            .attr( "y", li.h / 2 )
            .attr( "dy", "0.35em" )
            .attr( "text-anchor", "middle" )
            .text( function( d ) { return d.key; });
    }


    // Take a 2-column CSV and transform it into a hierarchical structure suitable
    // for a partition layout. The first column is a sequence of step names, from
    // root to leaf, separated by hyphens. The second column is a count of how
    // often that sequence occurred.
    buildHierarchy( csv ) {



        //json.sum( function( d ) { return d.size; });
        let root = { "name": "root", "children": [] };
        for ( let i = 0; i < csv.length; i++ ) {
            let sequence = csv[i][0];
            let size = +csv[i][1];
            if ( isNaN( size ) ) { // e.g. if this is a header row
                continue;
            }
            let parts = sequence.split( "-" );
            let currentNode = root;
            for ( let j = 0; j < parts.length; j++ ) {
                let children = currentNode["children"];
                let nodeName = parts[j];
                let childNode;
                if ( j + 1 < parts.length ) {
                    // Not yet at the end of the sequence; move down the tree.
                    let foundChild = false;
                    for ( let k = 0; k < children.length; k++ ) {
                        if ( children[k]["name"] === nodeName ) {
                            childNode = children[k];
                            foundChild = true;
                            break;
                        }
                    }
                    // If we don't already have a child node for this branch, create it.
                    if ( !foundChild ) {
                        childNode = { "name": nodeName, "children": [] };
                        children.push( childNode );
                    }
                    currentNode = childNode;
                } else {
                    // Reached the end of the sequence; create a leaf node.
                    childNode = { "name": nodeName, "size": size };
                    children.push( childNode );
                }
            }
        }
        return root;
    }

    componentDidMount() {

        // Use d3.text and d3.csv.parseRows so that we do not need to have a header
        // row, and can receive the csv as an array of arrays.
        const me = this;
        d3.text( "./generated/abundances_" + this.props.group + "_" + this.props.site +".csv ", function( text ) {
            let csv = d3.csvParseRows( text );

            csv.forEach( x => {

                me.totalSize += parseInt(x[1],10);
            })

            //let json = this.buildHierarchy( csv );
//            const stratify = d3.stratify()
//                .id( function( d ) { return d[0] })
//                .parentId( function( d ) {
//                    return d[0].substring( 0, d[0].lastIndexOf( "-" ) );
//                });

            this.createVisualization( this.buildHierarchy( csv ) );
        }.bind( this ) );

    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col md={4}>
                        <div>

                            <Table><tbody> <tr>
                { this.props.positions.map((x,i) =>  <td key={i}>{x}</td>)}

                                </tr>
                            <tr>

                { this.props.positions.map((x,i) =>  <td  key={i} id={x + this.label() }>-</td>)}

                </tr> </tbody></Table>



                        </div>
                        <div id={"chart" + this.label()}>
                            <div id={"explanation" + this.label()} style={{
                                position: "absolute", top: "210px", left: "100px",
                                width: "140px", textAlign: "center", color: "#666",
                                zIndex: "-1", visibility: "hidden", fontSize:18
                            }} >

                                <span id={"percentage" + this.label()}></span><br />
                                of trHb{this.props.group}
              </div>
                        </div>
                    </Col>
                    <Col md={3}>

                        <div id={"sidebar"+ this.label()}>
                            Legend<br />
                            <div id={"SequenceAbundancelegend" + this.label()}></div>
                        </div>

                    </Col>
                </Row>
            </Grid >
        );
    }
};
export default SequenceAbundance;
