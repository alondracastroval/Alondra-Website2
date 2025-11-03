//JAVASCRIPT CODE FOR THE SECOND PART OF THE DATA BY Alondra Castro-Valadez


// Load the data
const socialMedia = d3.csv("socialMedia.csv");

// Once the data is loaded, proceed with plotting
socialMedia.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.Likes = +d.Likes;
    });

    // Define the dimensions and margins for the SVG
    
    //defining the width and height
    let 
    width = 600;
    height = 400;

    //setting up the margins
    let margin = {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
    }
    // Create the SVG container

    //creating the svbg for the side by side box plot
    let svg = d3.select('#boxplot').append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', 'lightgrey');
    
  
    // Set up scales for x and y axes

    // You can use the range 0 to 1000 for the number of Likes, or if you want, you can use
    // d3.min(data, d => d.Likes) to achieve the min value and 
    // d3.max(data, d => d.Likes) to achieve the max value
    // For the domain of the xscale, you can list all three age groups or use
    // [...new Set(data.map(d => d.AgeGroup))] to achieve a unique list of the age group
    

    // Add scales   
  //first the y scale  
  let yScale = d3.scaleLinear()
                .domain([0,1000]) // going to use the range 1000 for the number of likes
                .range([height - margin.bottom, margin.top]);//mapping to pixel position
    
//then we can do the scale 
  let xScale = d3.scaleBand()
                .domain(data.map(d => d.AgeGroup)) // going to use d.Agegroup to achieve a unique list
                .range([margin.left, width - margin.right])
                .padding(0.2);
                
  //lets draw the x and y axis
  let yAxis = svg.append('g')
                  .attr('transform', `translate(${margin.left},0)`)
                  .call(d3.axisLeft(yScale));

  let xAxis = svg.append('g')
                  .attr('transform', `translate(0, ${height - margin.bottom})`)
                  .call(d3.axisBottom(xScale));


    // Add x-axis label
    svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 5) //adjusting the height of the text
    .text('Age Group')

    // Add y-axis label
    svg.append('text')
    .attr('x', 0 -height/2)
    .attr('y', 10)
    .text('Number of Likes')
    .attr('transform', 'rotate(-90)')


    //might add the whiskers
    // in this function we calculate the metrix needed for the box plot 
    // prof gave us min and q1, so now we have to calculate q3, median, and max
    const rollupFunction = function(groupData) {
        const values = groupData.map(d => d.Likes).sort(d3.ascending);
        const min = d3.min(values);
        const max =  d3.max(values);
        const q1 = d3.quantile(values, 0.25);
        const median = d3.quantile(values, 0.50);
        const q3 = d3.quantile(values, 0.75); //q3  would be the same 
        return {min, max, q1, median, q3};
    };

    //PART 4 
    //in this line, rollup groups our data with the key we specifcy (age group)
    // and applies the rollup function we created earlier to each group
    const quantilesByGroups = d3.rollup(data, rollupFunction, d => d.AgeGroup);

    //this loops through the result of the quantiles by group function (age groups with metrics)
    quantilesByGroups.forEach((quantiles, AgeGroup) => {
       // then for each age group it maps the value to a position into our plot (where to draw the box)
        const x = xScale(AgeGroup);
        //then determining the width of the box in the chart using .bandwidth (how wide)
        const boxWidth = xScale.bandwidth();

        // Draw vertical lines
        //line that goes from the min value to the max value for each group
        let line = svg.append('line')
        .attr('x1', x + boxWidth / 2) //making the position of the line the middle
        .attr('x2', x + boxWidth / 2) // straight line so they r the same
        .attr('y1', yScale(quantiles.min)) //the beginning of the line
        .attr('y2', yScale(quantiles.max)) // the end of the line
        .attr('stroke', 'black');

        // Draw box
        let box = svg.append('rect')
        .attr('x', x ) // in the provided code
        .attr('y', yScale(quantiles.q3)) // the y will be the q3 
        .attr('width', boxWidth)
        .attr('height', yScale(quantiles.q1) - yScale(quantiles.q3))
        .attr('fill', 'pink'); 

        // Draw median line
        svg.append('line')
        .attr('x1', x) //beginning of box
        .attr('x2', x + boxWidth)//the end of the box
        .attr('y1', yScale(quantiles.median)) // the position of the median 
        .attr('y2', yScale(quantiles.median)) // straight line so they are same
        .attr('stroke','black')
        .attr('stroke-width', 1);
    });
});

