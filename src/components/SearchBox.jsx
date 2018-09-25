import React from 'react';

import {InputGroup, Button, FormControl, Grid, Col, Row, Table} from 'react-bootstrap';

import {Range} from 'rc-slider';
import 'rc-slider/assets/index.css';

//const LineChart = require( "react-chartjs" ).Line;

import {
    Link
} from 'react-router-dom'
import {Redirect} from 'react-router';
import Select from "./Select";

const SearchText = ({value, inputUpdated, navigate}) => (
    <div><FormControl id="searchTxt" onKeyDown={(event) => (event.keyCode === 13) ? navigate() : null} type="text" value={value}
                      onChange={(evt) => {
                          inputUpdated(evt.target.value)
                      }}/>
    </div>
);

const sites = {
    "LT": ["B2", "E11", "E15", "G8", "H5", "H9"],
    "E7G": ["B10", "CD1", "E7", "E11"],
    "STG8": ["G8", "G9", "H9"],
    "AS": ["B10", "CD1", "E7", "E11", "G8"]
};

const site_search = {
    "LT": "lt",
    "E7G": "e7",
    "STG8": "g8",
    "AS": "sa"
};


//const data = {
//    labels: ["January", "February", "March", "April", "May", "June", "July"],
//    datasets: [
//        {
//            
//            label: "My First dataset",
//            fillColor: "rgba(220,220,220,0.2)",
//            strokeColor: "rgba(220,220,220,1)",
//            pointColor: "rgba(220,220,220,1)",
//            pointStrokeColor: "#fff",
//            pointHighlightFill: "#fff",
//            pointHighlightStroke: "rgba(220,220,220,1)",       
//            data: [65, 59, 80, 81, 56, 55, 40]            
//        }
//    ]
//}
//
//const options = {
//        scales: {
//            xAxes: [{
//                type: 'logarithmic',
//                position: 'bottom',
//                ticks: {
//                    min: 1,
//                    max: 100000
//                }
//            }]
//        }
//    }

const PosSelect = ({site, pos, value, onDelete}) => (
    <tr>
        <td>{site}</td>
        <td>{pos}</td>
        <td>{value}</td>
        <td><Button onClick={() => onDelete(site, pos)}> Remove </Button></td>
    </tr>
)


class SearchBox extends React.Component {

    state = {
        kw: "", search: "search", advanced: false,
        koff_start: Math.pow(10, -5), kon_start: Math.pow(10, 4),
        koff_end: 1, kon_end: Math.pow(10, 9),
        k_on_checked: false,
        k_off_checked: false,

        p50_min: 0, p50_max: 1, p50_checked: false,
        g_p: false, g_n: false, g_o: false, g_q: false, g_x: false,
        only_struct: false,
        redirect: false,
        noncurated: false,
        with_exp: false,
        selected_site: "LT",
        selected_pos: "B2",
        site_filters: []

    }

    inputUpdated = (value) => {
        this.setState({'kw': value});

    };

    componentDidUpdate() {
        this.updateSearch()
    }

    toogleAdvanced = () => {
        this.setState({advanced: !this.state.advanced});
    }

