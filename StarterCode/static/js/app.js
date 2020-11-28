// Dropdown
function init() {

    var location = d3.select("#selDataset");
    name = []

    d3.json("samples.json").then((sampleNames) => {
        
        var name= sampleNames.names
        name.forEach((sample) => {
            location
                .append("option")
                .text(sample)
                .property("value", sample);
        });
        charts(name[0])
        metadata(name[0])
    });
}


// Chart prep
function charts(sampleid) {
    d3.json("samples.json").then((importedData) => {
        console.log(importedData);
        var data = importedData;
        var sampleresult = data.samples.filter(Object => Object.id == sampleid)[0]

        var otu_ids = sampleresult.otu_ids
        var otu_labels = sampleresult.otu_labels
        var sample_values = sampleresult.sample_values


        // Bar Chart
        var bartrace = {
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(otuId => "OTU" + otuId).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };

        var barlayout = {
            title: "Top 10 Bacterias",
            xaxis: {title: "Values"},
            yaxis: {title: "Bacteria ID"}
        };

        Plotly.newPlot("bar", [bartrace], barlayout);


        // Bubble Chart
        var bubbletrace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids
            }
        };

        var bubblelayout = {
            title: "Bacteria Cultures",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Value"}
        }

        Plotly.newPlot("bubble", [bubbletrace], bubblelayout);
    });
}
// MetaData
function metadata(sampleid) {
    d3.json("samples.json").then(function (metaData) {
        console.log(metaData);
        var datas = metaData;

        var result = datas.metadata.filter(Object => Object.id == sampleid)[0]
        var table = d3.select("#sample-metadata")

        table.html("")
        Object.entries(result).forEach(([key, value]) => {
            table.append("h6").text(key + ":" + value)
        })
    });    
}


// Reset
function optionChanged(newSample) {
    charts(newSample);
    metadata(newSample);
}


init();