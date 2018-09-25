import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import SequenceAbundance from '../components/SequenceAbundance.jsx'
import GlobinTree from '../components/GlobinTree.jsx'




class Statistics extends React.Component {


    render( props ) {
        const globin_groups = ["P", "N", "O", "Q"]

        const sites = {
            "lt":  ["B2", "E11", "E15", "G8", "H5", "H9"],
            "e7": ["B10", "CD1", "E7", "E11"],
            "g8": ["G8", "G9", "H9"],
            "sa": ["B10", "CD1", "E7", "E11", "G8"]
        }
        const site_names = { "lt": 'long tunnel', "e7": 'E7G', "g8": 'STG8', "sa": 'active site' }

        return <Grid>
            <Row>
                <Col md={12}>
                    <h1> Some statistics about trHbs groups for tunnels and active site aminoacids</h1>
                </Col>
                {globin_groups.map( gg => Object.keys( sites ).map( site =>
                    <Col md={6}>
                        <br />
                        <br />
                        <br />
                        {/*<GlobinTree id={"tree" + gg + site} group={gg} />*/}
                        <h3>Group <b>{gg}</b>  <b>{site_names[site]}</b> sequence abundances</h3>

                        <SequenceAbundance key={gg + site} group={gg} site={site} positions={sites[site]} />

                    </Col>
                ) )}
            </Row>
            <Row><Col>Original Widget http://bl.ocks.org/kerryrodden/7090426</Col></Row>
        </Grid>
    }
}


export default Statistics;
