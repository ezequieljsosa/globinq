import React from 'react';

import { Jumbotron,    Button, Grid, Row, Col } from 'react-bootstrap';

import SearchBox from "./components/SearchBox.jsx"
import { Redirect } from 'react-router';


/*
const SearchBox = ( props ) => (
    <div>
        <h2>{props.title}</h2>
        <FormGroup>
            <InputGroup>
                <FormControl name="search" type="text" />
                <InputGroup.Button>
                    <Button onClick={() => props.toList()} >Search</Button>
                </InputGroup.Button>
            </InputGroup>
        </FormGroup>
    </div>
);
*/

class Search extends React.Component {

    state = {value:"",blast_seq:"",blastResult:0}
    
    constructor(props){
        super(props)
        this.textInput = {value:""}
    }
    
    blast = () => {
        const me = this;
        fetch(`http://${this.props.ip}:${this.props.port}${this.props.baseApi}blast`,
                {
                    method: "POST",
                    body: JSON.stringify({'sequence':this.state.blast_seq})
                })
                .then(function(res){ return res.json(); })
                .then(function(data){ 
                    
                    me.setState({'blastResult':data.id})
                })
    }
    
    render() {
        if( this.state.blastResult.length > 10){
            return <Redirect push to={this.props.base + "blast?bid=" + this.state.blastResult  } />;
        }
    
        return (
            <div>
                <Grid>
                    <Row>
                        <Col md={12}>
                            <Jumbotron>
                                <h1>GlobinQ</h1>
                                <p>An interactive and integrative site for globin sequence, phylogenetic, structural and functional queries relationships.
</p>
                                <p>

                                    <SearchBox base={this.props.base} />
                                </p>
                            </Jumbotron>

                        </Col>
                    </Row>
                </Grid>
                <Grid>

                    <Row>

                        <Col md={12}>

                            <h2 id="blast_caption">Blast Search </h2>
                            <textarea id="blast_textarea" onChange={(event) => this.setState({blast_seq:event.target.value})} style={{ width: "100%" }} rows="5">{this.blast_seq}</textarea>
                            <Button id="blast_btn" onClick={this.blast} >Blast</Button>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Search;
