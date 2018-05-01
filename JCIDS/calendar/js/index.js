var date = new Date();
var currentYear = date.getFullYear();
var currentMonth = date.getMonth();
var currentDay = date.getDay();
var startingMonth;
switch (currentMonth) {
  case 0:
  case 1:
  case 2:
    startingMonth = 01;
    break;
  case 3:
  case 4:
  case 5:
    startingMonth = 04;
    break;
  case 6:
  case 7:
  case 8:
    startingMonth = 07;
    break;
  case 9:
  case 10:
  case 11:
     startingMonth = 10; 
     break;
};

var lastMoDays = monthDays( new Date( (currentYear+1), (startingMonth), 0 ) );
var minDomain = startingMonth + "/" + 01 + "/" + (currentYear);
var maxDomain = (startingMonth - 1) + "/" + lastMoDays + "/" + (currentYear+1);

$(document).ready(function(){
  // $.getScript("https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js", function(){
  //   $.getScript("/orgs/OPNAV/DNS/DNS4/ITSuppTeam/Matt/SiteAssets/JCIDS/js/functions.js", function(){});
  // });

  $.ajax({
    url: "https://portal.secnav.navy.mil/orgs/OPNAV/N9/N95/_api/web/lists/getbytitle('JCIDS')/items?$select=Title,Event_x0020_Status,Event_x0020_Title,Event,Event_x0020_Start_x0020_Date,Event_x0020_End_x0020_Date,Program/Title&$expand=Program",
    method: "GET",
    headers: { "Accept": "application/json; odata=verbose" },
    success: function (data) {
      var results = data.d.results;
      var newObj = {};
      var programCount = 0;
      for ( i = 0; i < results.length; i++ ) {
        if ( newObj.hasOwnProperty( results[i].Program.Title ) ) {
          // add event to this program
          newObj[results[i].Program.Title].events.push({
            name: results[i].Event_x0020_Title,
            type: "", // figColor( programEvents[j].name ),
            startDate: formatDate(results[i].Event_x0020_Start_x0020_Date),
            endDate: formatDate(results[i].Event_x0020_End_x0020_Date),
            type: results[i].Event,
            status: results[i].Event_x0020_Status,
            comments: results[i].Title
          });
        } else {
          // create program object and add event to program
          newObj[results[i].Program.Title] = {
            name: results[i].Program.Title,
            events: [{
              name: results[i].Event_x0020_Title,
              type: "", // figColor( programEvents[j].name ),
              startDate: formatDate(results[i].Event_x0020_Start_x0020_Date),
              endDate: formatDate(results[i].Event_x0020_End_x0020_Date),
              type: results[i].Event,
              status: results[i].Event_x0020_Status,
              comments: results[i].Title
            }]
          }
          programCount++;
        }
      }
      // function figColor (program) {
      //   if (program == programsList[0]){
      //     return "blue";
      //   } else {
      //     return "green";
      //   }
      // }
  
      var eventCount = results.length;
      buildGraphComponents(1200, (eventCount * 30) + (programCount * 20) + 50 );

      for ( program in newObj ) {
        var obj = newObj[program];
        buildGraph(obj);
      }

      // for ( i = 0; i < programEvents.length; i++ ) {
      //   buildGraph(programEvents[i]);
      // }

      // hide text if event isn't long enough
      // var bars = $(".bar");
      // for ( i = 0; i < bars.length; i++ ) {
      //   if ( bars[i].childNodes[0].attributes.width.value - 10 < bars[i].childNodes[1].getComputedTextLength() ) {
      //     // hide text
      //     bars[i].childNodes[1].style.display = "none";
      //   }
      // }

      // TOOLTIP
      $("rect").parent().css("cursor", "default").on({
        mousemove: function(e){
          $("#tooltip").css({
            display: "block",
            position:"fixed", 
            top:e.pageY + 20, 
            left: e.pageX + 20,
            width: "auto"
          }).html('<span class="icon">' + iconPick(this.__data__.type, this.__data__.status) + ' </span>' + '<strong class="icon">' + firstUpper(this.__data__.name) + "</strong><p>Start: " + formatDate(this.__data__.startDate) + "</p><p>End: " + formatDate(this.__data__.endDate) + "</p><p>Notes: " + this.__data__.comments + "</p>");
        },
        mouseout: function(){
          $("#tooltip").hide();
        }
      });

    },
    error: function (data) {
      console.log("Error: "+ data);
    }
  });
});