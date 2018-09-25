import React from 'react';
import FeatureViewer from 'feature-viewer';
//https://cdn.rawgit.com/calipho-sib/feature-viewer/v0.1.44/examples/index.html
//https://github.com/calipho-sib/feature-viewer
class SequenceFeaturesViewer extends React.Component {
    constructor( props ) {
        super( props )
        this.properties = {
            showAxis: true,
            showSequence: true,
            brushActive: true, //zoom
            toolbar: true, //current zoom & mouse position
            bubbleHelp: true,
            zoomMax: 50 //define the maximum range of the zoom
        }
    }
    componentDidMount() {
        this.ft = new FeatureViewer( this.props.sequence,
            '#' + this.props.div_id,
            {
                showAxis: true,
                showSequence: true,
                brushActive: true, //zoom
                toolbar: true, //current zoom & mouse position
                bubbleHelp: true
               // zoomMax: 50 //define the maximum range of the zoom
            });

        this.props.features.forEach( feature => {
            
            this.ft.addFeature( {
                data: feature.data.map( data => { return { 'x': data.start, 'y': data.end, 'description': data.description, 'id': data.id }; }),
                name: feature.name,
                color: feature.color,
                type: feature.style
            });
        });

        

        /*
        this.ft.addFeature({
            data: [{x:20,y:20,description:"i230",id:"8"},{x:46,y:46},{x:50,y:50}],
            name: "Active Site",
            //className: "test1", //can be used for styling
            color: "black",
            type: "rect" // ['rect', 'path', 'line']
        });
        this.ft.addFeature({
            data: [{id:'xx',x:23,y:23},{x:40,y:40}],
            name: "LT",
            
            //className: "test1", //can be used for styling
            color: "red",
            type: "rect" // ['rect', 'path', 'line']
        });
        
        this.ft.addFeature({
            data: [{id:'xx',x:23,y:23},{x:40,y:40}],
            name: "G8",
            
            //className: "test1", //can be used for styling
            color: "blue",
            type: "rect" // ['rect', 'path', 'line']
        });
        
        this.ft.addFeature({
            data: [{id:'xx',x:23,y:23},{x:40,y:40}],
            name: "E7G",
            
            //className: "test1", //can be used for styling
            color: "green",
            type: "rect" // ['rect', 'path', 'line']
        });
        */
        this.ft.onFeatureSelected( function( d ) {
            console.log( d.detail );
            this.props.featureClicked( d.detail );
        }.bind( this ) );

    }
    render() {
        return ( <div id={this.props.div_id}></div> )
    }

};
SequenceFeaturesViewer.defaultProps = {
    sequence: "A_SEQUENCE",
    div_id: "sequence_div",
    features: []
}
SequenceFeaturesViewer.propTypes = {
    div_id: React.PropTypes.string,
    sequence: React.PropTypes.string,
    features: React.PropTypes.array

}
export default SequenceFeaturesViewer;
