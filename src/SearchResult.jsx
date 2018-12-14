import React from 'react';

import { Grid, Row, Col } from 'react-bootstrap';

import GlobinTable from "./components/GlobinTable.jsx"

class SearchResult extends React.Component {

    state = { "globin": null }
    

    selectedGlobin = ( globin ) =>  {
        this.setState( { "globin": globin });
    }

    render() {
        const sep =  ( this.props.url.indexOf("?") == -1 )  ? "?"  : "&"  ;
        return (
            <Grid>

                <Row>
                    <Col md={12}>
                        Download list as <a id="dowloadLink" href={this.props.url + sep + "download=csv"}>csv</a> | <a href={this.props.url + sep + "download=fasta"}>fasta</a>
                        <GlobinTable base={this.props.base} 
                        globins={this.props.globins}
                        />
                    </Col>
                </Row>

            </Grid>
        );
    }
}
SearchResult.defaultProps = {
    toGlobin: () => null
}

export default SearchResult;
