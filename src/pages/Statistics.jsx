import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

import SequenceAbundance from '../components/SequenceAbundance.jsx'
import GlobinTree from '../components/GlobinTree.jsx'

//Original Widget http://bl.ocks.org/kerryrodden/7090426


class Statistics extends React.Component {


    render() {
        const globin_groups = ["N", "O", "P", "Q"];

        const sites = {
            "sa": ["B10", "CD1", "E7", "E11", "G8"],
            "lt": ["B2", "E11", "E15", "G8", "H5", "H9"],
            "e7": ["B10", "CD1", "E7", "E11"],
            "g8": ["G8", "G9", "H9"],

        };
        const site_names = {"lt": 'long tunnel', "e7": 'E7G', "g8": 'Short Tunnel G8', "sa": 'active site'}

        return <Grid>
            <Row>
                <Col md={12}>
                    <h1> Some interactive statistics about trHbs groups for active site and tunnels amino acids </h1>
                </Col>
                {globin_groups.map(gg => Object.keys(sites).map(site =>
                    <Col md={6}>
                        <br/>
                        <br/>
                        <br/>
                        {/*<GlobinTree id={"tree" + gg + site} group={gg} />*/}
                        <h3>Group <b>{gg}</b> <b>{site_names[site]}</b> sequence abundances</h3>

                        <SequenceAbundance key={gg + site} group={gg} site={site} positions={sites[site]}/>

                    </Col>
                ))}
            </Row>

        </Grid>
    }
}


export default Statistics;
