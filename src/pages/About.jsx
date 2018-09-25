import React from 'react';
import {  Grid, Row, Col } from 'react-bootstrap';
const About = ( props ) => (
        <Grid>
        <Row>
            <Col md={12}>

                <img src="logoiquibicen.svg" />

                <h2>Authors:</h2>
         <ul>
            <li>Sosa, Ezequiel </li>
            <li>Boechi, Leonardo</li>
            <li>Bustamante, Juan Pablo</li>
            <li>Martí, Marcelo</li>
        </ul>

                <h2>Related publications:</h2>

        <ul>
            <li><a href="http://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1004701">Evolutionary and Functional Relationships in the Truncated Hemoglobin Family</a></li>
            <li><a href="https://academic.oup.com/bioinformatics/article/32/12/1805/1744225">A quantitative model for oxygen uptake and release in a family of hemeproteins</a></li>
        </ul>
            </Col></Row></Grid>
)


export default About;
