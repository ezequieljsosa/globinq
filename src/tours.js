import Tour from "bootstrap-tour";
import $ from 'jquery';


function hideTourNext(tour) {
    setTimeout(function () {
        $('div.popover-navigation > div > button:nth-child(2)').hide();
        $('div.popover-navigation > button').hide();

    }, 500);
}

function hideTourEnd(tour) {
    setTimeout(function () {
        $('div.popover-navigation > button').hide();

    }, 500);
}

function tour_globin() {
    var tour = new Tour({
        storage: false,
        steps: [
            {
                element: ".jumbotron",
                title: "Simple Search",
                placement: "top",
                content: "In this tutorial we will search globins by keyword, select one and explore its properties.",
                onShown: hideTourEnd
            },
            {
                element: "#searchTxt",
                title: "Main keyword search",
                placement: "left",
                content: "Now we will search Mycobacterium tuberculosis TrHb. Write 'tuberculosis' and click 'Next' to continue",
                onShown: function (tour) {
                    hideTourNext();

                    $("#searchTxt").keyup(() => {
                        if ("tuberculosis" === $("#searchTxt").val()) {
                            $('div.popover-navigation > div > button:nth-child(2)').show();
                        }
                    });

                }
            },
            {
                element: "#searchBtn",
                title: "Start search",
                content: "Click 'Search' button",
                placement: "top",
                reflex: true,
                onShown: hideTourNext
            }
            , {
                element: "#loadingImg",
                title: "Getting the results...",
                content: "<b>WAIT</b> until the data appears and click 'Next'",
                placement: "top",
                orphan: true,
                onShown: hideTourEnd
            }
            , {
                element: "#globinNameCell",
                title: "Search result",
                content: "In this table we can see the search results, with the following information: name, organism, group, experimental and theoretical values and if there is an PDB structure from an homologous sequence.",
                placement: "left",
                orphan: true,
                onShown: hideTourEnd
            }
            , {
                element: "#dowloadLink",
                title: "Download",
                content: "Query results can be downloaded in csv or fasta formats",
                placement: "bottom",
                onShown: hideTourEnd
            }
            , {
                element: "a[href='/protein/359']",
                title: "Cp-trHbO",
                content: "The first result, has no experimental values, nor PDB structure",
                placement: "left",
                onShown: hideTourEnd
            }
            , {
                element: "a[href='/protein/922']",
                title: "Mt-trHbN",
                content: "The second has experimental data asociated with the wild type sequences and 5 other mutants. Click on 'Mt-trHbN' to continue",
                placement: "left",
                reflex: true,
                onShown: hideTourNext
            }
            , {
                element: "#loadingImg",
                title: "Getting the results...",
                content: "<b>WAIT</b> until the data appears and click 'Next'",
                placement: "top",
                orphan: true,
                onShown: hideTourEnd
            }, {
                element: "#globinRecord",
                title: "Overview",
                content: "In this table we can see the globins main properties, and its Uniprot identifier",
                placement: "left",
                onShown: hideTourEnd
            }
            , {
                element: "#activeSiteSeq",
                title: "Active site",
                content: "Here we see the sequence of the active site, composed by alignment positions \"B10\", \"CD1\", \"E7\", \"E11\" and \"G8\". By clicking in the magnifying glass icon you can search other globins with similar aminoacids.",
                placement: "left",
                onShown: hideTourEnd

            }
            , {
                element: "#e7tableRow",
                title: "Tunnels",
                content: "This table describes the tunnel composition, their predicted openness and energetic barrier contribution. Same as before, by clicking the magnifying glass icon, you can look for globins with similar tunnel composition",
                placement: "left",
                onShown: hideTourEnd

            }
            , {
                element: "#div_id4",
                title: "Annotation",
                content: "This panel shows the globin sequence and highlights the important sites from the curated MSA",
                placement: "left",
                onShown: hideTourEnd

            }
            , {
                element: "#msaDiv",
                title: "MSA with structures",
                content: "When there are PDB structures from homologous sequences available, this msa is shown. The first entry is the current globin sequence and the rest its alignment with the pdb chain sequence",
                placement: "left",
                onShown: hideTourEnd

            }
            , {
                element: "#structureSelect",
                title: "Structure select",
                content: "When there is more than one PDB to choose, this control will appear to select the desired one.",
                placement: "left",
                onShown: hideTourEnd

            }
            , {
                element: "#glmol02",
                title: "3D Structure",
                content: "Using GLMol, the first chan from the PDB structure can be viewed.",
                placement: "left",
                onShown: hideTourEnd

            }
            , {
                element: "input[name='siteCheckSTG8_G8']",
                title: "Highlight Pos",
                content: "This simple interface allows to see the important residues positions in the structure. Click the G8 checkbox to view the aminoacid.",
                placement: "right",
                reflex: true,
                onShown: hideTourNext
            }
            , {
                element: "#glmol02",
                title: "Residue Label",
                content: "Now we can see the label Val 94 from the G8 Site.",
                placement: "left",
                onShown: hideTourEnd

            }
            , {
                element: "#div_id4",
                title: "Highlight Alignment",
                content: "Finally, by selecting a site in the sequence annotation panel, the site is scrolled in the MSA and structure. Click on the last site - H9  and then 'Next' to continue.",
                placement: "top",
                onShown: hideTourEnd

            }
            , {
                element: "#msaDiv",
                title: "Scrolled position",
                content: "With out previous action, now we can see tha the alignment position 272 is selected.",
                placement: "left",
                onShown: hideTourEnd

            }
            , {
                element: "#siteCheckSTG8_H9",
                title: "3D Structure Site",
                content: "And was also marked in the structure.",
                placement: "left",
                onShown: hideTourEnd

            }
            , {
                element: "#globinRecord",
                title: "End",
                content: "In this mini tutorial we saw how to query by keyword and explored a globin's available information.",
                placement: "left"

            }


        ]
    });

    tour.init();
    tour.start();
}

