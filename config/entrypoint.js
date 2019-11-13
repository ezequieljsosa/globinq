import 'bootstrap/dist/css/bootstrap.css';
import "msa/css/msa.css";


import Phylocanvas from 'phylocanvas';
import $ from 'jquery';
import Fasta from 'biojs-io-fasta';

import msa from "msa";
import metadata from 'phylocanvas-plugin-metadata';
Phylocanvas.plugin(metadata);

window.$ = $;
window.msa = msa;
window.Phylocanvas = Phylocanvas;
window.Fasta = Fasta;



