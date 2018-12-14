import React from 'react';

import { Table } from 'react-bootstrap';

import {
    Link
} from 'react-router-dom'

const GlobinRow = ( {base,id,name,pdbs,group,organism,exp,calc} ) => {
    const pdbs_list = [];
    pdbs.forEach( x => {
        if ( pdbs_list.indexOf( x ) === -1 ) {
            pdbs_list.push( x )
        }
    });

    return <tr>
        <td><Link to={ base + "protein/" + id}> {name}</Link> </td>
        <td>{organism}</td>
        <td>{group}</td>


        <td dangerouslySetInnerHTML={{ __html:exp}}></td>
        <td dangerouslySetInnerHTML={{ __html:calc}}></td>

        <td style={{ 'max-width': '200px' }}>
            {pdbs_list.map(( pdb, i ) =>
                <a key={i} href={'http://www.rcsb.org/pdb/explore/explore.do?structureId=' + pdb}  > {pdb} <img alt="link to pdb page" src="external.gif" /> </a>

            )}
        </td>
    </tr>
};

const GlobinTable = ( {base,globins, toGlobin}) => (
    <Table striped bordered condensed hover>
        <thead>
            <tr>
                <th id="globinNameCell">Name</th>
                <th>Organism</th>
                <th>Group</th>

                <th width={150}>Experimental Values</th>
                <th>Theoretical Value</th>
                <th>PDB/s</th>
            </tr>
        </thead>
        <tbody>

            {globins.map( (g,i) => <GlobinRow key={i} base={base} id={g.id} group={g.group} name={g.name} organism={g.organism}
                pdbs={g.pdbs} exp={g.exp} calc={g.calc} />
            )}

        </tbody>
    </Table>
);
export default GlobinTable;