import React from 'react';
import {Grid, Row, Col, Table, Button} from 'react-bootstrap';
import $ from 'jquery';
import FormField from '../components/FormField.jsx';
import OperationStatus from '../components/OperationStatus.jsx';
import TaxSelect from '../components/TaxSelect.jsx';
import ExperimentalData from '../components/ExperimentalData.jsx';




const globin_groups = ["P", "N", "O", "Q", "X"];

const sites = {
    "lt": ["H5", "B2", "H9", "E15", "E11", "G8"],
    "e7": ["B10", "CD1", "E7", "E11"],
    "g8": ["H9", "G8", "G9"],
    "sa": ["B10", "CD1", "E7", "E11", "G8"]
};

let all_sites = [];
Object.keys(sites).forEach(x => {
    sites[x].forEach(y => {
        if (all_sites.indexOf(y) == -1) {
            all_sites.push(y)
        }
    })
});

function isFloat(n) {
    return !isNaN(parseFloat(n))
}



const ChanelInput = ({chanelName, model, sequence, posmap, updateInputValue, positions}) => <div>
    <h2>{chanelName}</h2>
    <Table>
        <tbody>
        <tr>
            {positions.map((x, i) => <td key={i}>{x}</td>)}

        </tr>
        <tr>
            {positions.map((x, i) => <td key={i}>{sequence && (x in posmap) && sequence[posmap[x]]}</td>)}
        </tr>
        </tbody>
    </Table>

    <FormField
        label="% openness" name="openness" value={model.openness}

        placeholder="50" updateInputValue={updateInputValue}/>

    <FormField
        label="% Energetic barrier contribution " name="e_bar_contrib" value={model.e_bar_contrib}
        placeholder="10" updateInputValue={updateInputValue}/>


</div>;

class UploadGlobin extends React.Component {

    state = {
        idx:2,
        ok: "",
        error: "",
        disabled: false,
        fieldErrors: {},
        posmap: {},
        model: {
            tax: {id: 0},
            uniprot: "",
            name: "",

            sequence: "",

            l_channel: {

                openness: null,
                e_bar_contrib: null
            },
            g8_channel: {

                openness: null,
                e_bar_contrib: null
            },
            e7_portal: {

                openness: null,
                e_bar_contrib: null
            },
            active_site: "",
            owner: "",
            institute: "",
            email: "",
            experimental: [{
                name: "",
                order:1,
                k_on_o2_exp: null,
                k_off_o2_exp: null
            }],
            p50: "",

        }
    };

    updateInputValue = (control, value) => {
        const model = this.state.model;
        model[control] = value;
        this.setState({'model': model});
    };
    updateInputValueExp = (control, value, i) => {
        const model = this.state.model;
        const data = model.experimental.filter(x => x.order == i)[0];
        data[control] = value;
        this.setState({'model': model});
    };


    saveGlobin = () => {


        const model = this.state.model;
        model.owner = this.props.owner;
        const base = this.props.base;
        const fieldErrors = {}
        let error = "Some data is wrong/missing";
        if (model.tax.id == 0) {
            error = "You must select a taxonomy"
        }

        if ((model.p50 !== "") && !isFloat(model.p50)) {
            fieldErrors["p50"] = "invalid value"
        }

        // if (model.uniprot.trim() == "") {
        //     fieldErrors["uniprot"] = "cant be empty"
        // }


        if (model.sequence.length < 50) {
            fieldErrors["sequence"] = "sequence is too short"
        }

        if (Object.keys(fieldErrors).length) {
            this.setState({fieldErrors: fieldErrors, error: error});
            return
        }

        this.setState({disabled: true});
        model.experimental = model.experimental.filter(x => x.k_on_o2_exp || x.k_off_o2_exp);
        model.experimental.forEach(x => {
           x.name = x["name_" + x.order.toString() ]
        });
        fetch(this.props.apiUrl + 'upload', {
            method: 'POST',
            headers: new Headers(),
            body: JSON.stringify(model)
        }).then((res) => res.json())
            .then((data) => {

                if (data.id){
                    this.setState({disabled: false});
                    window.location = base + "protein/" + data.id;
                } else {
                    this.setState({disabled: false,error:data.error});
                    $('html, body').animate({
                        scrollTop: $("#operation_status_div").offset().top
                    }, 2000);
                }


            })
            .catch((err) => {
                console.log(err);
                this.setState({disabled: false});
            })

    };
    addExpData = () => {
        const model = this.state.model;
        model.experimental.push({order:this.state.idx});
        this.setState({'model': model,idx:this.state.idx + 1})
    };

    removeExpData = (idx) => {
        const model = this.state.model;
        model.experimental = model.experimental.filter(x => x.order != idx)
        this.setState({'model': model})
    };

    render() {

        return <Grid>

            <Row>
                <Col md={12}><h1>Upload Globin</h1>
                    <OperationStatus divId="operation_status_div" error={this.state.error} ok={this.state.ok}/>
                </Col>

            </Row>

            <Row><Col md={9} sm={12} lg={9}>

                <h3 id="taxonomy_drop">Taxonomy</h3>
                <TaxSelect apiUrl={this.props.apiUrl}
                           value={{label: this.state.model.tax.name, value: this.state.model.tax.id}}
                           onChange={(tax) => this.updateInputValue("tax", tax)}/>


                <FormField name="uniprot" label="Uniprot ID"
                           value={this.state.uniprot}
                           error={this.state.fieldErrors["uniprot"]}
                           placeholder="P9WN25"
                           updateInputValue={this.updateInputValue}
                />


                <FormField
                    label="Sequence" name="sequence" value={this.state.model.sequence}
                    error={this.state.fieldErrors["sequence"]} area={true}
                    placeholder="sequence" updateInputValue={this.updateInputValue}/>


                <h2>Experimental</h2>
                <FormField
                    label="p50" name="p50" value={this.state.model.p50}
                    error={this.state.fieldErrors["p50"]}
                    placeholder="example: 1.5" updateInputValue={this.updateInputValue}/>

                {this.state.model.experimental.map((x, i) =>
                    <div style={{'padding-left' : '50px'}}><ExperimentalData key={i} model={x} idx={ x.order  } errors={this.state.fieldErrors}
                                           updateInputValue={(control, value) => this.updateInputValueExp(control, value, x.order)}/>
                        { (i > 0) &&    <Button bsStyle="danger"  id="rm_exp_data_btn" onClick={() => this.removeExpData(x.order)}> Remove kinetic data {x.order} </Button> }

                    </div>
                )}
                <br />
                <Button id="add_exp_data_btn" onClick={this.addExpData}> Add additional kinetic data </Button>
            </Col>
            </Row>
            <Row><Col md={12}>
                <hr/>
                <Button id="upload_globin_btn" disabled={this.state.disabled} onClick={this.saveGlobin}> Upload Globin</Button>
                {this.state.disabled && <img src="spinner.gif" /> }

                <br/><br/><br/>
            </Col></Row>

        </Grid>
    }
}

export default UploadGlobin;
