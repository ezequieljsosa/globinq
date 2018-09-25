import React from 'react';
import { Breadcrumb, Glyphicon, Button } from 'react-bootstrap';
import * as d3 from "d3";
import $ from 'jquery';

//https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd

const stratify = d3.stratify()
    .parentId( function( d ) { return d.id.substring( 0, d.id.lastIndexOf( "." ) ); });
const tree = d3.tree()
    .size( [360, 500] )
    .separation( function( a, b ) { return ( a.parent === b.parent ? 1 : 2 ) / a.depth; });

const groupColors = { 'O': "#0056e2", 'N': "#27aa00", '?': "black", 'X': "brown", 'P': "#ff7200", 'Q': "#ffdd00" };

class RadialTree extends React.Component {
    constructor( props ) {
        super( props )

        this.width = this.props.width;
        this.nodeMouseOver = this.nodeMouseOver.bind( this );

        this.update = this.update.bind( this );
        this.nodeClick = this.nodeClick.bind( this );
        this.updateAbsolute = this.updateAbsolute.bind( this );
        this.updateFromNode = this.updateFromNode.bind( this );
        this.isActiveNode = this.isActiveNode.bind( this );
        this.nodeContext = this.nodeContext.bind( this );

        this.clicked = false;
        this.func = null;

        this.state = { base: "", hidden: [] };
        this.data = [];
        this.selected = null;
    }
    
    componentDidMount() {
        //this.width = document.getElementById("root").offsetWidth
        //d3.json( "./globin_tree.json", function( error, data ) {
        d3.csv( "./globin_tree2.csv", function( error, data ) {
            if ( error ) throw error;
            this.data = data;
            //let filtered = this.data.filter( x => x.depth > 3);
            this.root = tree( stratify( this.data.filter( x => x.id.split( "." ).length < 60 ) ) );
            //this.root = tree(  this.data  );
            this.rootName = this.root.id;
            this.setState( { base: this.rootName })
            this.update()
        }.bind( this ) );
    }

    update() {
        const me = this;
        //        $( "#" + this.props.div_id ).empty()


        function project( x, y ) {
            var angle = ( x - 90 ) / 180 * Math.PI, radius = y;
            return [radius * Math.cos( angle ), radius * Math.sin( angle )];
        }
        let svg = d3.select( "#" + this.props.div_id );

        let width = this.width //+svg.attr( "width" );
        let height = +svg.attr( "height" );
        this.g = svg.append( "g" ).attr( "transform", "translate(" + ( width / 2 + 40 ) + "," + ( height / 2 + 90 ) + ")" );
        const g = this.g;

        var link = g.selectAll( ".link" )
            .data( this.root.descendants().slice( 1 ) );

        link.enter().append( "path" )
            //.attr( "class", "link" )
            .style( "fill", "None" )
            .style( "stroke", d => groupColors[d.data.group] )
            .attr( "d", function( d ) {
                return "M" + project( d.x, d.y )
                    + "C" + project( d.x, ( d.y + d.parent.y ) / 2 )
                    + " " + project( d.parent.x, ( d.y + d.parent.y ) / 2 )
                    + " " + project( d.parent.x, d.parent.y );
            });

        var node = g.selectAll( ".node" )
            .data( this.root.descendants() )

        node.exit().remove();

        var nodeEnter = node.enter().append( "g" ).filter( d => !d.children )
            .style( "fill",  d => ( me.selected !== d.data.id ) ?  "#fff" : "black" )
            .style( "stroke-width", d => ( me.selected !== d.data.id ) ? "1px" : "3px" )
            .style( "stroke", d => (me.selected !== d.data.id ) ?   groupColors[d.data.group] :  "black" )
            .attr( "transform",  d =>  "translate(" + project( d.x, d.y ) + ")" )

            //.on( "contextmenu", this.nodeContext )
            .on( 'click', this.nodeClick )
            .on( 'mouseover', this.nodeMouseOver );

        nodeEnter.append( "circle" )
            .attr( "r", 2.5 );
/*
        nodeEnter.append( "text" )
            .attr( "dy", ".31em" )
            .attr( "x", function( d ) { return d.x < 180 === !d.children ? 6 : -6; })
            .style( "stroke", "black" )
            .style( "fill", "black" )
            .style( "stroke-width", "0.5px" )
            .style( "font", "8px sans-serif" )
            .style( "text-anchor", function( d ) { return d.x < 180 === !d.children ? "start" : "end"; })
            .attr( "transform", function( d ) { return "rotate(" + ( d.x < 180 ? d.x - 90 : d.x + 90 ) + ")"; })
            //.text( function( d ) { return d.id.substring( d.id.lastIndexOf( "." ) + 1 ); });
            .text( function( d ) {

                return d.data.name;
            });*/
    }

