import React from 'react';

import Phylocanvas from 'phylocanvas';

import metadata from 'phylocanvas-plugin-metadata';

Phylocanvas.plugin(metadata);


/*
const tree = Phylocanvas.createTree('root', {
metadata: {
  active: true,
  showHeaders: true,
  showLabels: true,
  blockLength: 32,
  blockSize: null,
  padding: 8,
  columns: [],
  propertyName: 'data',
  underlineHeaders: true,
  headerAngle: 90,
  fillStyle: 'black',
  strokeStyle: 'black',
  lineWidth: 1,
  font: null,
}
})

tree.on('loaded', function () {
// add metadata to leaves
for (const leaf of tree.leaves) {
  leaf.data = {
    columnA: 'value',
    columnB: true,
    columnC: 10,
  };
}
tree.viewMetadataColumns();
tree.draw();
});
*/

const groupColors = {'O': "#0056e2", 'N': "#27aa00", '?': "black", 'X': "brown", 'P': "#ff7200", 'Q': "#ffdd00"};
const groupRoots = {'O': "pcn1102", 'N': "pcn258", 'P': "pcn555", 'Q': "pcn599"};

function collapse(branch) {
    if (branch.children.length > 0) {
        let hasHit = false;
        const childsToClose = [];
        for (var i = 0; i < branch.children.length; i++) {
            const child = branch.children[i];
            if (collapse(child)) {
                hasHit = true;
            } else {
                childsToClose.push(child)
            }
        }
        if (hasHit) {
            childsToClose.forEach(x => {
                x.pruned = true;
            });
        }
        return hasHit;
    } else {
        return !branch.pruned;
    }
}

function findBranch(branch,name) {
    if (branch.children.length > 0) {

        if(branch.id == name){
            return branch
        } else {
            for (var i = 0; i < branch.children.length; i++) {
                const r = findBranch(branch.children[i],name)
                if (r != null){
                    return r;
                }
            }
        }
    }
    return null;

}



class GlobinTree extends React.Component {

    constructor(props) {
        super(props)
        this.selectedBranch = null;
    }

    componentDidMount() {

        const me = this;

        /*m.g.on("row:click", data => {
            //const name = m.seqs.at(data.seqId).attributes.name;
            //console.log(name);        

            const branch = me.tree.branches[data.seqId + "__"];

            if (this.selectedBranch != null) {
                this.selectedBranch.selected = false;
                this.selectedBranch.highlighted = false;

                this.selectedBranch.setDisplay(this.defStyle)

            } else {
                this.defStyle = {
                    colour: branch.tree.branchColour,
                    shape: branch.nodeShape,
                    size: branch.radius,
                    leafStyle: branch.leafStyle,
                    labelStyle: branch.labelStyle
                }
            }


            this.selectedBranch = branch;
            branch.selected = true;
            branch.highlighted = true;

            branch.cascadeFlag('selected', true);
            branch.setDisplay({
                    colour: 'red',
                    shape: 'circle', // or square, triangle, star
                    size: 3, // ratio of the base node size
                    leafStyle: {
                        strokeStyle: 'red', //'#0000ff',
                        fillStyle: 'red', // 'rgb(0, 255, 0)',
                        lineWidth: 2,
                    },
                    labelStyle: {
                        colour: 'black',
                        textSize: 20, // points
                        font: 'Arial',
                        format: 'bold',
                    },
                }
            );


            me.tree.draw()

            ;
        });*/


        fetch('tree.newick')
            .then(function (response) {
                return response.text();
            }).then(function (text) {

            fetch('generated/tree_data.json')
                .then(function (response) {
                    return response.json();
                }).then(function (tree_data) {


                const tree = Phylocanvas.createTree(me.props.id, {
                    multiSelect: false,
                    disableZoom: false,
                    textSize: 30
                });
                //tree.setTreeType('rectangular');
                tree.alignLabels = true;
                const group_leaves = [];
                tree.on('beforeFirstDraw', function () {
                    tree.textSize = 24 //tree.textSize - 2
                    for (var i = 0; i < tree.leaves.length; i++) {

                        const leave_data = tree_data[tree.leaves[i].id];
                        tree.leaves[i].label = leave_data.organism;
                        if (me.props.group != leave_data.g) {
                            tree.leaves[i].pruned = true
                        } else {
                            group_leaves.push(tree.leaves[i])
                        }
                        tree.leaves[i].data = {
                            column1: {
                                colour: groupColors[leave_data.g]
                                //label: leave_data.g,
                            },
                            column2: {
                                colour: (leave_data.e) ? "violet" : "white"
                                //label: (leave_data.e) ? "Exp" : null,
                            },
                            column3: {
                                colour: (leave_data.s > 0) ? "red" : "white"
                                //label:  (leave_data.s > 0) ? "PDB" : "",
                            }


                        };
                    }
                });


                tree.on('click', e => {
                    const node = tree.getNodeAtMousePosition(e);
                    if (node) {
                        console.log(node.id)
                    }
                });

                tree.load(text);
                collapse(tree.root);

                tree.setTreeType('rectangular');
                const b =findBranch(tree.root,groupRoots[me.props.group])
                b .redrawTreeFromBranch();


                me.tree = tree;
            });
        });
    }

    render() {
        return <div id={this.props.id}></div>;
    }
}


export default GlobinTree;
