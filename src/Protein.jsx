import React from 'react';

import Select from 'react-select';
import 'react-select/dist/react-select.css';


import StructureViewer from './components/StructureViewer.jsx'
import {Table, Grid, Row, Col, Tooltip, OverlayTrigger, Button, Glyphicon} from 'react-bootstrap';
import SequenceViewer from './components/SequenceViewer.jsx'
import SequenceFeaturesViewer from './components/SequenceFeaturesViewer.jsx'
import GlobinRecord from './components/GlobinRecord.jsx'
import MSAPDB from './components/MSAPDB.jsx'
import Modal from 'react-modal';
import FormField from './components/FormField.jsx';


import {
    Link
} from 'react-router-dom'


class Protein extends React.Component {
    state = {
        openPDBDialog: false, pdbErrors: "", pdb2upload: "",
        selectedPDB: this.props.pdbs.filter(x => x.chain === "A")[0]
    };

    constructor(props) {
        super(props);


        this.regionColors = {
            "AS": "black",
            "LT": "red",
            "STG8": "blue",
            "E7G": "green"
        }
    }

    createFeatures = () => {
        return Object.keys(this.props.regions).map(regionName => {
            let region = this.props.regions[regionName];
            return {
                'data': region.residues.map((residue) => {

                    let position = this.props.positions[residue.name].seq_pos + 1;
                    return {'start': position, 'end': position, 'description': residue.name, id: residue.name};
                }),
                color: this.regionColors[regionName], style: "rect", name: regionName
            }

        });
    };
    featureClicked = (feature) => {

        const res_id = this.props.positions[feature.id].pdb_pos[this.props.pdbs[0]];
        this.refs.structure.residueChange({name: feature.id, res_id: res_id}, true);
        this.refs.msapdb.selectPos(this.props.positions[feature.id].aln_pos +
            this.props.positions[feature.id].insertions
        );
    };
    pdbChanged = (pdb) => {
        this.setState({selectedPDB: pdb.value})
    };
    createSeqs = () => {
        const me = this;
        let data = Object.keys(this.props.alns).filter(x => x.startsWith(this.props.name)).map(pdb_chain => {

            return {
                name: pdb_chain,
                id: pdb_chain,
                seq: me.props.alns[pdb_chain],
                height: 1
            }
        });

        data = data.concat(Object.keys(this.props.alns).filter(x => x !== this.props.name).map(pdb_chain => {

            return {
                name: pdb_chain,
                id: pdb_chain,
                seq: me.props.alns[pdb_chain],
                height: 1
            };
        }));

        return data;
    };

    closePDBDialog = () => {
        this.setState({openPDBDialog: false});
    };

    updateInputValuePDB = (control, value) => {
        this.setState({pdb2upload: value})
    };

