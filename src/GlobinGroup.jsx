import React from 'react';

import {  Grid, Row, Col} from 'react-bootstrap';


import GlobinTree from "./components/GlobinTree.jsx"
import GlobinRecord from './components/GlobinRecord.jsx'




class GlobinGroup extends React.Component {

    render() {

        return (
            <Grid>

                <Row>
                    <Col md={9}>
                <h1>trHb Group O</h1>
                        <GlobinTree toGlobin={this.props.toGlobin} toList={this.props.toList} />   </Col>
                <Col md={3}>
                <GlobinRecord toGlobin={this.props.toGlobin}
                toList={this.props.toList}
                name="Mt-trHbO" group="O" organism="Tuberculosis" pdbs={["1xx2"]} exp="-" calc="kon = 8, koff= 36" />
                </Col>
                </Row>
                

            </Grid>



        );
    }
}
GlobinGroup.defaultProps = {
    toGlobin: () => null
}

export default GlobinGroup;
