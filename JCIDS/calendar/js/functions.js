function quarterFormat(date){
  var month = date.getMonth();
  var year = date.getFullYear();
  switch (month) {
    case 0:
      return year + " Q1";
    case 3:
      return year + " Q2";
    case 6:
      return year + " Q3";
    case 9:
      return year + " Q4";      
  }
}

function iconPick(str, status) {
  switch (str) {
    case "Decision Point":
      if (status == "Event Complete") {
        // return "&#9670;";
        return '\u25C6';
      } else {
        // return "&#9671;"; 
        return '\u25C7';
      }
    case "Milestone Decision":
      if (status == "Event Complete") {
        // return "&#9650;"
        return '\u25B2';
      } else {
        // return "&#9651;";
        return '\u25B3';
      }
  }
}


function buildGraphComponents(width, height) {
  w = width; // 1200
  h = height; // 700

  moScale = d3.time.scale()
      .domain([new Date(minDomain), new Date(maxDomain)])
      .range([0, w]);

  gridlines = d3.svg.axis()
      .scale(moScale)
      .orient("top")
      .ticks(13)
      .tickFormat("")
      .tickSize(-h,0);

  qAxis = d3.svg.axis()
    .scale(moScale)
    .orient("top")
    .ticks(4)
    .tickSize(30, 2)
    .tickFormat( function(d){
      return quarterFormat(d);
    });

  moAxis = d3.svg.axis()
    .scale(moScale)
    .orient("top")
    .ticks(12)
    .tickSize(35, 2)
    .tickFormat(function(d){
        return moSwap(d.getMonth());
    });

  svg = d3.select("#body")
              .append("svg")
              .attr("width", w)
              .attr("height", h);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,0)")
      .call(qAxis)
    .selectAll(".tick text")
      .style("text-anchor", "middle")
      .attr("x", (w-50) / 8)
      .attr("y", -10);

  svg.append("g")
     .attr("id", "gridlines")
     .attr("class", "grid")
     .attr("transform", "translate(0,0)")
     .call(gridlines)
  .selectAll(".tick text")
      .style("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", 0);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,35)")
      .call(moAxis)
    .selectAll(".tick text")
      .style("text-anchor", "middle")
      .attr("x", (w-50) / 24)
      .attr("y", -10)
      .attr("fill", "black");
}

var barCounter = 0;
var textCounter = 0;
var labelCounter = 0;

function buildGraph(event) {
  var group = svg.append("g")
                  .attr("class", "barGroup");
  
  group.append("text")
       .text(event.name)
       .attr("x", -10)
       .attr("y", ( 65 + (barCounter * 30) + (labelCounter * 20) ) )
       .attr("text-anchor", "end")
       .attr("font-family", "Roboto, sans-serif")
       .attr("font-size", "24px")
       .attr("font-weight", "bold")
       .attr("fill", "rgba(68,68,68,.6)");
       // .attr("fill", colorSwap(event.events[0].type) );
    
  var bars = group.selectAll(".bar")
                   .data(event.events)
                   .enter()
                   .append("g")
                   .attr("class", "bar");

  bars.append("rect")
      .attr("class", function(d){ return "event";}) // d.name.replace(" ", "") })
      .attr("x", function(d){
        return moScale(new Date(d.startDate));
       })
      .attr("y", function(d, i){ 
        // should start at 50
        // bar height is 20
        // space between bars is 10
        // space between groups is 25
        // group1 bar1 = 50
        // group2 bar1 = 105
        // group2 bar2 = 135  
        barCounter++;
        return 50 + ( (barCounter - 1) * 30) + (labelCounter * 20);
       })
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("width", function(d){
        var dStart = new Date(d.startDate);
        var dEnd = new Date(d.endDate);
        // numbers of months
        var months = dEnd.getMonth() - dStart.getMonth();
        // number of days
        var startDay = dStart.getDate();
        var endDay = dEnd.getDate();
        var days = 0;
        var duration;
        var endMonthDays = "";
        if (endDay > startDay) {
          days = endDay - startDay;
          duration = months + (days / monthDays(dEnd));
        } else if (endDay == startDay) {
          days = 0;
          duration = months;
        } else {
          days = endDay - startDay;
          duration = months + (days / monthDays(dEnd));
        }
        if (duration < 0.25) {
          duration = 0.25;
        }
        return (w/12) * duration;
      })
      .attr("height", 20)
      .attr("fill", function(d){
        return colorSwap(d.type);
      });
  
  bars.append("text")
      .text(function(d){
        return iconPick(d.type, d.status);
      })
      .attr("class", "barIcon")
      .attr("x", function(d){
        var dStart = new Date(d.startDate);
        var dEnd = new Date(d.endDate);
        // numbers of months
        var months = dEnd.getMonth() - dStart.getMonth();
        // number of days
        var startDay = dStart.getDate();
        var endDay = dEnd.getDate();
        var days = 0;
        var duration;
        var endMonthDays = "";
        if (endDay > startDay) {
          days = endDay - startDay;
          duration = months + (days / monthDays(dEnd));
        } else if (endDay == startDay) {
          days = 0;
          duration = months;
        } else {
          days = endDay - startDay;
          duration = months + (days / monthDays(dEnd));
        }
        if (duration < 0.25) {
          duration = 0.25;
          return moScale(new Date(d.startDate)) + ( ((w/12) * duration) / 2 );
        } else {
          return moScale(new Date(d.startDate)) + (w/12) * duration/2;
        }
       })
      .attr("y", function(d, i){
        textCounter++;
        return 50 + ( (textCounter - 1) * 30) + (labelCounter * 20) + 17;
        // return ((i + barCounter) * 50) + 77;
       })
      .attr("text-anchor", "middle")
      .attr("font-size", "16px");

  labelCounter++;
}

function colorSwap(color){
  switch (color) {
    case "Decision Point":
        return "#2196F3";
        break;
    case "Milestone Decision":
        return "#009688";
        break;
    case "orange":
        return "#FFAB40";
        break;
    case "red":
        return "#E53935";
        break;
  }
}

function monthDays(date){
  var month = date.getMonth();
  month++;
  return new Date(date.getFullYear(), month, 0).getDate();
}

function firstUpper(str){
  return str.substring(0,1).toUpperCase() + str.substring(1,str.length);
}

function formatDate(str){
  var date = new Date(str);
  var month = date.getMonth() + 1;
  var newMonth = "";
  if ( month < 10 ) {
    newMonth = "0" + month;
  } else {
    newMonth = month;
  }
  return newMonth + "/" + date.getDate() + "/" + date.getFullYear();
}

function moSwap(num){
  switch (num) {
   case 0:
        return "JAN";
        break;
   case 1:
        return "FEB";
        break;
   case 2:
        return "MAR";
        break;
   case 3:
        return "APR";
        break;
   case 4:
        return "MAY";
        break;
   case 5:
        return "JUN";
        break;
   case 6:
        return "JUL";
        break;
   case 7:
        return "AUG";
        break;
   case 8:
        return "SEP";
        break;
   case 9:
        return "OCT";
        break;
   case 10:
        return "NOV";
        break;
   case 11:
        return "DEC";
        break;
  }
}