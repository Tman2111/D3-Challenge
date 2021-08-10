// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG wrapper
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // append SVG group
  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Param
var chosenXAxis = "age";

// function to update x-scale var when click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function to update xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}


// circles update move to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "age") {
    label = "Age:";
  }
  else {
    label = "Income:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

  (async function(){
    var censusData = await d3.csv("assets/data/data.csv").catch(err => console.log(err))

    // Parse data
    censusData.forEach(function(data) {
      data.id = +data.id;
      data.poverty = +data.poverty;
      data.povertyMoe = +data.povertyMoe;
      data.age = +data.age;
      data.ageMoe = +data.ageMoe;
      data.income = +data.income;
      data.incomeMoe = +data.incomeMoe;
      data.healthcare = +data.healthcare;
      data.healthcareLow = +data.healthcareLow;
      data.healthcareHigh = +data.healthcareHigh;
      data.obesity = +data.obesity;
      data.obesityLow = +data.obesityLow;
      data.obesityHigh = +data.obesityHigh;
      data.smokes = +data.smokes;
      data.smokesLow = +data.smokesLow;
      data.smokesHigh = +data.smokesHigh;
    });

    //console.log(censusData);

  })()
    // console.log(chosenXAxis)
 

// xLinearScale function above csv import
var xLinearScale = xScale(censusData, chosenXAxis);

// Create y scale function
var yLinearScale = d3.scaleLinear()
.domain([0, d3.max(censusData, d => d.income)])
.range([height, 0]);

// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append x and y axis
var xAxis = chartGroup.append("g")
.classed("x-axis", true)
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

chartGroup.append("g")
.call(leftAxis);




