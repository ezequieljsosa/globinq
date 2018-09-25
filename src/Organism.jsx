import React from 'react';

import {  Grid, Row, Col } from 'react-bootstrap';

import GlobinTable from "./components/GlobinTable.jsx"


class Organism extends React.Component {

    render() {

        return (

            <Grid>

                <Row>
                    <Col md={12}>
                        <h1>Globin List</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <GlobinTable toGlobin={this.props.toGlobin} />
                    </Col>
                </Row>

            </Grid>

        );
    }
}
Organism.defaultProps = {
    toGlobin: () => null
}

export default Organism;