function tour_stats() {
    const tour = new Tour({
        storage: false,
        steps: [
            {
                element: "a[href='/global']",
                title: "Start stats tutorial",
                placement: "bottom",
                content: "In this tutorial we will have a brief tour about the database resources. Press 'Data' to continue.",
                reflex: true,
                onShown: hideTourNext //
            }, {
                element: "a[href='/global']",
                title: "Data",
                placement: "bottom",
                content: "We will start by exploring the core resources: the curated trHb multiple sequence alignment (MSA) " +
                "and its phylogic tree. <b>WAIT</b> until the data appears and press 'Next' to continue.",
                onShown: hideTourEnd
            }, {
                element: "#msaDiv",
                title: "Data",
                placement: "left",
                content: "The MSA construction is explained in xxx. In it, we can visualize all 1106 trHbs and their reference organism in the first column, and all the positions in the following ones. The vertical scroll is used to visualize the different proteins and the horizontal to view the positions. Press 'Next' to continue.",
                onShown: hideTourEnd
            }, {
                element: "#msaDiv",
                title: "Data",
                placement: "left",
                content: "Also, in the upper part, we can see the profile logo. Here we navigate to the position 271, which corresponds to the site H9 from the chanels STG8 and LT. We will review this in the abundance graph later. Click 'Next' to continue.",
                onShown: function (tour) {
                    hideTourEnd();
                    const m = $("#msaDiv").data();
                    const pos = 271;
                    const sel = new ColumnSelection({xStart: pos, xEnd: pos});
                    m.g.selcol.add(sel)
                    m.g.zoomer.setLeftOffset((pos - 25) > 0 ? (pos - 25) : 0)

                }
            }, {
                element: "#legend",
                title: "Data",
                placement: "left",
                content: "This tree build from the previous MSA (also explained in xxx), shows the trHbs phylogenetic relationships in an radial layout. The labels are shown in its leafs and in different colors and layers we can see its Group and if there is experimental data or PDB structure available. Zoom is handled with the mouse wheel and navigation by dragging the tree with the left mouse button. Press 'Next' to continue.",
                onShown: hideTourEnd
            }, {
                element: "a[href='/statistics']",
                title: "Abundance",
                placement: "bottom",
                content: "Now we will navigate the site stats page.",
                reflex: true,
                onShown: hideTourNext
            }, {
                element: "a[href='/statistics']",
                title: "Abundance",
                placement: "bottom",
                content: "We have one chart per Site per Group, 16 in total, showing the specific aminoacid distribution." +
                " <b>WAIT</b> until the data appears and press 'Next'.",
                onShown: hideTourEnd
            }, {
                element: "#chartP_e7",
                title: "Abundance",
                placement: "right",
                content: "For example, this chart shows the average aminoacid composition for Group P, " +
                "in E7G site for positions B10, CD1, E7 and E11. When you move the mouse over the rings of the circle, " +
                "the site subsequence and its abundance in the database is shown. In this case, " +
                "Y aa is the most abundant in B10, F in CD1, L in E7 and E11 is more variable. Check this fact and press" +
                " 'Next' to continue ",
                onShown: hideTourEnd
            }, {
                element: "#chartO_lt",
                title: "Abundance",
                placement: "left",
                content: "This chart shows the average aminoacid composition for Group O, " +
                "in LT. The site's sequence is less conserved as you can see much more combinations. " +
                "Check this fact and press 'Next' to continue ",
                onShown: hideTourEnd
            }, {
                element: "a[href='/downloads']",
                title: "Downloads",
                placement: "bottom",
                content: "Finally, we will navigate the Downloads page. Press 'Downloads' to continue.",
                reflex: true,
                onShown: hideTourNext
            }, {
                element: "a[href='/downloads']",
                title: "Downloads",
                placement: "bottom",
                content: "In this page you can download the MSA in fasta format, all the TrHbs fasta file, the phylogenetic tree in newick format and the sql database (its complete schema is shown in the Methodology tab). Press 'Next' to continue.",
                onShown: hideTourEnd
            }, {
                element: "a[href='/tree.newick']",
                title: "Downloads",
                placement: "right",
                content: "In this brief tutorial we saw how to navigate the stats and where to download the resources from the page if you want to use them in your own research."

            },
        ]
    });

    tour.init();
    tour.start();
}

