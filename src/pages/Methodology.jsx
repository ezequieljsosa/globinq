import React from 'react';
import {  Grid, Row, Col } from 'react-bootstrap';
const Methodology = ( props ) => (
    <Grid>
        <Row>
            <Col md={12}>
                <h1>Analysis pipeline</h1>

                <h3>Data resources and identification oftrHbs sequences.</h3>
                <p>
                    Our starting sequence set was comprised by the 111 cases assigned by Vuletich and Lecomte to N, O and P trHbs groups plus ca. 200 additional sequences derived and manually checked from the Pfam and PDB data- bases. Separate HMMER profiles were built for each trHb group (N, O and P) by means of hmmbuild using default settings (HMMER Version 3.0). The complete Uniprot database was then subsequently screened by hmmsearch using the three built profiles and default settings in order to acquire all possible available trHbs sequences. All sequences identified by the matrices with a full sequence E-value smaller than the HMMER exclusion threshold were considered as trHbs. Redundant sequences were dis- carded by means of CD-Hit using 90% identity as upper threshold.</p>
                <h3>Multiple Sequence Alignment (MSA)</h3>
                <p>
                Multiple protein sequence alignments of all considered sequences were made using the Promals3D program with default settings and including structural information considering the following seventeen PDBs which corresponds to IDs: 2BKM, 1UX8, 3AQ5, 2BMM, 1NGK, 3AQ9, 1DLY, 1UVX, 2HZ2, 1S69, 1MWB, 1IDR, 2KSC, 2XYK, 2GKN, 1DLW, 2IG3. The inclusion of X-ray structures enhances the quality of the MSA by considering key properties of the fold. The MSA was subsequently manually optimized using Jalview 2.8. Finally, a total of1107 sequences were identified as trHbs.
                </p>
                <h3>Phylogenetic analysis</h3>
                <p>
                 Since the 1107 sequences have divergent regions and specially the  terminals due to different evolutionary histories, the MSA contains blocks of poorly aligned subsequences. These were removed by Block Mapping and Gathering with Entropy (BMGE), which permits selection of parts ofthe alignment that are suitable for proper phylogenetic inference. Trimming for phylogeny was performed with Blosum62, gap frequency at 0.2 and entropy at 0.9 resulting in a trim from 356 to 143 columns. The trimmed MSA was used to build Maximum likelihood (ML) and Bayesian phylogenies, using PhyML 3.0 and MrBayes 3, respectively. Specifically, PhyML analyses were conducted upon selection oft he model using ProtTest  selecting the WAG model, estimated proportion of invariable sites, four rate categories, estimated gamma distribution parameter, and optimized starting BIONJ tree, with SH-aLRT branch support measures. Bayesian analysis were initiated with the ML-trees using 10 perturbations. Convergence was checked by using Awty. The resulting phylogenetic trees were viewed and edited with iTol v2.2.2 and Inkscape
                </p>

                <p>For more detailed methodology description see <a href="http://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1004701">Evolutionary and Functional Relationships in the Truncated Hemoglobin Family</a> <b>Materials and Methods</b> section.
                </p>
            </Col>
        </Row>
        <Row>
            <Col md={12}>
                <h1>Database Overview</h1>
                <p>
                    All the data generated in the previous section (phylogenetic tree, msa, important sites annotations, experimental and predicted kon/koff and PDB alignments)  was assembled into a relational database, using the following schema:
                    <img src="schema_source.png" />

                </p>


            </Col>
        </Row>
        <Row>
            <Col md={12}>
                <h1>Implementation</h1>
                <p>
                    GlobinQ has 3 main components: a Mysql database, a backend python web application using pybottle
                    framework, and a frontend application using React.


                    Frontend visualization uses the following JS libraries:
                    <ul>
                        <li><a href="https://cdn.rawgit.com/calipho-sib/feature-viewer/v1.0.0/examples/index.html">NextProt Feature Viewer</a></li>
                        <li><a href="http://msa.biojs.net/">MSAViewer</a></li>
                        <li><a href="http://phylocanvas.org/">Phylocanvas</a></li>
                        <li><a href="http://webglmol.osdn.jp/index-en.html">GLMol</a></li>
                    </ul>

                    Its source code is in (SOON...) Github repository.
                </p>
            </Col>
        </Row>

    </Grid>
)


export default Methodology;
