/**
 * Helper function to select biodiversity data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * names
 *   metadata
 *      index 0 - id
 *      index 1 - ethnicity
 *      index 2 - gender
 *      index 3 - age
 *      index 4 - location
 *      index 5 - bbtype
 *      index 6 - wfreq
 *   samples
 *      index 0 - id
 *      index 1 - otuids
 *      index 2 - sample_values
 *      index 3 - otu_labels
 */

// Initiate a global variable of `data`
var data;

// Provide a link to the location of the dataset
var link = "samples.json";

// This function generates the necessary data to display the sample metadata for the individual
// selected in the dropdown (idChoice)
function demoInfo(idChoice) {
  d3.json(link).then(data => {
    var filterDemo1 = data.metadata.filter(metaIDs => metaIDs.id == idChoice);

    var metaFill = d3.select("#sample-metadata");
    metaFill.html("");
    metaFill.append("p").text(`Subject ID #   : ${filterDemo1[0].id}`);
    metaFill.append("p").text(`Ethnicity      : ${filterDemo1[0].ethnicity}`);
    metaFill.append("p").text(`Gender (M/F)   : ${filterDemo1[0].gender}`);
    metaFill.append("p").text(`Age in Years   : ${filterDemo1[0].age}`);
    metaFill.append("p").text(`Home City/State: ${filterDemo1[0].location}`);
    metaFill.append("p").text(`Innie or Outtie: ${filterDemo1[0].bbtype}`);
    metaFill.append("p").text(`Washes / Week  : ${filterDemo1[0].wfreq}`);
  });
};

// function to return the list of OUID information.
function ouidExtract(name) {
    var ouidList = [];
    for (var i = 0; i < name.length; i++) {
        ouidList.push(`OTU ${name[i]}`);
    }
    return ouidList;
};

// function to return the name of the bacteria. if an array value has more than one name, it will use the last name as the value
// return just the first 10 values of the result
function bacteriaName(name) {
    var listOfBact = [];

    for (var i = 0; i < name.length; i++) {
    var stringName = name[i].toString();
    var splitValue = stringName.split(";");
    if (splitValue.length > 1) {
        listOfBact.push(splitValue[splitValue.length - 1]);
    } else {
        listOfBact.push(splitValue[0]);}
    }
    return listOfBact;
};

// This section generates the necessary horizontal bar chart to display the top 10 OTUs found in the individual
// selected in the dropdown (idChoice)
function sampleCharts(idChoice) {
  d3.json(link).then(data => {
    var filterID1 = data.samples.filter(bactIDs => bactIDs.id == idChoice);
    var filterID = filterID1[0]
    var ouid = filterID.otu_ids;
    var ouidSlice = filterID.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var seqRead = filterID.sample_values;
    var seqReadSlice = filterID.sample_values.slice(0, 10).reverse();
    var bacteriaName = filterID.otu_labels;
    var bacteriaSlice = filterID.otu_labels.slice(0, 10).reverse();

    var trace1 = {
        x: seqReadSlice,
        y: ouidSlice,
        text: bacteriaSlice,
        type: "bar",
        orientation: "h"
    };

    var data = [trace1];

    var layout = {
      title: "Top Ten Bacterias Found",
      xaxis: { title: "Count of Sequences Read"},
      yaxis: { title: "OTU ID"}
    };

    Plotly.newPlot("bar", data, layout);

    // This section generates the necessary bubble chart to display each sample for the individual
    // selected in the dropdown (idChoice)
    var trace2 = {
      x: ouid,
      y: seqRead,
      mode: "markers",
      marker: {
          color: ouid,
          size: seqRead
      },
      text: bacteriaName
    };
    
    var data2 = [trace2];
    
    var layout2 = {
      title: 'Bacteria Frequency of Sequences Read per Subject',
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    
    Plotly.newPlot("bubble", data2, layout2);
  });
};

// This function generates a gauge to plot the weekly washing frequency of the individual
// selected in the dropdown (idChoice)
function gaugePlot(idChoice) {
  d3.json(link).then(data => {
    var filterID1 = data.metadata.filter(metaIDs => metaIDs.id == idChoice);
    var washWeek = filterID1[0].wfreq;

    var gaugeData = [
      {
      type: "indicator",
      mode: "gauge",
      value: washWeek,
      title: { text: "Navel Wash Frequency<br>Scrubs per Week", font: { size: 24 } },
      gauge: {
          axis: { range: [1, 10],
              tickvals: [0,1,2,3,4,5,6,7,8,9,10],
              tickwidth: 1, 
              ticks: "outside",
              tickcolor: "darkblue"
              },
          bar: { color: "darkblue" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "#B3B3B3",
          steps: [
              { range: [0, 1],  color: "#007676" },
              { range: [1, 2],  color: "#00B3B3" },
              { range: [2, 3],  color: "#00CCCC" },
              { range: [3, 4],  color: "#00E6E6" },
              { range: [4, 5],  color: "#00FFFF" },
              { range: [5, 6],  color: "#00E6E6" },
              { range: [6, 7],  color: "#1AFFFF" },
              { range: [7, 8],  color: "#33FFFF" },
              { range: [8, 9],  color: "#4DFFFF" },
              { range: [9, 10], color: "#76FFFF" }
          ],
          threshold: {
              line: { color: "red", width: 7 },
              thickness: 0.75,
              value: washWeek
          }
        }
      }
    ];

    var gaugeLayout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      font: { color: "darkblue", family: "Arial" }
    };
    
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  })
};

// Fetch the JSON data and console log it
function jsonLoad(sample) {
  // reference to the dropdown
  var selOpts = d3.select("#selDataset");

  // Use the D3 library to read in `samples.json`.
  d3.json(link).then(data => {
    var selVals = data.names;
    
    // Use the first available sample from the list as the initial plot variable upon load
    selVals.forEach((sample) => {
      selOpts
        .append("option")
        .text(sample)
        .property("value", sample); 
    });
    var firstID = selVals[0];
      demoInfo(firstID);
      sampleCharts(firstID);
      gaugePlot(firstID);
  })
};

// This function is called when a dropdown menu item is selected
function optionChanged(idChoice) {
  // Prevent the page from refreshing
  // d3.event.preventDefault();
  demoInfo(idChoice);
  sampleCharts(idChoice);
  gaugePlot(idChoice);
};

// Call jsonLoad to initialize the dashboard
jsonLoad();
