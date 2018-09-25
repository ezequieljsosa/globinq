import React from 'react';
import {  Grid, Row, Col } from 'react-bootstrap';
const Downloads = ( {apiUrl} ) => (
        <Grid>
        <Row>
            <Col md={12}>

        <ul>
            <li><a href={process.env.PUBLIC_URL + "/MSA.fasta"}>  Multiple alignment </a></li>
            <li><a href={apiUrl + "search?download=fasta"}> Sequences Fasta </a></li>

            <li><a href={process.env.PUBLIC_URL + "/tree.newick"}> Phylogenic Tree</a></li>
            <li><a href={process.env.PUBLIC_URL + "/dump.sql.gz"}>  Sql Database </a></li>

        </ul>

            </Col></Row></Grid>
)


export default Downloads;
