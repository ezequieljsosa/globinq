import React from 'react';

import {Table, Tooltip, OverlayTrigger, Glyphicon, Button} from 'react-bootstrap';

import {
    Link
} from 'react-router-dom'


const ExpStr = ({exp}) => <span>
    <b>{exp.name}</b><br />
    {exp.koff && <span>koff = {exp.koff.toExponential(2)} s<sup>-1</sup><br /></span>}
    {exp.kon && <span> kon = {exp.kon.toExponential(2)} M<sup>−1</sup>s<sup>−1</sup></span>}
    <br/>
</span>
const ExpsStr = ({exps}) => {

    return <div>{exps.map((exp, i) => <ExpStr exp={exp} key={i}/>)}</div>
}

const GlobinRecord = (props) => {

    const tooltip = (
        <Tooltip id="tooltip">List Organism Globins</Tooltip>
    );


    const pdbs_list = [];
    props.pdbs.forEach(x => {
        if (pdbs_list.indexOf(x) === -1) {
            pdbs_list.push(x)
        }
    })


    return <Table id="globinRecord" striped bordered condensed hover>

        <thead>
        <tr>
            <td colSpan={3}>
                <table>
                    <tr>
                        <td>
                            <h1>{props.name}</h1></td>

                    </tr>
                </table>
            </td>
        </tr>
        </thead>
        <tbody>

        {props.uniprot &&
        <tr>
            <td><b>Uniprot</b></td>
            <td colSpan={2}><a href={"http://www.uniprot.org/uniprot/" + props.uniprot}>{props.uniprot} <img
                alt="go to uniprot page" src={props.base + "external.gif"}/> </a></td>

        </tr>
        }
        <tr>
            <td>Organism-Strain</td>
            <td>{props.organism}
            </td>
            <td>
                <OverlayTrigger placement="left" overlay={tooltip}>
                    <Link to={props.base + "search?org=" + props.tax}><Button> <Glyphicon glyph="search"/></Button>
                    </Link>

                </OverlayTrigger>
            </td>
        </tr>
        <tr>
            <td>trHb group</td>
            <td>{props.group}
            </td>
            <td>
                {false &&
                <Link to={props.base + "search?group=" + props.group}><Button> <Glyphicon glyph="search"/></Button>
                </Link>
                }
            </td>
        </tr>
        {(props.pdbs.length > 0) &&
        <tr>
            <td>PDB</td>
            <td colSpan={2}>
                {pdbs_list.map((pdb, i) =>
                    <a key={i} href={'http://www.rcsb.org/pdb/explore/explore.do?structureId=' + pdb.pdb}> {pdb.pdb}
                        <img alt="go to pdb page" src={props.base + "external.gif"}/> </a>
                )}
            </td>
        </tr>
        }
        {props.experimental &&
        <tr>
            <td>Experimental Values</td>
            <td colSpan={2}>

                <ExpsStr exps={props.experimental}/>


            </td>

        </tr>}
        {props.calculated &&
        <tr>
            <td>Theoretical Values</td>
            <td colSpan={2}>
                <b>WT</b><br />
                {props.calculated.koff && <span>koff = {props.calculated.koff.toExponential(2)} s<sup>-1</sup><br /></span>}
                {props.calculated.kon &&
                    <span> kon = {props.calculated.kon.toExponential(2)} M<sup>−1</sup>s<sup>−1</sup><br /></span>}
                {props.p50 && <span> p50 = {props.p50.toExponential(2)}</span>}

            </td>

        </tr>
        }

        <tr id="curated_tr">
            <td>Curated in alignment</td>
            <td colSpan={2}>
                { (props.owner) ? 'No' : 'Yes'}
            </td>

        </tr>

        {props.closest_curated &&
        <tr id="closest_curated_tr">
            <td>Closest curated</td>
            <td colSpan={2}>
                <a href={props.base + "protein/" + props.closest_curated.id}> {props.closest_curated.name} </a>
            </td>

        </tr>
        }
        {props.owner &&
        <tr id="owner_tr">
            <td>Uploaded By</td>
            <td colSpan={2}>
                {props.owner}
            </td>

        </tr>
        }
        {props.institution &&
        <tr>
            <td>Institution</td>
            <td colSpan={2}>
                {props.institution}
            </td>

        </tr>
        }
        </tbody>
    </Table>

};
export default GlobinRecord;
