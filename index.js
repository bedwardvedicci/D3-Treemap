import * as d3 from "d3";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

window.onload = async () => {
  const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";
  const data = await fetch(url);
  const json = await data.json();
  init(json);
}

const init = (videogames) => {
  
const App = () => {
  return (
    <div>
      <h1 id="title">
        Video Game Sales<br/>
        <span id="description">
          Top 100 Most Sold Video Games Grouped by Platform
        </span>
      </h1>
      <div id="treemapWrapper">
        <div id="treemap">
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App/>, document.getElementById("root"));

const w = 1000, h = 750;

const root = d3.hierarchy(videogames);
root.sum(d=>d.value);

const treemapLayout = d3.treemap();
treemapLayout.size([w-20, h-20]);
treemapLayout.tile(d3.treemapSquarify);

treemapLayout(root);

const nodes = d3
                .select("#treemap")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .append("g")
                .attr("transform", `translate(10, 10)`)
                .selectAll("g")
                .data(root.leaves())
                .enter()
                .append("g")
                .attr("transform", d=>`translate(${d.x0}, ${d.y0})`);

const handleMouseOver = (e, d) => {
  
  d3.select("#treemap")
    .append("div")
    .attr("data-value", d.data.value)
    .style("position", "absolute")
    .style("top", d.y0)
    .style("left", d.x0)
    .attr("id", "tooltip")
    .html(`${d.data.name}`);
}

const handleMouseOut = () => {
  d3.select("#tooltip").remove();
}


nodes
  .append("rect")
  .attr("class", "tile")
  .attr("fill", d=>d.data.category === "Wii" ? "green":"cadetblue")
  .attr("data-name", d=>d.data.name)
  .attr("data-category", d=>d.data.category)
  .attr("data-value", d=>d.data.value)
  .attr("width", d=>d.x1-d.x0)
  .attr("height", d=>d.y1-d.y0)
  .on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut);

nodes
  .append("text")
  .attr("dx", 4)
  .attr("dy", 14)
  .text(d=>d.data.name);


// LEGEND ↓
const legendSvg = d3
              .select("#treemap")
              .append("svg")
              .attr("id", "legend")
              .attr("width", 200)
              .attr("height", 100);

const legendData = [
  {
    name: "Wii"
    , color: "green"
  }
  ,
  {
    name: "others"
    , color: "cadetblue"
  }
]

const legendGs = legendSvg
                      .selectAll("g")
                      .data(legendData)
                      .enter()
                      .append("g");

legendGs.append("rect")
        .attr("fill", d=>d.color)
        .attr("class", "legend-item")
        .attr("width", 8)
        .attr("x", 15)
        .attr("y", (d, i)=>15*(i+1))
        .attr("height", 8);

legendGs.append("text")
        .attr("x", 15+8+5)
        .attr("y", (d, i)=>15*(i+1)+7)
        .text(d=>d.name)
}