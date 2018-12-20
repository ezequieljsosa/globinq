import React from 'react';
import {  Grid, Row, Col } from 'react-bootstrap';




const Tutorial = ( {user}  ) => (
        <Grid>
        <Row>
            <Col md={12}>

                <a href="/?tour=1"> <h3> How to find known information for a given globin</h3></a>
                <a href="/?tour=2"> <h3> DB resources description </h3></a>
                <a href="/?tour=3"> <h3> Perform a blast search in the curated alignment </h3></a>
                {user ?
                    <a href="/?tour=4"> <h3> How to find key structural residues of a new sequenced globin and predict its possible functional properties </h3></a>
                    :
                    <div><h3 disabled="disabled"> How to find key structural residues of a new sequenced globin and predict its possible functional properties </h3> -> you must be registered and logged to do this tutorial. <a href="/register">Register</a> or &nbsp;

                        <a href="/login">Login</a> and come back. </div>

                }





        
        </Col></Row></Grid>
)


export default Tutorial;
