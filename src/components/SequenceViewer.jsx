import React from 'react';
import $ from 'jquery';

import Sequence from 'sequence-viewer';
//https://cdn.rawgit.com/calipho-sib/sequence-viewer/master/examples/index.html
class SequenceViewer extends React.Component {
    constructor( props ) {
        super( props )
        this.properties =  {
                'showLineNumbers': !this.props.flat,
                'wrapAminoAcids': !this.props.flat,
                'charsPerLine':  this.props.charsPerLine,
                'toolbar': !this.props.flat,
                'search': !this.props.flat,
                'title': this.props.title,
                //'sequenceMaxHeight': "30px",
                'badge': false
            }
    }
    componentDidMount() {
        let seq = new Sequence( this.props.sequence);

        seq.render( '#' + this.props.div_id , this.properties);
        if(this.props.flat){
            $( '#' + this.props.div_id ).find(".sequenceHeader").remove();    
        }
        
        
    }
    render() {
        return (<div id={this.props.div_id}></div>)
    }

};
SequenceViewer.defaultProps = {                
        sequence: "A_SEQUENCE",
        flat : false,
        div_id: "sequence_div",
        charsPerLine: 30,
        title: "YOUR SEQUENCE",
        
}
SequenceViewer.propTypes = {
        flat: React.PropTypes.bool,        
        div_id: React.PropTypes.string,
        sequence: React.PropTypes.string,
        charsPerLine: React.PropTypes.number,
        title: React.PropTypes.string
        
        
     }
export default SequenceViewer;