    updateSearch = () => {

        let search = "search?kw=" + this.state.kw;

        if (this.state.advanced & this.state.k_on_checked) {
            search += `&kon_start=${this.state.kon_start}&kon_end=${this.state.kon_end}`
        }
        if (this.state.advanced & this.state.k_off_checked) {
            search += `&koff_start=${this.state.koff_start}&koff_end=${this.state.koff_end}`
        }

        if (this.state.advanced & this.state.p50_checked) {
            search += `&p50_min=${this.state.p50_min}&p50_max=${this.state.p50_max}`
        }
        if (this.state.advanced & (this.state.g_p
                | this.state.g_n | this.state.g_o
                | this.state.g_q | this.state.g_x
            )) {
            search += `&groups=p_${this.state.g_p},n_${this.state.g_n},o_${this.state.g_o},q_${this.state.g_q},x_${this.state.g_x}`
        }
        if (this.state.advanced & this.state.only_struct) {
            search += `&only_struct=1`
        }
        if (this.state.advanced & this.state.noncurated) {
            search += `&noncurated=1`
        }
        if (this.state.advanced & this.state.with_exp) {
            search += `&with_exp=1`
        }
        const site_filters = this.state.site_filters;
        if (site_filters.length > 0) {
            Object.keys(sites).forEach(site => {
                let seq = "";
                sites[site].forEach(pos => {
                    const site_filter = site_filters.filter(x => x.site === site && x.pos === pos);
                    seq += (site_filter.length > 0) ? site_filter[0].value : ".";
                });
                if (seq.replace(new RegExp("[.]", 'g'),"") !== ""){
                    search += `&${site_search[site]}=${seq}` ;
                }

            });
        }

        if (search !== this.state.search) {
            this.setState({'search': search});
        }


    };
    navigate = () => {

        this.setState({redirect: true})

        //        this.props.history.push(this.state.search); 
    };
    changeKon = (x) => {
        this.setState({kon_start: Math.pow(10, x[0]), kon_end: Math.pow(10, x[1]), k_on_checked: true})
    };
    changeKoff = (x) => {
        this.setState({koff_start: Math.pow(10, x[0]), koff_end: Math.pow(10, x[1]), k_off_checked: true})
    };

