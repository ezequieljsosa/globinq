import React from 'react';

import {Button} from 'react-bootstrap';
import ContribEditModal from './ContribEditModal.jsx';
import PropTypes from 'prop-types';


function isFloat(n) {
    return !isNaN(parseFloat(n))
}

class AddDataBtn extends React.Component {

    state = {
        fieldErrors: {"name": "", "k_on_o2_exp": "", "k_off_o2_exp": ""},
        open: false,
        model: {

            name: "",
            k_on_o2_exp: 0,
            k_off_o2_exp: 0,
            pdb: "",
            paper: "",
            description: ""
        }
    };

    constructor(props) {
        super(props);
    }

    updateInputValue = (control, value) => {
        const model = this.state.model;
        model[control] = value;
        this.setState({'model': model});
    };

    addData = () => {

        const me = this;
        const model = this.state.model;
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
        model.protein = this.props.protein.id;
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
        const user = this.props.user;
        const title = this.props.title;


        return <div>

            <Button bsStyle="danger" disabled={!user && "disabled"} onClick={() => this.setState({open: true})}
                    title={!user && "Register to add your data"}>{title ? title : 'Add data'}</Button>


            <ContribEditModal open={this.state.open} model={this.state.model}
                              updateInputValue={this.updateInputValue} onClose={() => this.setState({ open: false })}
                              onSave={this.addData}
                              fieldErrors={this.state.fieldErrors}/>


        </div>
    }
}

AddDataBtn.propTypes = {
    apiUrl: PropTypes.string.isRequired
};

export default AddDataBtn;
