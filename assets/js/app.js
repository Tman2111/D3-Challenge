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
var chosenXAxis = "smokes";
var chosenYAxis = "age";

// function to update x-scale variable when click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
    d3.max(censusData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}

// function to update xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function to update YAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}


// circles update move to new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// Update Circle Text group, transition to new circle
function renderXCircleText(textCircles, newXScale, chosenXAxis) {

  textCircles.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]));

  return textCircles;
}

function renderYCircleText(textCircles, newYScale, chosenYAxis) {

  textCircles.transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosenYAxis])+4);

  return textCircles;
}

// New tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel;
    var ylabel;

    if (chosenXAxis === "smokes") {
        xlabel = "Smokers:"
    }
    else if (chosenXAxis === "healthcare") {
        xlabel = "No Healthcare:"
    }
    else {
        xlabel = "Obese:";
    }


    if (chosenYAxis === "age") {
        ylabel = "Age:"
    }
    else if (chosenYAxis === "income") {
        ylabel = "Income:"
    }
    else {
        ylabel = "Poverty:"
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([40, 60])
        .html(function (d) {
            return (`<strong>${d.state}</strong>
              <br>${xlabel} ${d[chosenXAxis]}
              <br>${ylabel} ${d[chosenYAxis]}`);
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
    // console.log(chosenXAxis)
 
    // xLinearScale and yLinearScale functions
  var xLinearScale = xScale(censusData, chosenXAxis);
  var yLinearScale = yScale(censusData, chosenYAxis);

// Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

// append x and y axis
  var xAxis = chartGroup.append("g")
.classed("x-axis", true)
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

  var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        // .attr("transform")
        .call(leftAxis);

// intitial circles
  var circlesGroup = chartGroup.append("g")
      .selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d.income))
      .attr("r", 20)
      .attr("fill", "blue")
      .attr("opacity", ".4");

      var textCircles = chartGroup.append("g")
      .selectAll("text")
      .data(censusData)
      .enter()
      .append("text")
      .text(d => d.abbr)
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]) + 4)
      .attr("font-family", "calibri")
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .style("fill", "white")
      .attr("font-weight", "bold");

      // Groups for three x-axis labels
      var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
      var smokesLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age")
        .classed("active", true)
        .text("Smokers (%)");
  
      var healthcareLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("inactive", true)
        .text("Inadequate Healthcare (%)");

        var obesityLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obesity (%)");

        // Groups for three y-axis labels

        var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var ageLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 15)
        .attr("x", 0 - (height / 2))
        .attr("value", "age") // value to grab for event listener
        .classed("active", true)
        .text("Age (Median)");

    var incomeLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 35)
        .attr("x", 0 - (height / 2))
        .attr("value", "income")
        .classed("inactive", true)
        .text("Houshold Income (Median)");

    var povertyLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 55)
        .attr("x", 0 - (height / 2))
        .attr("value", "poverty")
        .classed("inactive", true)
        .text("Poverty (%)");

        


//  // append y axis
//     chartGroup.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 0 - margin.left)
//       .attr("x", 0 - (height / 2))
//       .attr("dy", "1em")
//       .classed("axis-text", true)
//       .text("Income ($)");



       









})()