// Prepare you data and load the data again. 
// This data should contains three columns, platform, post type and average number of likes. 
const socialMediaAvg = d3.csv("SocialMediaAvg.csv");

socialMediaAvg.then(function(data) {
    // Convert string values to numbers
    //same thing we did with the other dat but with platform, post type, and likes
    data.forEach(function(d) {
      d.Platform = d.Platform;
      d.PostType = d.PostType;
      d.AvgLikes = +d.AvgLikes;
    });

    // Define the dimensions and margins for the SVG

    let 
    width = 600;
    height = 400;

    //setting up the margins
    let margin = {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
    }
    

    // Create the SVG container
    //creating the svg for the side by side bar plot
    let svg = d3.select('#barplot').append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', 'lightyellow');


    // Define four scales
    // Scale x0 is for the platform, which divide the whole scale into 4 parts
    // Scale x1 is for the post type, which divide each bandwidth of the previous x0 scale into three part for each post type
    // Recommend to add more spaces for the y scale for the legend
    // Also need a color scale for the post type

    //making the scale for the plaform,to divide into four parts
    const x0 = d3.scaleBand()
    .domain(data.map(d => d.Platform))
    .range([margin.left, width - margin.right]).padding(0.2);

    //now lets make the scale for post type x1
    const x1 = d3.scaleBand()
    .domain(data.map(d => d.PostType))
    .range([0, x0.bandwidth()]).padding(0.2);


    const y = d3.scaleLinear()
    //the rangr will be from 0 to the max average number of likes
    .domain([0, d3.max(data,  d => d.AvgLikes)])
    .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain([...new Set(data.map(d => d.PostType))])
      .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);    
         
    // Add scales x0 and y     

    //lets draw the x0 and y axis
  let yAxis = svg.append('g')
                  .attr('transform', `translate(${margin.left},0)`)
                  .call(d3.axisLeft(y));

  let xAxis = svg.append('g')
                  .attr('transform', `translate(0, ${height - margin.bottom})`)
                  .call(d3.axisBottom(x0));
    


    // Add x-axis label
    svg.append('text')
    .attr('x', width / 2 - 50)
    .attr('y', height - 5) //adjusting the height of the text
    .text('Platform Type')

    // Add y-axis label
    svg.append('text')
    .attr('x', 0 - height/2 - 50)
    .attr('y', 13)
    .text('Average Number of Likes')
    .attr('transform', 'rotate(-90)')

    

  // Group container for bars
    const barGroups = svg.selectAll("bar")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${x0(d.Platform)},0)`);

  // Draw bars
  //the x is decided by the post type (subcategory)
    barGroups.append("rect")
    .attr("x", d => x1(d.PostType))
    .attr("y", d => y(d.AvgLikes))
    .attr("width", x1.bandwidth()) //width will be the bandwith of the post type
    //full height - empty space on top - bottom
    .attr('height', d => height - margin.bottom - y(d.AvgLikes)) //the range of the whole bar
    .attr("fill", d => color(d.PostType))

    

    // Add the legend
  
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 150}, ${margin.top})`);

    const types = [...new Set(data.map(d => d.PostType))];
 
    types.forEach((type, i) => {

    // Alread have the text information for the legend. 
    // Now add a small square/rect bar next to the text with different color.
      legend.append("text")
          .attr("x", 78) //adjusted the x to fit my width
          .attr("y", i * 20 + 12)
          .text(type)
          .attr("alignment-baseline", "middle");
      //lets add the little squares next to the text
      legend.append("rect")
        .attr("x", 130)
        .attr("y", i * 20 + 10)
        .attr("width", 7)
        .attr("height", 7)
        //making the color the corresponding media type color
        .attr("fill",  color(type))
  });

});


//PART 
// Prepare you data and load the data again. 
// This data should contains two columns, date (3/1-3/7) and average number of likes. 

const socialMediaTime = d3.csv("socialMediaTime.csv");

socialMediaTime.then(function(data) {
    // Convert string values to numbers
    

    // Define the dimensions and margins for the SVG
    

    // Create the SVG container
    

    // Set up scales for x and y axes  


    // Draw the axis, you can rotate the text in the x-axis here


    // Add x-axis label
    

    // Add y-axis label


    // Draw the line and path. Remember to use curveNatural. 

});