function tour_blast() {
    const search_seq = "MGISRLLSSLGLALLLSACASAPRAGLY\n" +
        "EQFGGRPGIEALVEELLVRVLEDERIAA\n" +
        "QFAEVDLVNLNDRLVEQICAEVGGPCEY\n" +
        "TGRTMAESHEGLAITEADFNALVEDLVA\n" +
        "AMDARGIPRRAQNRLLARLAPMHRDIVSP";
    const tour = new Tour({
        storage: false,
        steps: [
            {
                element: "#blast_caption",
                title: "Blast Search",
                placement: "left",
                content: "In this tutorial we will perform a blast search in the database and observe its results. Press 'Next' to continue.",
                onShown: hideTourEnd
            }, {
                element: "#blast_textarea",
                title: "Set search sequence",
                placement: "top",
                content: 'Copy this sequence in the textbox: ' + search_seq,
                onShown: function (tour) {
                    hideTourNext();

                    $("#blast_textarea").keyup(() => {
                        const txt = ($("#blast_textarea").val().trim().replace(new RegExp('\n', 'g'), '').replace(new RegExp(' ', 'g'), ''));
                        const search_seq2 = (search_seq.trim().replace(new RegExp('\n', 'g'), '').replace(new RegExp(' ', 'g'), ''));
                        if (search_seq2 === txt) {
                            $('div.popover-navigation > div > button:nth-child(2)').show();
                        }
                    });

                }
            }, {
                element: "#blast_btn",
                title: "Start blast process",
                placement: "left",
                content: "Press 'Blast' button to continue.",
                reflex: true,
                onShown: hideTourNext
            }, {
                element: "#loadingImg",
                title: "Processing...",
                content: "<b>WAIT</b> until the data appears and click 'Next'",
                placement: "top",
                orphan: true,
                onShown: hideTourEnd
            },

            {
                element: "#tree",
                title: "Results Overview",
                content: "In this tree you can see the matching database entries. Zoom is handled with the mouse wheel and navigation by dragging the tree with the left mouse button. Go zoom until you are able to read the text and navigate to the top-right part of the tree. There, you should be able to see the 4 column names next to the tree leafs: group, experimental, structure and has_hit. This last column indicates if our query has a hit in that globin. In our case, we can see that the first 2 leafs do not have one, but the branch that follows has many. Click 'Next' to continue.",
                placement: "right",
                onShown: hideTourEnd
            }, {
                element: "#globin_hit_table",
                title: "Results",
                content: "This table lists all the database hits, showing a link to the protein, the organism, the group, alignment identity, coverage (from our query), experimental value from the hit, predicted data, and if the entry has a pdb available.  Click 'Next' to continue.",
                placement: "top",
                onShown: hideTourEnd
            }, {
                element: "#aln_button_4",
                title: "Alignment",
                content: "Click this button to visualize the alignment.",
                placement: "top",
                reflex: true,
                onShown: hideTourNext
            }, {
                element: "#aln_button_4",
                title: "Processing...",
                content: "<b>WAIT</b> until the data appears and click 'Next'",
                placement: "top",
                orphan: true,
                onShown: hideTourEnd
            }, {
                element: "#close_aln_btn",
                title: "Alignment",
                content: "Here we can visualize the alignment and download it by clicking the 'Download'. Click 'Close' to continue.",
                placement: "bottom",
                reflex: true,
                onShown: hideTourNext
            }, {
                element: "a[href='/protein/204']",
                title: "Explore",
                content: "Finally, you can explore the matched proteins. Click on the link to navigate to the globin page.",
                placement: "bottom",
                reflex: true,
                onShown: hideTourNext
            }, {
                element: "#globinRecord",
                title: "End",
                content: "In this tutorial we did a blast search on the database and visit the visualization options.",
                placement: "left",
                orphan: true
            }


        ]
    });
    tour.init();
    tour.start();
}

