import React from 'react';

import {Button, Table} from 'react-bootstrap';

import {Link} from 'react-router-dom'

import Modal from 'react-modal';
import msa from "msa";

import "msa/css/msa.css";

const GlobinRow = (props) => {

    const pdbs = [];
    props.pdbs && props.pdbs.forEach(x => {
        if (pdbs.indexOf(x) == -1) {
            pdbs.push(x)
        }
    })

    return (
        <tr>
            <td style={{'width': '100px'}}><Link to={props.base + "protein/" + props.id}> {props.name}</Link></td>
            <td>{props.organism}</td>
            <td>{props.group}</td>
            <td>{(props.identity * 100).toFixed(0)} %</td>
            <td>{(props.coverage * 100).toFixed(0)} %</td>
            <td style={{'width': '200px'}}>
                <div dangerouslySetInnerHTML={{__html: props.exp}}></div>
            </td>
            <td style={{'width': '250px'}}>
                <div dangerouslySetInnerHTML={{__html: props.calc}}></div>
            </td>
            <td style={{'maxWidth': '250px'}}>
                {pdbs.map((pdb, i) =>
                    <a key={i} href={'http://www.rcsb.org/pdb/explore/explore.do?structureId=' + pdb}> {pdb} <img
                        alt="link to pdb page" src={props.base + "external.gif"}/> </a>
                )}
            </td>
            <td>
                <Button id={"aln_button_" + props.idx} onClick={() => props.openAln(props.alignment)}>Alignment</Button>


            </td>
        </tr>
    );
}


class GlobinHitTable extends React.Component {
    state = {open: false}

    onAfterOpen = () => {

        const opts = {seqs: []};
        opts.el = '#msaDiv';
        //opts.menu = "small";
        //opts.bootstrapMenu = true;
        //opts.importURL = "./generated/msa.fasta";
        opts.vis = {

            labelId: false,
            conserv: false,
            overviewbox: false,
            seqlogo: false,
        };
        opts.colorscheme = {}
        opts.zoomer = {
            boxRectHeight: 1,
            boxRectWidth: 1,
            labelNameLength: 70,
            alignmentHeight: 30,
            labelFontsize: 12,
            labelIdLength: 50
        };
        this.m = msa(opts);
        this.m.render();

        const query = Object.keys(this.state.seqs).filter(x => x.split(" ")[0] === "query")[0]
        const hit = Object.keys(this.state.seqs).filter(x => x.split(" ")[0] !== "query")[0]


        this.m.seqs.add({name: query, seq: this.state.seqs[query]});
        this.m.seqs.add({name: hit, seq: this.state.seqs[hit]});
    }

    openAln = (aln) => {
        this.setState({open: !this.state.open, seqs: aln})

    }

    downloadAln = () => {
        const query = Object.keys(this.state.seqs).filter(x => x.split(" ")[0] === "query")[0]
        const hit = Object.keys(this.state.seqs).filter(x => x.split(" ")[0] !== "query")[0]

        var element = document.createElement("a");
        let txt = JSON.stringify(
            [{name: query, seq: this.state.seqs[query]},
                {name: hit, seq: this.state.seqs[hit]}]
        )
        var file = new Blob([txt], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "aln.txt";
        element.click();
    }

    render() {
        const {globins} = this.props;

        return (
            <div>

                <Modal onAfterOpen={this.onAfterOpen}
                       isOpen={this.state.open}
                       onRequestClose={() => this.setState({open: false})}
                       contentLabel="Alignment">
                    <div id="msaDiv"></div>
                    <br/>
                    <Button id="close_aln_btn" onClick={() => this.setState({open: false})}>Close</Button>
                    <Button onClick={this.downloadAln}>Download</Button>
                </Modal>


                {(globins.length > 0) ? <Table id="globin_hit_table" striped bordered condensed hover>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Organism</th>
                            <th>Group</th>
                            <th>Identity</th>
                            <th>Coverage</th>
                            <th>Experimental Value</th>
                            <th>Theoretical Value</th>
                            <th>PDB/s</th>
                            <th>Alignment</th>
                        </tr>
                        </thead>
                        <tbody>

                        {globins.map((g, i) => <GlobinRow key={i} idx={i} base={this.props.base}
                                                          openAln={this.openAln} {...g} />
                        )}

                        </tbody>
                    </Table>
                    : <p>No matches found</p>}


            </div>
        );
    }
}

export default GlobinHitTable;

