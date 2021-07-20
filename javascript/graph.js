const margin = { top: 40, right: 20, bottom: 50, left: 40 };
const graphWidth = 377;
const graphHeight = 400 - margin.top - margin.bottom;

const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", graphWidth)
  .attr("height", graphHeight + margin.top + margin.bottom)
  .attr("class", "justify-self-center");

const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left},${margin.top})`);

//todo: set scales
const x = d3.scaleTime().range([0, graphHeight]);
const y = d3.scaleLinear().range([graphHeight, 0]);

//todo: axes group
const xAxisGroup = graph
  .append("g")
  .attr("class", "x-axis stroke-current text-white")
  .attr("transform", `translate(0,${graphHeight})`);

const yAxisGroup = graph
  .append("g")
  .attr("class", "y-axis stroke-current text-white");

//todo: d3 line generator
const line = d3
  .line()
  .x((d) => x(new Date(d.date)))
  .y((d) => y(d.distance));
//todo:line path element
const path = graph.append("path");
//todo:created dotted line group and append to graph
const dottedLine = graph.append("g").attr("class", "lines").style("opacity", 0);
//todo:create x dotted line
const xDottedLine = dottedLine
  .append("line")
  .attr("stroke", "#aaaa")
  .attr("stroke-width", 1)
  .attr("stroke-dasharray", 4);
//todo:create y dotted line
const yDottedLine = dottedLine
  .append("line")
  .attr("stroke", "#aaaa")
  .attr("stroke-width", 1)
  .attr("stroke-dasharray", 4);

//todo:update the data
const update = (data) => {
  const t = d3.transition().duration(500);
  data = data.filter((item) => item.activity === activity);
  //todo: sort data based on date objects
  data.sort((a, b) => new Date(a.date) - new Date(b.date));
  //todo: set scale domain
  x.domain(d3.extent(data, (d) => new Date(d.date)));
  y.domain([0, d3.max(data, (d) => d.distance)]);
  //todo:update path data
  path
    .data([data]) //!array in an array for d3 line
    .attr("fill", "none")
    .attr("stroke", "#00bfa5")
    .attr("stroke-width", 2)
    .attr("d", line);

  //todo:create circles for objects
  const circles = graph.selectAll("circle").data(data);

  //todo:update current points
  circles
    .attr("cx", (d) => x(new Date(d.date)))
    .attr("cy", (d) => y(d.distance));
  //todo:add new point with enter
  circles
    .enter()
    .append("circle")
    .attr("r", 4)
    .attr("fill", "#ccc")
    .attr("cx", (d) => x(new Date(d.date)))
    .attr("cy", (d) => y(d.distance));

  //todo:remove exit points
  circles.exit().remove();

  graph
    .selectAll("circle")
    .on("mouseover", handleMouseover)
    .on("mouseout", handleMouseout);
  //todo:create axis
  const xAxis = d3.axisBottom(x).ticks(4).tickFormat(d3.timeFormat("%b %d"));
  const yAxis = d3
    .axisLeft(y)
    .ticks(4)
    .tickFormat((d) => d + "m");

  //todo:call axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis); //*put the axis shape in the group by call

  //todo:rotate axis text
  xAxisGroup
    .selectAll("text")
    .attr("transform", "rotate(-40)")
    .attr("text-anchor", "end");
};
var data = [];

db.collection("activity").onSnapshot((res) => {
  res.docChanges().forEach((change) => {
    const doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case "added":
        data.push(doc);
        break;
      case "modified":
        const index = data.findIndex((item) => item.id == doc.id);
        data[index] = doc;
        break;
      case "removed":
        data = data.filter((item) => item.id !== doc.id);
        break;
      default:
        break;
    }
  });
  update(data);
});

const handleMouseover = (e, d) => {
  d3.select(e.currentTarget)
    .transition()
    .duration(100)
    .attr("r", 8)
    .attr("fill", "#fff");
  //todo:set x dotted line cords
  xDottedLine
    .attr("x1", x(new Date(d.date)))
    .attr("x2", x(new Date(d.date)))
    .attr("y1", graphHeight)
    .attr("y2", y(d.distance));

  //todo:set y dotted line cords
  yDottedLine
    .attr("x1", 0)
    .attr("x2", x(new Date(d.date)))
    .attr("y1", y(d.distance))
    .attr("y2", y(d.distance));

  //todo:show the dotted line group
  dottedLine.style("opacity", 1);
};

const handleMouseout = (e, d) => {
  d3.select(e.currentTarget)
    .transition()
    .duration(100)
    .attr("r", 4)
    .attr("fill", "#ccc");
  //todo:hide the dotted line group(opacity 0)
  dottedLine.style("opacity", 0);
};
