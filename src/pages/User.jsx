import React from 'react';
import {Grid, Row, Col, Button, Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import Modal from 'react-modal';

import ContribEditModal from '../components/ContribEditModal.jsx';

function isFloat(n) {
    return !isNaN(parseFloat(n));
}

const kon = <span>Kon O<sup>2</sup>  [M<sup>-1</sup>s<sup>-1</sup>]  </span>;
const koff = <span>Koff O<sup>2</sup>  [s<sup>-1</sup>]  </span>;

class User extends React.Component {

    state = {
        yesNoContribOpen: false,
        yesNoGlobinOpen: false,
        yesNoGlobinDisabled:false,
        yesNoContribDisabled:false,
        fieldErrors: {},
        contribModel: {},
        openContrib: false
    };

    deleteGlobin = () => {
        const apiUrl = this.props.apiUrl;



        const me = this;
        this.setState({yesNoGlobinDisabled: true});


        fetch(apiUrl + 'del_globin', {
            method: 'post',
            headers: new Headers(),
            body: JSON.stringify({
                globin_id: this.state.selected.id,user_id:me.props.user.id
            })
        }).then((res) => res.json())
            .then((data) => {
                if (data.id) {
                    me.setState({yesNoGlobinDisabled: false});
                    window.location = "/user/" + me.props.user.id;
                } else {
                    me.setState({yesNoGlobinDisabled: false, error: data.error});
                }
                this.yesNoGlobinClose();
            })
            .catch((err) => {
                me.setState({yesNoGlobinDisabled: false});
                console.log(err);
                this.yesNoGlobinClose();
            });

    };

    deleteContrib = () => {
        const apiUrl = this.props.apiUrl;
        const me = this;
        this.setState({yesNoContribDisabled: true});


        fetch(apiUrl + 'del_contrib', {
            method: 'post',
            headers: new Headers(),
            body: JSON.stringify({
                contrib_id: this.state.selected.id,
                globin_id: this.state.selected.experimental.globin
            })
        }).then((res) => res.json())
            .then((data) => {
                if (data.id) {
                    me.setState({yesNoContribDisabled: false});
                    window.location = "/protein/" + data.id;
                } else {
                    me.setState({yesNoContribDisabled: false, error: data.error});
                }
                this.yesNoContribClose();
            })
            .catch((err) => {
                me.setState({yesNoContribDisabled: false});
                console.log(err);
                this.yesNoContribClose();
            });
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
        this.setState({yesNoContribOpen: true, selected: contrib});
    };
    openYesNoGlobin = (globin) => {
        this.setState({yesNoGlobinOpen: true,selected:globin});
    };

    updateInputValue = (control, value) => {
        const model = this.state.contribModel;
        const new_val = value.split(model[control])[1];
        model[control] = value;
        if ((control === "k_on_o2_exp") || (control === "k_off_o2_exp")) {
            if (new_val.match(/[e\,\.\-\d]/)) {

                this.setState({'contribModel': model});
            }
        } else {
            this.setState({'contribModel': model});
        }
    };

    updateData = () => {

        const me = this;
        const model = this.state.contribModel;
        model.owner = this.props.owner;
        const base = this.props.base;
        const fieldErrors = {};
        let error = "Some data is wrong/missing";


        if (((model.k_on_o2_exp !== "") && !isFloat(model.k_on_o2_exp)) || parseFloat(model.k_on_o2_exp) < 0) {
            fieldErrors["k_on_o2_exp"] = "invalid value";
        }
        if (((model.k_off_o2_exp !== "") && !isFloat(model.k_off_o2_exp)) || parseFloat(model.k_off_o2_exp) < 0) {
            fieldErrors["k_off_o2_exp"] = "invalid value";
        }

        if ((model.name.trim().length < 2)) {
            fieldErrors["name"] = "Experimental conditions must have at least 2 characters long";
        }

        if ((this.props.ctype === "pdb") && (model.pdb.length !== 4)) {
            fieldErrors["pdb"] = "PDBs has a 4 letter code";
        }

        if (Object.keys(fieldErrors).length) {
            this.setState({fieldErrors: fieldErrors, error: error})
            return;
        }

        this.setState({disabled: true});
        model.user = this.props.user.id;
        model.k_on_o2_exp = parseFloat(model.k_on_o2_exp).toString();
        model.k_off_o2_exp = parseFloat(model.k_off_o2_exp).toString();
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
                <Col md={12}>{(contributions.length > 0) ? <h1>Contributions</h1> : <h3>You made no experimental contributions yet</h3>} </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Table striped bordered hover>
                        {contributions.map((c, i) => <tr key={i}>
                                <td><Button onClick={() => this.openYesNoContrib(c)} bsStyle="danger">Delete</Button>
                                    <Button bsStyle="info" onClick={() => this.openContrib(c)}>Update</Button>
                                </td>
                                <td>
                                    <Link
                                        to={"/protein/" + c.experimental.globin.toString()}>{c.experimental.globin_name}</Link>
                                    <br/>
                                    {c.experimental.k_on_o2_exp &&  c.experimental.k_on_o2_exp > 0 &&
                                        <div>
                                        {c.experimental.k_on_o2_exp.toExponential(2).toString() + " "}
                                        {kon}
                                        </div>
                                    }
                                    {c.experimental.k_off_o2_exp &&  c.experimental.k_off_o2_exp > 0 &&
                                    <div>
                                        {c.experimental.k_off_o2_exp.toExponential(2).toString() + " "}
                                        {koff}
                                    </div>
                                    }




                                </td>
                                <td>{c.paper} </td>
                                <td style={{maxWidth: "500px"}}>{c.description} </td>
                            </tr>
                        )}
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col md={12}> {(globins.length > 0)  ?<h1>Globins</h1> : <h3>You uploaded no globins yet</h3>}</Col>
            </Row>
            {globins.map((g, i) => <Row key={i}>
                    <Col md={12}><Button onClick={() => this.openYesNoGlobin(g)}
                                         bsStyle="danger">Delete</Button> <Link
                        to={"/protein/" + g.id.toString()}> {g.name} </Link> ({g.group})</Col>

                </Row>
            )}


            <Modal isOpen={this.state.yesNoGlobinOpen}
                   onRequestClose={this.yesNoGlobinClose}
                   contentLabel="Are you sure?">
                <h3>Are you sure?</h3>

                <Button disabled={this.state.yesNoGlobinDisabled} onClick={this.yesNoGlobinClose}>Close</Button>
                <Button bsStyle="danger" disabled={this.state.yesNoGlobinDisabled}
                        onClick={this.deleteGlobin}>Yes</Button>
            </Modal>

            <Modal isOpen={this.state.yesNoContribOpen}
                   onRequestClose={this.yesNoContribClose}
                   contentLabel="Are you sure?">
                <h3>Are you sure?</h3>

                <Button disabled={this.state.yesNoContribDisabled} onClick={this.yesNoContribClose}>Close</Button>
                <Button bsStyle="danger" disabled={this.state.yesNoContribDisabled}
                        onClick={this.deleteContrib}>Yes</Button>
            </Modal>

            <ContribEditModal open={this.state.openContrib} model={this.state.contribModel}
                              updateInputValue={this.updateInputValue} onClose={this.closeContrib}
                              onSave={this.updateData}
                              fieldErrors={this.state.fieldErrors}/>

            <Row>
                <Col  md={12}><hr /></Col>
            </Row>
        </Grid>
    }
}


export default User;
