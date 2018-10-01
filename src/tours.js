import Tour from "bootstrap-tour";

function tour_globin(){
    var tour = new Tour({
        storage: false,
        steps: [
            {
                element: "#searchTxt",
                title: "Search",
                placement: "top",
                content: "Main keyword search"
            },
            {
                element: "#advancedSearchBtn",
                title: "More options",
                content: "Click on advanced search for a more complete query",
                placement: "top",
                reflex: true
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
    tour_stats: tour_stats
}