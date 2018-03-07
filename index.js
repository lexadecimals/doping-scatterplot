d3
  .json(
    "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
  .then(function(data) {
    calculateSecondsBehindFastest(data);
    // fancyTimeFormat(data);
  });

//calculate minutes behind fastest time
function calculateSecondsBehindFastest(d) {
  var fastestTime = d[0].Seconds;
  var cyclists = d.map(function(cyclist) {
    var timeBehindSeconds = cyclist.Seconds - fastestTime;
    var mins = Math.floor(timeBehindSeconds / 60);
    var seconds = timeBehindSeconds - mins * 60;
    let theTime = new Date(99, 5, 24, 00, mins, seconds, 0);
    cyclist.dateTime = theTime;
    // cyclist.secondsBehindFastest = cyclist.Seconds - fastestTime;
    return cyclist;
  });

  svgElements(cyclists);
}

var xScale;
var yScale;

var margin = { top: 80, right: 200, bottom: 60, left: 70 };

var chartWidth = 800 - margin.left - margin.right;
var chartHeight = 600 - margin.top - margin.bottom;

function svgElements(cyclists) {
  var dataset = cyclists;

  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("height", chartHeight + margin.bottom + margin.top)
    .attr("width", chartWidth + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("h1")
    .text("Doping in Professional Bicycle Racing")
    .attr("class", "title")
    .attr("x", 340);

  //create scales

  var positions = dataset.map(function(e) {
    return e.Place;
  });

  yScale = d3
    .scaleLinear()
    .domain([d3.min(positions), d3.max(positions) + 1])
    .range([0, chartHeight]);

  var maxTime = new Date("Jun 24 1999 00:03:10");

  xScale = d3
    .scaleTime()
    .domain([
      maxTime,
      d3.min(dataset, function(d) {
        return d.dateTime;
      })
    ])
    .range([0, chartWidth]);

  var allTimes = dataset.map(e => {
    return e.timeBehindSeconds;
  });

  // create axes

  var xAxis = d3
    .axisBottom(xScale)
    .ticks(4)
    .tickFormat(d3.timeFormat("%M:%S"), 4);

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + chartHeight + ")")
    .call(xAxis);

  var yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  //create svgElements

  console.log(dataset[9]);

  var circles = svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      // console.log(d.dateTime);
      return xScale(d.dateTime);
    })
    .attr("cy", function(d) {
      return yScale(d.Place);
    })
    .attr("r", 5)
    .attr("fill", function(d) {
      if (d.Doping.length > 0) {
        return "rgb(12, 224, 72)";
      } else {
        return "#D1AB0E";
      }
    })
    .on("mouseover", function(d) {
      d3.select(this).attr("stroke", "rgb(27, 136, 215)");

      d3
        .select("#tooltip")
        .style("opacity", "0.8")
        .style("left", 100 + "px")
        .style("top", 100 + "px")
        .style("display", "block")
        .html(
          d.Name +
            ": " +
            d.Nationality +
            "</br>" +
            d.Year +
            ", Time: " +
            d.Time +
            "</br>" +
            "</br>" +
            d.Doping
        );
    })
    .on("mouseout", function() {
      d3.select("#tooltip").style("display", "none");
      d3.select(this).attr("stroke", "none");
    });

  svg
    .append("g")
    .selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
      return d.Name;
    })
    .attr("x", function(d) {
      return xScale(d.dateTime) + 10;
    })
    .attr("y", function(d) {
      return yScale(d.Place) + 5;
    })
    .style("font-family", "sans-serif")
    .style("font-size", 12)
    .attr("class", "names");

  svg
    .append("text")
    .text("Minutes behind fastest time")
    .attr("class", "xInfo")
    .attr("y", chartHeight + margin.top - 35)
    .attr("x", +180);

  svg
    .append("text")
    .text("Ranking")
    .attr("class", "yInfo")
    .attr("y", -35)
    .attr("transform", "rotate(-90)")
    .attr("x", -55);
  // .attr("x");
}