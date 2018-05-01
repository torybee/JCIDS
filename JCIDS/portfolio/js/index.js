$(document).ready(function(){
  $.ajax({
    url: "https://portal.secnav.navy.mil/orgs/OPNAV/N9/N95/_api/web/lists/getbytitle('Programs')/items?$select=Title,Category,Phase",
    method: "GET",
    headers: { "Accept": "application/json; odata=verbose" },
    success: function (data) {
      var results = data.d.results;
      var programs = {};
      for ( i = 0; i < results.length; i++ ) {
        programs[results[i].Title] = {
          name: results[i].Title,
          category: results[i].Category,
          phase: results[i].Phase,
        }
      }

      for (program in programs) {
        var cell = findLifeCycle(programs[program].phase) + " " + findCategory(programs[program].category);
        $(cell).append("<div>" + programs[program].name + "</div>").css("fontWeight", "600");
      }
    },
    error: function (data) {
      console.log("Error: "+ data);
    }
  });
});