    submitPDB = () => {
        const me = this;
        this.setState({disabled: true});
        let pdbErrors = "";
        if (this.state.pdb2upload.length !== 4) {
            pdbErrors = "PDBs have a 4 letter code";
        }

        if (pdbErrors) {
            this.setState({pdbErrors: pdbErrors});
            return;
        }

        const apiUrl = this.props.apiUrl;

        fetch(apiUrl + 'add_pdb', {
            method: 'POST',
            headers: new Headers(),
            body: JSON.stringify({
                "pdb": this.state.pdb2upload.toLowerCase(),
                "globin": this.props.id
            })
        }).then((res) => res.json())
            .then((data) => {

                if (data.id) {
                    me.setState({disabled: false});
                    alert("PDB processed correctly!");
                    window.location = "/protein/" + data.id;
                } else {
                    alert("Error processing PDB: " + data.error);
                    me.setState({disabled: false});
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({disabled: false});
            })
    };

    render() {
        const tooltip = (
            <Tooltip id="tooltip">Query proteins with similar site composition</Tooltip>
        );
        const pdbs_list = [];
        this.props.pdbs.forEach(x => {
            if (pdbs_list.indexOf(x.pdb) === -1) {
                pdbs_list.push(x.pdb)
            }
        });
        return (


            <Grid>

                <Row>
                    <Col md={12}>


                        <GlobinRecord base={this.props.base} toList={this.props.toList}
                                      toGlobinGroup={this.props.toGlobinGroup}
                                      organism={this.props.organism}
                                      user={this.props.user} apiUrl={this.props.apiUrl}
                                      {...this.props} />
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>

                        <Table striped bordered condensed hover>

                            <tbody>
                            <tr>
                                <td id="activeSiteSeq">Active Site</td>
                                <td><SequenceViewer
                                    sequence={this.props.regions['AS'].residues.map(x => x.res).join("")} flat={true}
                                    div_id="div_id1"/></td>
                                <td><OverlayTrigger placement="left" overlay={tooltip}>
                                    <Link
                                        to={this.props.base + "search?as=" + this.props.regions['AS'].reduced}><Button>
                                        <Glyphicon glyph="search"/></Button> </Link>
                                </OverlayTrigger></td>
                            </tr>
                            </tbody>
                        </Table>

                        <Table striped bordered condensed hover>
                            <thead>
                            <tr>
                                <th>Tunnel</th>
                                <th>Sequence</th>
                                <th>% openness</th>
                                <th>% Energetic barrier contribution</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td id="e7tableRow">E7 Gate (E7G)</td>
                                <td><SequenceViewer
                                    sequence={this.props.regions['E7G'].residues.map(x => x.res).join("")} flat={true}
                                    div_id="div_id2"/></td>
                                <td>{(this.props.regions['E7G'].opened) && this.props.regions['E7G'].opened.toFixed(0)}</td>
                                <td>{this.props.regions['E7G'].k ? this.props.regions['E7G'].k.toExponential(2) : "not calculated"} </td>
                                <td><OverlayTrigger placement="left" overlay={tooltip}>
                                    <Link
                                        to={this.props.base + "search?e7=" + this.props.regions['E7G'].reduced}><Button>
                                        <Glyphicon glyph="search"/></Button> </Link>
                                </OverlayTrigger></td>
                            </tr>
                            <tr>
                                <td>Short Tunnel G8 (STG8)</td>
                                <td><SequenceViewer
                                    sequence={this.props.regions['STG8'].residues.map(x => x.res).join("")} flat={true}
                                    div_id="div_id3"/></td>
                                <td>{(this.props.regions['STG8'].opened) && parseFloat(this.props.regions['STG8'].opened).toFixed(0)}</td>
                                <td>{this.props.regions['STG8'].k ? this.props.regions['STG8'].k.toExponential(2) : "not calculated"} </td>
                                <td><OverlayTrigger placement="left" overlay={tooltip}>
                                    <Link
                                        to={this.props.base + "search?g8=" + this.props.regions['STG8'].reduced}><Button>
                                        <Glyphicon glyph="search"/></Button> </Link>
                                </OverlayTrigger></td>
                            </tr>
                            <tr>
                                <td>Long Tunnel (LT)</td>
                                <td><SequenceViewer
                                    sequence={this.props.regions['LT'].residues.map(x => x.res).join("")} flat={true}
                                    div_id="div_id9"/></td>
                                <td>{(this.props.regions['LT'].opened) && parseFloat(this.props.regions['LT'].opened).toFixed(0)}</td>
                                <td>{this.props.regions['LT'].k ? this.props.regions['LT'].k.toExponential(2) : "not calculated"} </td>
                                <td><OverlayTrigger placement="left" overlay={tooltip}>
                                    <Link
                                        to={this.props.base + "search?lt=" + this.props.regions['LT'].reduced}><Button>
                                        <Glyphicon glyph="search"/></Button> </Link>
                                </OverlayTrigger></td>
                            </tr>
                            </tbody>
                        </Table>

                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <SequenceFeaturesViewer featureClicked={this.featureClicked} features={this.createFeatures()}
                                                sequence={this.props.sequence} div_id="div_id4"/>
                    </Col>

                </Row>
                <br/>
                <Button bsStyle="danger" disabled={!this.props.user && "disabled"}
                        onClick={() => this.setState({openPDBDialog: true})}
                        title={!this.props.user && "Register to add your data"}>Associate with PDB</Button>

                <Modal isOpen={this.state.openPDBDialog}
                       onRequestClose={this.closePDBDialog}
                       contentLabel="Submit PDB">

                    <h3>PDB</h3>

                    <FormField
                        value={this.state.pdb2upload} name="pdb2upload"
                        error={this.state.pdbErrors}
                        placeholder="4 letter PDB code" updateInputValue={this.updateInputValuePDB}/>


                    <br/>
                    <Button id="close_aln_btn" onClick={this.closePDBDialog}>Close</Button>
                    <Button onClick={this.submitPDB}>Submit</Button>
                </Modal>


                <br/>
                {(pdbs_list.length > 0) &&
                <Row>

                    <Col md={12}>
                        <MSAPDB ref='msapdb' seqs={this.createSeqs()} pdb={this.state.selectedPDB}/>
                    </Col>
                    <Col md={12}>
                        <br/>
                        {pdbs_list.length > 1 && <Select id="structureSelect" clearable={false}
                                                         name="form-field-name"

                                                         options={this.props.pdbs.filter(x => x.chain === "A").map(x => {
                                                             return {
                                                                 value: x,
                                                                 label: [x.pdb, x.chain, x.description].join(" ")
                                                             }
                                                         })}
                                                         onChange={this.pdbChanged}
                                                         value={{
                                                             value: this.state.selectedPDB,
                                                             label: [this.state.selectedPDB.pdb, this.state.selectedPDB.chain, this.state.selectedPDB.description].join(" ")
                                                         }}
                        />
                        }
                    </Col>
                    <Col md={12}>
                        <StructureViewer pdb={this.state.selectedPDB}
                                         ref='structure' featureClicked={this.featureClicked}
                                         regions={this.props.regions}
                                         positions={this.props.positions}


                        /></Col>
                </Row>}
            </Grid>
        );
    }
}

export default Protein;
