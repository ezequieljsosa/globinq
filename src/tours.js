import Tour from "bootstrap-tour";
import $ from 'jquery';

function hideTourNext(tour) {
    setTimeout(function() {
        $('div.popover-navigation > div > button:nth-child(2)').hide();
        $('div.popover-navigation > button').hide();

    }, 500);
}
function hideTourEnd(tour) {
    setTimeout(function() {
        $('div.popover-navigation > button').hide();

    }, 500);
}

function tour_globin(){
    var tour = new Tour({
        storage: false,
        steps: [
            {
                element:".jumbotron",
                title: "Simple Search",
                placement: "top",
                content: "In this tutorial we will search globins by keyword, select one and explore its properties.",
                onShown:hideTourEnd
            },
            {
                element: "#searchTxt",
                title: "Main keyword search",
                placement: "left",
                content: "Now we will search Mycobacterium tuberculosis TrHb. Write 'tuberculosis' and click 'Next' to continue",
                onShown: function (tour) {
                    hideTourNext();

                    $("#searchTxt").keyup( () => {
                        if("tuberculosis" ===  $("#searchTxt").val()){
                            $('div.popover-navigation > div > button:nth-child(2)').show();
                        }
                    } );

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
            ,{
                element: "#loadingImg",
                title: "Getting the results...",
                content: "<b>WAIT</b> until the data appears and click 'Next'",
                placement: "top",
                orphan:true,
                onShown:hideTourEnd
            }
            ,{
                element: "#globinNameCell",
                title: "Search result",
                content: "In this table we can see the search results, with the following information: name, organism, group, experimental and theoretical values and if there is an PDB structure from an homologous sequence.",
                placement: "left",
                orphan:true,
                onShown:hideTourEnd
            }
            ,{
                element: "#dowloadLink",
                title: "Download",
                content: "Query results can be downloaded in csv or fasta formats",
                placement: "bottom",
                onShown:hideTourEnd
            }
            ,{
                element: "a[href='/protein/359']",
                title: "Cp-trHbO",
                content: "The first result, has no experimental values, nor PDB structure",
                placement: "left",
                onShown:hideTourEnd
            }
            ,{
                element: "a[href='/protein/922']",
                title: "Mt-trHbN",
                content: "The second has experimental data asociated with the wild type sequences and 5 other mutants. Click on 'Mt-trHbN' to continue",
                placement: "left",
                reflex: true,
                onShown:hideTourNext
            }
            ,{
                element: "#loadingImg",
                title: "Getting the results...",
                content: "<b>WAIT</b> until the data appears and click 'Next'",
                placement: "top",
                orphan:true,
                onShown:hideTourEnd
            } ,{
                element: "#globinRecord",
                title: "Overview",
                content: "In this table we can see the globins main properties, and its Uniprot identifier",
                placement: "left",
                onShown:hideTourEnd
            }
            ,{
                element: "#activeSiteSeq",
                title: "Active site",
                content: "Here we see the sequence of the active site, composed by alignment positions \"B10\", \"CD1\", \"E7\", \"E11\" and \"G8\". By clicking in the magnifying glass icon you can search other globins with similar aminoacids.",
                placement: "left",
                onShown:hideTourEnd

            }
            ,{
                element: "#e7tableRow",
                title: "Tunnels",
                content: "This table describes the tunnel composition, their predicted openness and energetic barrier contribution. Same as before, by clicking the magnifying glass icon, you can look for globins with similar tunnel composition",
                placement: "left",
                onShown:hideTourEnd

            }
            ,{
                element: "#div_id4",
                title: "Annotation",
                content: "This panel shows the globin sequence and highlights the important sites from the curated MSA",
                placement: "left",
                onShown:hideTourEnd

            }
            ,{
                element: "#msaDiv",
                title: "MSA with structures",
                content: "When there are PDB structures from homologous sequences available, this msa is shown. The first entry is the current globin sequence and the rest its alignment with the pdb chain sequence",
                placement: "left",
                onShown:hideTourEnd

            }
            ,{
                element: "#structureSelect",
                title: "Structure select",
                content: "When there is more than one PDB to choose, this control will appear to select the desired one.",
                placement: "left",
                onShown:hideTourEnd

            }
            ,{
                element: "#glmol02",
                title: "3D Structure",
                content: "Using GLMol, the first chan from the PDB structure can be viewed.",
                placement: "left",
                onShown:hideTourEnd

            }
            ,{
                element: "input[name='siteCheckSTG8_G8']",
                title: "Highlight Pos",
                content: "This simple interface allows to see the important residues positions in the structure. Click the G8 checkbox to view the aminoacid.",
                placement: "right",
                reflex: true,
                onShown: hideTourNext
            }
            ,{
                element: "#glmol02",
                title: "Residue Label",
                content: "Now we can see the label Val 94 from the G8 Site.",
                placement: "left",
                onShown:hideTourEnd

            }
            ,{
                element: "#div_id4",
                title: "Highlight Alignment",
                content: "Finally, by selecting a site in the sequence annotation panel, the site is scrolled in the MSA and structure. Click on the last site - H9  and then 'Next' to continue.",
                placement: "top",
                onShown:hideTourEnd

            }
            ,{
                element: "#msaDiv",
                title: "Scrolled position",
                content: "With out previous action, now we can see tha the alignment position 272 is selected.",
                placement: "left",
                onShown:hideTourEnd

            }
            ,{
                element: "#siteCheckSTG8_H9",
                title: "3D Structure Site",
                content: "And was also marked in the structure.",
                placement: "left",
                onShown:hideTourEnd

            }
            ,{
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

function tour_stats(){

}

function tour_blast(){

}

function tour_upload(){

}

module.exports = {
    tour_globin: tour_globin,
    tour_stats: tour_stats,
    tour_blast: tour_blast,
    tour_upload: tour_upload,

}