import React from 'react';

import {Grid, Row, Col} from 'react-bootstrap';

import GlobinHitTable from "./components/GlobinHitTable.jsx"
import Phylocanvas from 'phylocanvas'
import metadata from "phylocanvas-plugin-metadata";


const groupColors = {'O': "#0056e2", 'N': "#27aa00", '?': "black", 'X': "brown", 'P': "#ff7200", 'Q': "#ffdd00"};

Phylocanvas.plugin(metadata);

class BlastResult extends React.Component {

    state = {"globin": null}


    selectedGlobin = (globin) => {
        this.setState({"globin": globin});
    }

    componentDidMount() {
        const blastedGlobins = []
        this.props.globins.forEach(g => {
            const x = Object.keys(g.alignment).filter(x => !x.startsWith("query"))[0].split(" ")[0];
            blastedGlobins.push(x);
        });
        const me = this;
        fetch('tree.newick')
            .then(function (response) {
                return response.text();
            }).then(function (text) {


            fetch('generated/tree_data.json')
                .then(function (response) {
                    return response.json();
                }).then(function (tree_data) {

                const tree = Phylocanvas.createTree('tree', {multiSelect: false, disableZoom: false, textSize: 30});

                tree.on('click', e => {
                    const node = tree.getNodeAtMousePosition(e);
                    if (node) {
                        node.toggleCollapsed();
                        node.cascadeFlag('highlighted', false);
                        tree.draw();
                    }
                });

                tree.on('beforeFirstDraw', function () {

                    tree.textSize = 24 //tree.textSize - 2
                    for (var i = 0; i < tree.leaves.length; i++) {
                        const label_id = tree.leaves[i].id;
                        const leave_data = tree_data[label_id];

                        const hit_idx = blastedGlobins.indexOf(label_id.replace(/_/g, ""));
                        const has_hit = (hit_idx === -1) ? "white" : "black";

                        tree.leaves[i].label = leave_data.organism;
                        tree.leaves[i].data = {
                            group: {
                                colour: groupColors[leave_data.g]
                                //label: leave_data.g,
                            },
                            experimental: {
                                colour: (leave_data.e) ? "violet" : "white"
                                //label: (leave_data.e) ? "Exp" : null,
                            },
                            structure: {
                                colour: (leave_data.s > 0) ? "red" : "white"
                                //label:  (leave_data.s > 0) ? "PDB" : "",
                            },
                            has_hit: {
                                colour: has_hit
                            }


                        };
                    }
                });



                tree.alignLabels = true;
                tree.load(text);
                tree.setTreeType('rectangular');

                me.tree = tree;
                me.tree.draw()
            });
        });
    }

    render() {

        return (
            <Grid>

                <Row>
                    <Col md={12}>
                        {(this.props.globins.length > 0) && <div id="tree"></div>}
                    </Col>
                    <Col md={12}>
                        <GlobinHitTable base={this.props.base}
                                        globins={this.props.globins}
                        />
                    </Col>
                </Row>

            </Grid>
        );
    }
}


export default BlastResult;