    nodeContext( d ) {
        d3.event.preventDefault();
        if ( ( this.rootName === d.id ) ) {
            return;
        }
        this.updateFromNode( this.root.id );
    }

    nodeMouseOver( d ) {
        if ( d ) {
            if ( !this.selected ) { 
                
                this.props.onGlobinSelected( d.data );
            }
        }
    }

    nodeClick( d ) {
        this.selected = d.data.id;
        this.props.onGlobinSelected( d.data )
        this.update();
        //this.updateAbsolute( 0,this.root.id )
        /*let me = this;
        if ( ( this.rootName == d.id ) ) {
            return;
        }
        if ( this.clicked ) {
            clearTimeout( this.func );
            this.updateFromNode( d.id );
        } else {
            this.clicked = true;
 
            this.func = setTimeout(() => {
                me.clicked = false;
                
                if(me.state.hidden.find( x => x == d.id)){
                    me.state.hidden = this.state.hidden.filter( x => x != d.id );
                } else {
                    me.state.hidden.push( d.id );                    
                }    
                this.updateAbsolute( 0,this.root.id )
            }, 300 );
        }
        */
    }
    updateFromNode( d_id ) {

        let svg = d3.select( "#" + this.props.div_id );
        svg.selectAll( ".node" ).remove();
        svg.selectAll( ".link" ).remove();
        let finalTree = [];

        if ( this.state.base === "" ) {
            let toDelete = d_id.split( "." ).slice( 0, -1 ).join( "." );
            let filtered = this.data.filter( x => {
                return x.id.startsWith( d_id ) && this.state.hidden.every( hidden => !x.id.startsWith( hidden + "." ) );
            });

            finalTree = filtered.map( x => {
                let y = Object.create( x );
                if ( toDelete != "" ) {
                    y.id = y.id.replace( toDelete + ".", "" );
                }
                return y;

            });
            this.setState( { base: d_id });
        } else {
            let idBase = this.state.base + "." + d_id.split( "." ).slice( 1 ).join( "." );
            if ( idBase.endsWith( "." ) ) {
                idBase = idBase.substring( 0, idBase.length - 1 )
            }
            let toDelete = idBase.split( "." ).slice( 0, -1 ).join( "." );
            let filtered = this.data.filter( x => x.id.startsWith( idBase ) );

            finalTree = filtered.map( x => {
                let y = Object.create( x );
                y.id = y.id.replace( toDelete + ".", "" );
                //if ( y.id.startsWith( "." ) ) { y.id = y.id.substring( 1 ) };
                return y;

            });
            this.setState( { base: idBase });
        }

        this.root = tree( stratify( finalTree.filter( x => x.id.split( "." ).length < 60 ) ) );
        this.update( this.root );
    }
    updateAbsolute( index, name ) {
        this.state.base = this.state.base.split( "." ).slice( 0, index + 1 ).join( "." );
        if ( this.state.base == this.rootName ) {
            this.state.base = "";
            this.updateFromNode( "" );
        } else {
            this.updateFromNode( name );
        }

    }
    isActiveNode( i ) {
        return ( i + 1 ) == this.state.base.split( "." ).length;
    }
    render() {

        return ( <div>
{/*
            <Breadcrumb>
                {this.state.base.split( "." ).map(( x, i ) =>
                    <Breadcrumb.Item key={i}
                        onClick={( !this.isActiveNode( i ) ) ? () => this.updateAbsolute( i, x ) : null}

                        active={this.isActiveNode( i )}>

                        {'L' + i} <Button onClick={this.props.toList}><Glyphicon glyph="search" /></Button> </Breadcrumb.Item>
                )}

            </Breadcrumb>
            */}
            <div>
                <div style={{ float: "left", width: "33%", position: "fixed" }}>
                    {this.props.children}
                </div>
                <svg id={this.props.div_id} width={"100%"} height={this.props.height}></svg>

            </div>
        </div>
        );
    }
}

RadialTree.defaultProps = {
    width: 960,
    div_id: "radialtree",
    height: 800

}
RadialTree.propTypes = {
    width: React.PropTypes.number,
    div_id: React.PropTypes.string,
    height: React.PropTypes.number
}
export default RadialTree;

