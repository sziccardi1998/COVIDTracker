// test covid apis with basic ajax calls
var currentActive = "https://api.covid19api.com/live/country/united-states";

$.ajax({
    url: currentActive,
    method: "GET"
}).then(function(response){
    console.log(response);
});

var historicalCases = "https://covid-api.mmediagroup.fr/v1/history?country=UnitedStates";

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

// get user location from browser
function getLocation() {
    if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // display a message about using a browser with geolocation
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    // pass to function that uses ajax call and geolocater to find the users country
    reverseGeoCode(lat, lon);
}

function reverseGeoCode(lat, lon){
    var locationIQ = "https://us1.locationiq.com/v1/reverse.php?key=pk.d153eede84e6d6d8954c160de6babc21&lat=" + lat + "&lon=" + lon + "&format=json";
    $.ajax({
        url: locationIQ,
        method: "GET"
    }).then(function(response){
        console.log(response);
        var userCountry = response.address.country;
    })
}