    render() {
        const filterDeleted = (site, pos) => {
            const filters = this.state.site_filters.filter(x => !(x.site === site && x.pos === pos));
            this.setState({site_filters: filters})
        };
        const addPosFilter = () => {

            const filters = this.state.site_filters;
            const item = {
                site: this.state.selected_site,
                pos: this.state.selected_pos,
                value: this.state.selected_pos_value
            };
            filters.push(item);
            this.setState({site_filters: filters});
        };
        if (this.state.redirect) {

            return <Redirect push to={this.state.search}/>;

        }
        return (<span>

            {/*<LineChart data={data} options={options} width="600" height="250" />*/}

                <InputGroup>

                <SearchText value={this.state.text} navigate={this.navigate} inputUpdated={this.inputUpdated}/>
                <InputGroup.Button>
                    <Link to={this.state.search}><Button> Search</Button></Link>
                    <Button id="advancedSearchBtn" onClick={this.toogleAdvanced} bsStyle="link">Advanced Search</Button>
                </InputGroup.Button>
            </InputGroup>

                {this.state.advanced && <Grid>
                    <Row>
                        <Col xs={9}>
                            <InputGroup>
                                <InputGroup.Addon>{this.state.kon_start.toExponential(2)}</InputGroup.Addon>

                                <div className="form-control">
                                    <Range allowCross={false} step={1} defaultValue={[4, 9]} min={4} max={9}
                                           onChange={this.changeKon}/>
                                </div>
                                <InputGroup.Addon>{this.state.kon_end.toExponential(2)}</InputGroup.Addon>
                                <InputGroup.Addon>Kon range[ M<sup>−1</sup>s<sup>−1</sup>]</InputGroup.Addon>
                                <InputGroup.Addon> <input
                                    name="P50"
                                    type="checkbox"
                                    checked={this.state.k_on_checked}
                                    onChange={(event) => this.setState({k_on_checked: event.target.checked})}/></InputGroup.Addon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={9}>
                            <InputGroup>
                                <InputGroup.Addon>{this.state.koff_start.toExponential(2)}</InputGroup.Addon>

                                <div className="form-control">
                                    <Range allowCross={false} step={1} defaultValue={[-5, 0]} min={-5} max={0}
                                           onChange={this.changeKoff}/>
                                </div>
                                <InputGroup.Addon>{this.state.koff_end.toExponential(2)}</InputGroup.Addon>
                                <InputGroup.Addon>Koff range[s<sup>−1</sup>]</InputGroup.Addon>
                                <InputGroup.Addon> <input
                                    name="Koff"
                                    type="checkbox"
                                    checked={this.state.k_off_checked}
                                    onChange={(event) => this.setState({k_off_checked: event.target.checked})}/></InputGroup.Addon>
                            </InputGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={9}>
                            <InputGroup>
                                <InputGroup.Addon>{this.state.p50_min && this.state.p50_min && this.state.p50_min.toFixed(4)}</InputGroup.Addon>

                                <div className="form-control">
                                    <Range allowCross={false} step={0.0001}
                                           defaultValue={[this.state.p50_min, this.state.p50_max]} min={-3} max={3.3}
                                           onChange={(x) => this.setState({
                                               p50_min: Math.pow(10, x[0]),
                                               p50_max: Math.pow(10, x[1]),
                                               p50_checked: true
                                           })}/>
                                </div>
                                <InputGroup.Addon>{this.state.p50_max && this.state.p50_max.toFixed(4)}</InputGroup.Addon>
                                <InputGroup.Addon>P50 range </InputGroup.Addon>
                                <InputGroup.Addon> <input
                                    name="P50"
                                    type="checkbox"
                                    checked={this.state.p50_checked}
                                    onChange={(event) => this.setState({p50_checked: event.target.checked})}/></InputGroup.Addon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={9}>
                            <b> Groups: </b>

                            P <input
                            name="g_p"
                            type="checkbox"
                            checked={this.state.g_p}
                            onChange={(event) => this.setState({g_p: event.target.checked})}/>
                            &#160;&#160;&#160;
                            N <input
                            name="g_n"
                            type="checkbox"
                            checked={this.state.g_n}
                            onChange={(event) => this.setState({g_n: event.target.checked})}/>
                            &#160;&#160;&#160;
                            O <input
                            name="g_o"
                            type="checkbox"
                            checked={this.state.g_o}
                            onChange={(event) => this.setState({g_o: event.target.checked})}/>
                            &#160;&#160;&#160;
                            Q <input
                            name="g_q"
                            type="checkbox"
                            checked={this.state.g_q}
                            onChange={(event) => this.setState({g_q: event.target.checked})}/>
                            &#160;&#160;&#160;
                            X <input
                            name="g_x"
                            type="checkbox"
                            checked={this.state.g_x}
                            onChange={(event) => this.setState({g_x: event.target.checked})}/>
                            <br/>
                            Only with Structure <input
                            name="with_structure"
                            type="checkbox"
                            checked={this.state.only_struct}
                            onChange={(event) => this.setState({only_struct: event.target.checked})}/>
                            <br/>
                            Only with experimental data <input
                            name="with_exp"
                            type="checkbox"
                            checked={this.state.with_exp}
                            onChange={(event) => this.setState({with_exp: event.target.checked})}/>
                            <br/>
                            Search also in non curated data <input
                            name="noncurated"
                            type="checkbox"
                            checked={this.state.noncurated}
                            onChange={(event) => this.setState({noncurated: event.target.checked})}/>

                        </Col>
                    </Row>
                    <Row><Col xs={9}>
                        <br/>
                        <p>Site Filter:</p>
                        <Table striped bordered condensed hover>
                            <thead>
                            <tr>
                                <th>Site</th>
                                <th>Position</th>
                                <th>Value</th>
                                <th>-</th>
                            </tr>
                            <tr>
                                <td><Select onChange={x => this.setState({selected_site: x, selected_pos: sites[x][0]})}
                                            value={this.state.selected_site}
                                            options={Object.keys(sites).map(x => {
                                                return {value: x, label: x}
                                            })}/></td>
                                <td><Select
                                    onChange={x => this.setState({selected_pos: x})}
                                    value={this.state.selected_pos}
                                    options={sites[this.state.selected_site].map(x => {
                                        return {value: x, label: x}
                                    })}/></td>
                                <td>

                                    <FormControl onKeyDown={(event) => (event.keyCode === 13) ? addPosFilter() : null}
                                                 type="text" value={this.state.selected_pos_value}
                                                 onChange={(evt) => {
                                                     this.setState({selected_pos_value: evt.target.value})
                                                 }}/>


                                </td>
                                <td><Button onClick={addPosFilter}>Add Filter</Button></td>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.keys(this.state.site_filters).map((x, i) => <PosSelect
                                onDelete={filterDeleted}
                                key={i} {...this.state.site_filters[x]} />)}
                            </tbody>
                        </Table>
                    </Col></Row>
                </Grid>
                }

        </span>
        )
    }
}

export default SearchBox;
