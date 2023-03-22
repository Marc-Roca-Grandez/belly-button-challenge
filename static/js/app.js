// Get the samples endpoint
const samples = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(samples).then(function(data) {
  console.log(data);
});

// Fill data id availables
function startmenu() {
  // Use D3 to select the dropdown menu
  let dropdownMenu = d3.select("#selDataset");
  // Fetch the JSON data and append values to dropdownMenu
  d3.json(samples).then(function(data) {
    // Set a variable for the sample names
    let names = data.names;
    // Add  samples to dropdown menu
    names.forEach((id) => {
        // Log the value of id for each iteration of the loop
        console.log(id);
        dropdownMenu.append("option").text(id).property("value",id);
    });


    //Set default Values
    let default_id = names[0];
    graphtoputs(default_id);
    demo_info(default_id)
  });
}


// Fill data id bar graph
function graphtoputs(id) {

  // Fetch the JSON data and append values to dropdownMenu
  d3.json(samples).then(function(data) {

    // filter sample values by id, they are all of the ids
    var samples = data.samples.filter(result => result.id == id)[0];

    // Values that will go on graph
    // filter values
    let sample_values = samples.sample_values ;
    let otu_ids = samples.otu_ids;
    let otu_labels = samples.otu_labels;
    // filter sample values by top 10 id, they are all the most popular
    let sample_values_top = sample_values.slice(0,10).reverse();
    let otu_ids_top = otu_ids.slice(0,10).map(id=> 'OTU'+id).reverse();
    let otu_labels_top = otu_labels.slice(0,10).reverse();

    // Bar graph
    // Set up the trace for the bar chart
    let trace = {
      y: otu_ids_top,
      x: sample_values_top,
      text: otu_labels_top,
      type: "bar",
      orientation: "h"
  };
  // Setup the layout
  let layout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {t: 30 , l: 150}
  };

  // Call Plotly to plot the bar chart
  Plotly.newPlot("bar", [trace], layout)

  //Bubble
  let tracebubble = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: "Earth"
    }
  };

// Setup the layout
let layoutbubble = {
    title: "Bacteria Cultures Per Sample",
    xaxis: {title: "OTU ID"},
    height: 500,
    width: 800
};

// Call Plotly to plot the bar chart
Plotly.newPlot("bubble", [tracebubble], layoutbubble)

  });
}

// Fill data id for demo_info

function demo_info(id) {

  d3.json(samples).then((data)=> {
      let x = data.metadata.filter(result => result.id == id)[0];
      d3.select("#sample-metadata").html("");

      Object.entries(x).forEach(([key,value]) => {
          d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
      });
  });
};


//function to change outputs per id
function  optionChanged(id) {
  graphtoputs(id)
  demo_info(id)
};

startmenu()
