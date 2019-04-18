
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.csv("/assets/data/data.csv").then(function(data) {
    let chartData = []

    data.forEach(function(state) {
      chartData.push(
        {
          healthcare: +state.healthcare,
          poverty: +state.poverty,
          text: state.abbr
        }
      )
    })

    let xLinearScale = d3.scaleLinear()
      .domain([d3.min(chartData, d => (d.poverty - 1)), d3.max(chartData, d => d.poverty)])
      .range([0, width])

    let yLinearScale = d3.scaleLinear()
      .domain([d3.min(chartData, d => (d.healthcare - 2)), d3.max(chartData, d => (d.healthcare + 2))])
      .range([height, 0])

    // Create axis functions
    let bottomAxis = d3.axisBottom(xLinearScale)
    let leftAxis = d3.axisLeft(yLinearScale)

    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis)

    chartGroup.append("g")
      .call(leftAxis)

    // Axis labels
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("fill", "black")
      .text("In Poverty (%)");

    chartGroup.append("text")
      .attr("transform", `translate(-30, ${height / 2})rotate(-90)`)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("fill", "black")
      .text("Lacks Healthcare (%)")
  

    // Loop through data
    let circlesGroup = chartGroup.selectAll("circle")
      .data(chartData)

    var gEnter = circlesGroup.enter().append("g")

    // Draw circle for each
    gEnter.append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "purple")
      .attr("opacity", ".5")

    // Draw text for each
    gEnter.append("text")
      .attr("dx", d => xLinearScale(d.poverty) - 9)
      .attr("dy", d => yLinearScale(d.healthcare) + 5)
      .text(function (d) { 
        return d.text
      })
      
  })