function tour_upload() {
    const search_seq = "MGISRLLSSLGLALLLSACASAPRAGLY\n" +
        "EQFGGRPGIEALVEELLVRVLEDERIAA\n" +
        "QFAEVDLVNLNDRLVEQICAEVGGPCEY\n" +
        "TGRTMAESHEGLAITEADFNALVEDLVA\n" +
        "AMDARGIPRRAQNRLLARLAPMHRDIVSP";
    const tour = new Tour({
        storage: false,
        steps: [
            {
                element: "a[href='/upload']",
                title: "Upload",
                placement: "bottom",
                content: "In this tutorial we will perform a blast search in the database and observe its results. Press 'Upload My Globin' to continue.",
                reflex: true,
                onShown: hideTourNext
            },{
                element: "a[href='/upload']",
                title: "Processing...",
                content: "<b>WAIT</b> until the data appears and click 'Next'",
                placement: "bottom",
                orphan: true,
                onShown: hideTourEnd
            }, {
                element: "#taxonomy_drop",
                title: "Upload Data",
                placement: "right",
                content: "Select the taxa from the globin sequence in the autocomplete field. Press 'Next' when finished.",
                onShown: hideTourEnd
            },
            {
                element: "#uniprot",
                title: "Upload Data",
                placement: "left",
                content: "Optional Uniprot code. Press 'Next' to continue.",
                onShown: hideTourEnd
            },{
                element: "#sequence",
                title: "Upload Data",
                placement: "left",
                content: 'Copy this sequence in the textbox: ' + search_seq,
                onShown: function () {
                    hideTourNext();

                    $("#sequence").keyup(() => {
                        const txt = ($("#sequence").val().trim().replace(new RegExp('\n', 'g'), '').replace(new RegExp(' ', 'g'), ''));
                        const search_seq2 = (search_seq.trim().replace(new RegExp('\n', 'g'), '').replace(new RegExp(' ', 'g'), ''));
                        if (search_seq2 === txt) {
                            $('div.popover-navigation > div > button:nth-child(2)').show();
                        }
                    });

                }
            },{
                element: "#p50",
                title: "Upload Data",
                placement: "left",
                content: "In this section you can add experimental or predicted kon/koff and p50 values. You can complete the fields or leave them empty .Press 'Next' when finished.",
                onShown: hideTourEnd
            },{
                element: "#add_exp_data_btn",
                title: "Upload Data",
                placement: "left",
                content: "If you have data from mutant sequences, you can add them here. Press 'Add experimental Data'",
                reflex:true,
                onShown: hideTourNext
            },{
                element: "#name_1",
                title: "Upload Data",
                placement: "left",
                content: "Here you can name your mutant/variant, and complete as many as you have. Same as before, this fields are optional, and you don't need to fill them to continue with this tutorial. Press 'Next' when finished.",
                onShown: hideTourEnd
            },{
                element: "#upload_globin_btn",
                title: "Upload Data",
                placement: "left",
                content: "Now lets finally upload our protein. Press 'Upload Globin' to continue.",
                reflex:true,
                onShown: hideTourNext
            },{
                element: "a[href='/upload']",
                title: "Processing...",
                content: "<b>WAIT</b> until the globin page is loaded, it may take up to a minute. Then click 'Next'",
                placement: "bottom",
                orphan: true,
                onShown: hideTourEnd
            },{
                element: "#globinRecord",
                title: "Processed sequence",
                placement: "left",
                content: "This is the entry for your globin. Let's check the last rows. Click 'Next' to continue",
                onShown: hideTourEnd
            },{
                element: "#curated_tr",
                backdrop : true,
                title: "Processed sequence",
                placement: "left",
                content: "This field indicates that the entry does not belong to the curated database. Click 'Next' to continue",
                onShown: hideTourEnd
            },{
                element: "#closest_curated_tr",
                backdrop : true,
                title: "Processed sequence",
                placement: "left",
                content: "Here we see the closest curated globin (using an alignment criteria). The important positions from the entry are transfered from that aligment. Click 'Next' to continue",
                onShown: hideTourEnd
            },{
                element: "#owner_tr",
                backdrop : true,
                title: "Processed sequence",
                placement: "left",
                content: "Your data, in case someone wants to contact you. Let's check the last rows. Click 'Next' to continue",
                onShown: hideTourEnd
            },{
                element: "#div_id4",
                backdrop : true,
                title: "Processed sequence",
                placement: "left",
                content: "In this panel you can see the important alignment sites position in your sequence, by moving the over the rectangles. For example B10 corresponds to position 25 in your sequence. Verify this and click 'Next' to continue",
                onShown: hideTourEnd
            },{
                element: "#msapdb",
                backdrop : true,
                title: "Processed sequence",
                placement: "left",
                content: "In this case, because the closest globin (Bs-trHbO) has an associated structure, we can transfer that information to this protein (Yp-trHbO) . Click 'Next' to continue",
                onShown: hideTourEnd
            },{
                element: "#globinRecord",
                title: "Finish",
                placement: "left",
                content: "In this tutorial we saw how to upload a new trHb and interpret its results. " +
                "We hope you can process your sequences, obtain useful processed information and help us complete the database.",
                onShown: hideTourEnd
            }

        ]
    });
    tour.init();
    tour.start();
}

import {Model} from 'backbone-thin'

const ColumnSelection = Model.extend({


    inRow: function () {
        return true;
    },
    inColumn: function (rowPos) {
        return this.xStart <= rowPos && rowPos <= this.xEnd;
    },
    getLength: function () {
        return this.xEnd - this.xStart;
    }
});


module.exports = {
    tour_globin: tour_globin,
    tour_stats: tour_stats,
    tour_blast: tour_blast,
    tour_upload: tour_upload,

}
