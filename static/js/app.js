const url = "samples.json"


// Fetch the JSON data and console log it
d3.json(url).then(function (data) {
    data = data[0]
    console.log(data);
});

// Promise Pending
const dataPromise = d3.json(url);
//console.log("Data Promise: ", dataPromise);

dataPromise.then(function (data) {
    data = data[0];
    var ids = data.names;
    var dropDown = d3.select("#selDataset");
    //console.log(ids);

    for (var i = 0; i < ids.length; i++) {
        dropDown.append("option").text(ids[i]);
    };
});


// On change to the DOM, call buildBar()
d3.selectAll("#selDataset").on("change", buildBar);


function buildBar() {
    dataPromise.then(function (data) {
        //get the json data into arrays
        data = data[0];
        var ids = data.names;
        var samples = data.samples;
        var metadata = data.metadata;

        //Select the dropdown box and the value
        var dropDown = d3.select("#selDataset");
        var dataset = dropDown.property("value");

        //filter the sample values by the id selectd
        var result_array = samples.filter(sample => sample.id === dataset);

        //grab the associated otu_ids, otu_label, and sample_values
        var otu_id = result_array[0].otu_ids;
        var otu_label = result_array[0].otu_labels;
        var sample_values = result_array[0].sample_values;

        //Demographic info where the id equals the selected value
        var demogrphic_array = metadata.filter(mdata => mdata.id === +dataset);
        var id = demogrphic_array[0].id;
        var ethnicity = demogrphic_array[0].ethnicity;
        var gender = demogrphic_array[0].gender;
        var age = demogrphic_array[0].age;
        var location = demogrphic_array[0].location;
        var bbtype = demogrphic_array[0].bbtype;
        var wfreq = demogrphic_array[0].wfreq;

        //Add the demographic info to the HTML
        var div = d3.select("#sample-metadata");
        div.html(`ID: ${id} <br>
        Ethnicity: ${ethnicity} <br> 
        Gender: ${gender} <br> 
        Age: ${age} <br> 
        Location: ${location} <br> 
        bbtype: ${bbtype} <br> 
        wfreq: ${wfreq}`
        );



        //Limit the data to the top 10 bacterias by ID
        var x = sample_values.slice(0, 10).reverse();
        var ytick = otu_id.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

        //Create the trace for the bar graph
        var trace1 = {
            y: ytick,
            x: x,
            text: otu_label,
            type: "bar",
            orientation: "h"
        };

        //Create the layout for the bar graph
        var barLayout = {
            title: `Top 10 OTUs in ID ${dataset}`,
            xaxis: { title: "Number of Microbes" },
            margin: { t: 30, l: 150 }
        };

        //put the trace into an array
        barData = [trace1];

        //Create bar plot
        Plotly.newPlot("bar", barData, barLayout);

        //Create trace for bubble plot
        var trace2 = {
            x: otu_id,
            y: sample_values,
            text: otu_label,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_id,
                colorscale: "Earth"
            }
        };

        //assign trace to an array
        bubbleData = [trace2];

        //create the layout for the bubble chart
        var bubbleLayout = {
            title: `Microbe Distribution for ID ${dataset}`,
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Number of Microbes" },
            margin: { t: 200 },
            height: 800,
            width: 1200
        };

        //Create the bubble plot
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
        var trace3 = {
            "domain": { "x": [0, .48] },
            "marker": {
                "colors": [
                    'rgb(255, 255, 255)',
                    'rgb(255, 255, 255)',
                    'rgb(255, 255, 255)',
                    'rgb(255, 255, 255)',
                    'rgb(255, 255, 255)',
                    'rgb(255, 255, 255)',
                    'rgb(255, 255, 255)'
                ],
                "line": {
                    "width": 1
                }
            },
            "name": "Gauge",
            "hole": .4,
            "type": "pie",
            "direction": "clockwise",
            "rotation": 108,
            "showlegend": false,
            "hoverinfo": "none",
            "textinfo": "label",
            "textposition": "outside"
        };


        var trace4 = {
            "values": [50, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9],
            "labels": [" ",
                "0-1",
                "1-2",
                "2-3",
                "3-4",
                "4-5",
                "5-6",
                "6-7",
                "7-8",
                "8-9"
            ],
            "marker": {
                'colors': ['white',"Earth"
                ]
            },
            "domain": { "x": [0, .48] },
            "name": "Wash Frequency",
            "hole": .3,
            "type": "pie",
            "direction": "clockwise",
            "rotation": 90,
            "showlegend": false,
            "textinfo": "label",
            "textposition": "inside",
            // "hoverinfo": "none"
        };

        var trace5 ={
            type: 'scatter',
            x:[0],
            y:[0],
            marker: {
              size: 14,
              color:'850000'
            },
            showlegend: false
        };

        var gaugelayout = {
            'xaxis': {
                'showticklabels': false,
                'showgrid': false,
                'zeroline': false,
            },
            'yaxis': {
                'showticklabels': false,
                'showgrid': false,
                'zeroline': false,
            },
            'shapes': [
                {
                    'type': 'path',
                    'path': 'M 0.235 0.5 L 0.24 0.65 L 0.245 0.5 Z',
                    'fillcolor': 'rgba(44, 160, 101, 0.5)',
                    'line': {
                        'width': 0.5
                    },
                    'xref': 'paper',
                    'yref': 'paper'
                }
            ],
            // 'annotations': [
            //     {
            //         'xref': 'paper',
            //         'yref': 'paper',
            //         'x': 0.23,
            //         'y': 0.45,
            //         'text': '',
            //         'showarrow': false
            //     }
            // ],
            height: 600,
            width: 600, 
            title :{
                text: "Belly Button Washing Frequency",
                position: "top left"}
            };
        trace3['marker']['line']['width'] = 0

        var gaugeData = [trace3, trace4, trace5];
        Plotly.newPlot("gauge", gaugeData, gaugelayout);

    });

};

//Run the function with the first value in the dropdown
buildBar();