import React from 'react';

import msa from "msa";
//const msa = require("msa").default
import { Model } from 'backbone-thin'

import "msa/css/msa.css";
/*
class ColumnSelection extends Model {
    constructor( xStart, xEnd ) {
        super()
        this.type = "column"
        this.xStart = xStart;
        this.xEnd = xEnd;
    }

    inRow = () => {
        return true;
    }
    inColumn = ( rowPos ) => {
        return this.xStart <= rowPos && rowPos <= this.xEnd;
    }
    getLength = () => {
        return this.xEnd - this.xStart;
    }

}
*/
const ColumnSelection = Model.extend({
   

    inRow: function () {
      return true;
    },
    inColumn: function (rowPos) {
      return this.xStart <= rowPos && rowPos <= this.xEnd;
    },
    getLength: function () {
      return this.xEnd - this.xStart;
    }
  });


class MSAPDB extends React.Component {
    constructor( props ) {
        super( props )

        this.state = { path: [], percentage: "" }
    }


    componentDidMount() {
       
        const opts = { seqs: this.props.seqs };
        opts.el = '#msaDiv';
        //opts.importURL = "./generated/msa.fasta";
        opts.vis = {

            labelId: false,
            conserv: false,
            overviewbox: false,
            seqlogo: false,
        };
        opts.colorscheme = {};
        opts.zoomer = {
            boxRectHeight: 1,
            boxRectWidth: 1,
            labelNameLength: 70,
            alignmentHeight: 20 + 9 * this.props.seqs.length ,
            labelFontsize: 12,
            labelIdLength: 50
        };
        this.m = msa( opts );

        this.m.render();


    }

    selectPos = ( pos ) => {
        
        const sel = new ColumnSelection( {xStart: pos, xEnd: pos} );
        this.m.g.selcol.add( sel);
        this.m.g.zoomer.setLeftOffset( (pos - 25) > 0 ? (pos - 25) : 0 );


    }


    render() {
        return (


            <div id="msaDiv"></div>


        );
    }
};
export default MSAPDB;
