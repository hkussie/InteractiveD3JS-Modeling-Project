(function () {
	var width = 900;
	var height = 600;

	var svg = d3.select("#chart")
	   .append("svg")
	   .attr("height", height)
	   .attr("width", width)
	   .append("g")
	   .attr("transform", "translate(0, 0)")

	var defs = svg.append("defs");
	
	defs.append("pattern")
	  .attr("id", "America")
	  .attr("height", "100%")
	  .attr("width", "100%")
	  .attr("patternContentUnits", "objectBoundingBox")
	  .append("image")
	  .attr("height", 1)
	  .attr("width", 1)
	  .attr("preserveAspectRatio", "none")
	  .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
	  .attr("xlink:href", "America.png")   

	var radiusScale = d3.scaleSqrt().domain([0.6, 16.7]).range([10, 80])   
/*
Use d3 force to initiate movement amoungst the bubbles.
The simulation is a collection of forces, 
which will determine how the circles will move. 
*/
   /*
	var simulation = d3.forceSimulation()
	  .force("x", d3.forceX(width / 2).strength(0.05))
	  .force("y", d3.forceY(height / 2).strength(0.05))
	  .force("collide", d3.forceCollide(function(d){
	  	return radiusScale(d.GDP);
	  }))
    */

    var forceXSeperate = d3.forceX(function(d) {
    	if (d.GDP > 5.5) {
            return 250 
         } else {
         	return 750
         }
         return width / 2 
       }).strength(0.10)

    var forceXCombine = d3.forceX(width / 2).strength(0.05)

    var forceCollide = d3.forceCollide(function(d) {
    	return radiusScale(d.GDP) + 1
    })

    var simulation = d3.forceSimulation()
       .force("x", forceXCombine)
       .force("y", d3.forceY(height / 2).strength(0.05))
       .force("collide", forceCollide)

//To Prevent collision with other data points, use 
//d3 forceCollide()
//use function for forceCollide to return radiusScale(d.GDP)	    

	d3.queue()
	  .defer(d3.csv, "Data.csv")
	  .await(ready)

	function ready(error, datapoints) {


	   defs.selectAll(".country-pattern")
	    .data(datapoints)
	    .enter().append("pattern")
	    .attr("class", "country-pattern") 
	    .attr("id", function(d) {
	    	return d.Name.toLowerCase().replace(/ /g, "-")
	    })
	    .attr("height", "100%")
	    .attr("width", "100%")
	    .attr("patternContentUnits", "objectBoundingBox")
	    .append("image")
	    .attr("height", 1)
	    .attr("width", 1)
	    .attr("preserveAspectRatio", "none")
	    .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
	    .attr("xlink:href", function(d) {
	    	return d.Image_path
	    }) 
	   

	  var circles = svg.selectAll(".Name")
	    .data(datapoints)
	    .enter().append("circle")
	    .attr("class", "country")
	    .attr("r", function(d) {
	    	return radiusScale(d.GDP);
	    })
	    .attr("fill", function (d) {
	    	return "url(#" + d.Name.toLowerCase().replace(/ /g, "-") + ")"
	    })
	  
	    .on('click', function(d) {
	    	console.log(d)
	    })

//Add functionality to GDP button 
//Create onclick function 
       
      d3.select("#GDP").on('click', function() {
      	simulation
      	  .force("x", forceXSeperate)
      	  .alphaTarget(0.25)
      	  .restart()
      })

      d3.select("#combine").on('click', function() {
      	simulation
      	   .force("x", forceXCombine)
      	   .alphaTarget(0.25)
      	   .restart()
      })

	  simulation.nodes(datapoints)
	    .on('tick', ticked)
	  
	  function ticked() {
	  	circles
	  	  .attr("cx", function (d) {
	  	  	return d.x
	  	  })
	  	  .attr("cy", function (d) {
	  	  	return d.y
	  	  })
	  }
	}    
})();