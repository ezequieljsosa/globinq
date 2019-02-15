import React from 'react';
import {Grid, Row, Col, Button, Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import Modal from 'react-modal';
import FormField from '../components/FormField.jsx';
import ContribEditModal from '../components/ContribEditModal.jsx';

function isFloat(n) {
    return !isNaN(parseFloat(n))
}

class User extends React.Component {

    state = {
        yesNoContribOpen: false,
        yesNoGlobinOpen: false,
        fieldErrors: {},
        contribModel: {},
        openContrib: false
    };

    deleteGlobin = () => {
        const apiUrl = this.props.apiUrl;
        this.yesNoGlobinClose();
    };

    deleteContrib = () => {
        const apiUrl = this.props.apiUrl;
        this.yesNoContribClose();
    };

    yesNoContribClose = () => {
        this.setState({yesNoContribOpen: false});
    };
    closeContrib = () => {
        this.setState({openContrib: false});
    };

    yesNoGlobinClose = () => {
        this.setState({yesNoGlobinOpen: false});
    };

    openContrib = (contrib_raw) => {
        const contrib = JSON.parse(JSON.stringify(contrib_raw));
        contrib.protein = contrib.experimental.globin;
        contrib.name = contrib.experimental.sequence_red;
        contrib.k_on_o2_exp = contrib.experimental.k_on_o2_exp;
        contrib.k_off_o2_exp = contrib.experimental.k_off_o2_exp;

        this.setState({openContrib: true, fieldErrors: {}, contribModel: contrib});
    };
    openYesNoContrib = (contrib) => {
        this.setState({yesNoContribOpen: true});
    };
    openYesNoGlobin = (contrib) => {
        this.setState({yesNoGlobinOpen: true});
    };

    updateInputValue = (control, value) => {
        const model = this.state.contribModel;
        model[control] = value;
        this.setState({'contribModel': model});
    };

    updateData = () => {

        const me = this;
        const model = this.state.contribModel;
        model.owner = this.props.owner;
        const base = this.props.base;
        const fieldErrors = {};
        let error = "Some data is wrong/missing";


        if ((model.k_on_o2_exp !== "") && !isFloat(model.k_on_o2_exp)) {
            fieldErrors["k_on_o2_exp"] = "invalid value";
        }
        if ((model.k_off_o2_exp !== "") && !isFloat(model.k_off_o2_exp)) {
            fieldErrors["k_off_o2_exp"] = "invalid value";
        }

        if ((model.name.trim().length < 2)) {
            fieldErrors["name"] = "Experimental conditions must have at least 2 characters long";
        }

        if ((this.props.ctype == "pdb") && (model.pdb.length != 4)) {
            fieldErrors["pdb"] = "PDBs has a 4 letter code";
        }

        if (Object.keys(fieldErrors).length) {
            this.setState({fieldErrors: fieldErrors, error: error})
            return;
        }

        this.setState({disabled: true});
        model.user = this.props.user.id;
        model.condition = model.name;
        model.ctype = this.props.ctype;
        delete model["name"];
        const apiUrl = this.props.apiUrl;

        fetch(apiUrl + 'addData', {
            method: 'POST',
            headers: new Headers(),
            body: JSON.stringify(model)
        }).then((res) => res.json())
            .then((data) => {

                me.setState({
                    model: {
                        name: "",
                        k_on_o2_exp: 0,
                        k_off_o2_exp: 0,
                        pdb: "",
                        paper: "",
                        description: ""
                    }
                });

                if (data.id) {
                    me.setState({disabled: false});
                    window.location = base + "protein/" + data.id;
                } else {
                    me.setState({disabled: false, error: data.error});

                }


            })
            .catch((err) => {
                console.log(err);
                this.setState({disabled: false});
            })

    };

    render() {
        const {contributions, globins} = this.props;

        return <Grid>

            <Row>
                <Col md={12}>{contributions ? <h1>Contributions</h1> : <h3>You made no contributions yet</h3>} </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Table striped bordered hover>
                        {contributions.map((c, i) => <tr key={i}>
                                <td><Button onClick={this.openYesNoContrib} bsStyle="danger">Delete</Button>
                                    <Button bsStyle="info" onClick={() => this.openContrib(c)}>Update</Button>
                                </td>
                                <td>
                                    <Link
                                        to={"/protein/" + c.experimental.globin.toString()}>{c.experimental.globin_name}</Link>
                                </td>
                                <td>{c.paper} </td>
                                <td style={{maxWidth: "500px"}}>{c.description} </td>
                            </tr>
                        )}
                    </Table>
                </Col>
            </Row>
            <Row>
                {globins ? <Col md={12}><h1>Globins</h1></Col> : <h3>You uploaded no globins yet</h3>}
            </Row>
            {globins.map((g, i) => <Row key={i}>
                    <Col md={12}><Button onClick={this.openYesNoGlobin}
                                         bsStyle="danger">Delete</Button> <Link
                        to={"/protein/" + g.id.toString()}> {g.name} </Link> ({g.group})</Col>

                </Row>
            )}


            <Modal isOpen={this.state.yesNoGlobinOpen}
                   onRequestClose={this.yesNoGlobinClose}
                   contentLabel="Are you sure?">
                <h3>Are you sure?</h3>

                <Button onClick={this.yesNoGlobinClose}>Close</Button>
                <Button onClick={this.deleteGlobin}>Save</Button>
            </Modal>

            <Modal isOpen={this.state.yesNoContribOpen}
                   onRequestClose={this.yesNoContribClose}
                   contentLabel="Are you sure?">
                <h3>Are you sure?</h3>

                <Button onClick={this.yesNoContribClose}>Close</Button>
                <Button onClick={this.deleteContrib}>Save</Button>
            </Modal>

            <ContribEditModal open={this.state.openContrib} model={this.state.contribModel}
                              updateInputValue={this.updateInputValue} onClose={this.closeContrib}
                              onSave={this.updateData}
                              fieldErrors={this.state.fieldErrors} />

        </Grid>
    }
}


export default User;
