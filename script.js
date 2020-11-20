// test covid apis with basic ajax calls
var currentActive = "https://api.covid19api.com/live/country/united-states";

$.ajax({
    url: currentActive,
    method: "GET"
}).then(function(response){
    console.log(response);
});

var historicalCases = "https://covid-api.mmediagroup.fr/v1/history?country=UnitedStates&status=Confirmed";

$.ajax({
    url: historicalCases,
    method: "GET"
}).then(function(response){
    console.log(response);
});

var govAction = "https://covidtrackerapi.bsg.ox.ac.uk/api/v2/stringency/date-range/{2020-01-01}/{2020-11-19}";

$.ajax({
    url: govAction,
    method: "GET",
}).then(function(response){
    console.log(response);
})