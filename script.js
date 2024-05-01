let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

let countyData
let educationData

let canvas = d3.select('#canvas')

//tooltip
let Tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("padding", "5px");
       
let mouseover = function() {
    Tooltip
        .style("opacity", 1)
    d3.select(this)
        .style("stroke", "white")
        .style("opacity", 1);
}

let mouseleave = function() {
    Tooltip
        .style("opacity", 0)
    d3.select(this)
        .style("stroke", "none")
        .style("opacity", 1);
}

let drawMap = () => {

     //used d3 to sketch out path for each county, geojson object
     canvas.selectAll('path') //selected all paths
     .data(countyData) //associated with array of geojson pbjects
     .enter() //specified what to do when there's no path
     .append('path') //create a new path
     .attr('d', d3.geoPath()) 
     /* set d attribute (data svg uses to draw path)
         called d3 geoPath method 
         - which converts geojson object into a path that svg can use
     */
     .attr('class', 'county') //sets the class to county

     /* returning different colors based on percentage 
     of adults with bachelor's degree or higher
     */
     .attr('fill', (countyDataItem 
         /* set fill attribute on the new path selection
         giving a function that takes in an item from the array

         countyDataItem = geojson objects 
         */
     ) => {
         /* matching id from countyData with matching 
             fips code from educationData
         */
         let id = countyDataItem['id'] 
         //selected geojson id and putting it in id field
         let county = educationData.find 
         /* in find give it a function that returns a 
             boolean function and returns first object 
             where boolean expression is true
         */
         ((item //refers to an item in educationData object
         ) => {
             return item['fips'] === id
         })

         let percentage = county['bachelorsOrHigher']
         //returns different colors based on percentage
         if(percentage <= 12){
             return '#edf8e9'
         }else if(percentage <= 21) {
             return '#c7e9c0'
         }else if(percentage <= 30){
             return '#a1d99b'
         }else if(percentage <= 39){
             return '#74c476'
         }else if(percentage <= 48){
             return '#41ab5d'
         }else if(percentage <= 57){
             return '#238b45'
         }else{
             return '#005a32'
         }

         /* selects object from educationData array to 
             match the county
             then looks at the percentage of people 
             with bachelorsOrHigher
             then depending on percentage values it 
             returns a specific color
         */

     })
     .attr('data-fips', (countyDataItem) => {
         return countyDataItem['id']
     })
     .attr('data-education', (countyDataItem) => {
         let id = countyDataItem['id'] 
         /* from countyDataItem (geojson object) set 
             id to the id within the countyData geojson array
         */

         let county = educationData.find((item) => {
             return item['fips'] === id
         })
          /* look at educationData array
             called find method
             gave it a function with a boolean expression
             boolean expression = fips code matches id
             returns first object where that holds true
         */

         let percentage = county['bachelorsOrHigher']
         //set percentage to bachelorsOrHigher field

         return percentage
     })
     .on('mouseover', mouseover)
     .on('mousemove', function(countyDataItem) {
        let Tooltip = d3.select("#tooltip");

        let id = countyDataItem['id']
    
        let county = educationData.find((item) => {
            return item['fips'] === id;
        });
    
        let areaName = county['area_name'];
        let state = county['state'];
        let percentage = county['bachelorsOrHigher'];
    
        Tooltip
            .html(areaName + ", " + state + 
                ": " + percentage + "%")
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 10) + "px")
            .style("opacity", 0.9)
            .attr("data-education", 
                d3.select(this).attr("data-education"));
    })
     .on('mouseleave', mouseleave)
   

    //colors
    const colorRanges = [
        {color: '#edf8e9', min: 3, max: 12},
        {color: '#c7e9c0', min: 12, max: 21},
        {color: '#a1d99b', min: 21, max: 30},
        {color: '#74c476', min: 30, max: 39},
        {color: '#41ab5d', min: 39, max: 48},
        {color: '#238b45', min: 48, max: 57},
        {color: '#005a32', min: 57, max: 66}
    ]
    const colors = [
        '#edf8e9','#c7e9c0','#a1d99b','#74c476','#41ab5d',
        '#238b45','#005a32'
    ];

    const colorScale = d3.scaleLinear()
        .domain(colorRanges.map(range => range.min))
        .range(colorRanges.map(range => range.color));

    //legend
    const legendWidth = 230;
    const legendHeight = 20;
    const legendPadding = 10;

    const legendSvg = d3.select("#canvas")
            .append("svg")
            .append("g")
            .attr("id", "legend")
            .attr("class", "legend")
            .attr("width", legendWidth)
            .attr("height", 
                legendHeight + legendPadding + 30)
            .attr("transform", "translate(600, 25)");
    
    colorRanges.forEach((range, index) => {
        const rectWidth = legendWidth / 7;
        const rectHeight = 10;
        
        legendSvg.append("rect")
            .attr("x", index * rectWidth)
            .attr("y", legendPadding)
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .style("fill", range.color);

        legendSvg.append("text")
            .attr("x", (index + 1) * rectWidth)
            .attr("y", rectHeight + 2.5 * legendPadding)
            .text(`${range.max}%`)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px");

        legendSvg.append("text")
            .attr("x", index * rectWidth)
            .attr("y", rectHeight + 2.5 * legendPadding)
            .text(`${range.min}%`)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px");

        //tick marks - code placement matters 
        legendSvg.append("line")
            .attr("x1", index * rectWidth) //x-coordinate
            .attr("y1", legendPadding) // start y-coordinate
            .attr("x2", index * rectWidth) //end x-coordinate 
            .attr("y2", legendPadding + rectHeight + 3)//end y-coordinate
            .style("stroke", "#000");
            
        legendSvg.append("line")
            .attr("x1", legendWidth)
            .attr("y1", legendPadding)
            .attr("x2", legendWidth)
            .attr("y2", legendPadding + rectHeight + 3)
            .style("stroke", "#000");

    });
}
 
d3.json(countyURL).then( 
    (data, error) => {
        if(error){
            console.log(log)
        }else{
            countyData = topojson.feature(
                data, data.objects.counties).features
            /* converts topojson objects into geojson - 
            know it's geojson due to feature

            d3 only supports geoJSON to draw paths with 

            features contains an array of objects for each county
            */

            console.log(countyData)
            
            d3.json(educationURL).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }else{
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
) 

console.log(d3)
console.log(topojson)