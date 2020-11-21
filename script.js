// create variables to hold responses from ajax calls
var currentCountry = "";
var countryISO = "";

// commented out section was to get historical case data but is being blocked by CORS
/* var historicalCases = "https://covid-api.mmediagroup.fr/v1/history?country=US&status=Confirmed";

$.ajax({
    url: historicalCases,
    method: "GET"
}).then(function(response){
    console.log(response);
}); */ 

var govAction = "https://covidtrackerapi.bsg.ox.ac.uk/api/v2/stringency/date-range/2020-01-01/2020-11-11";

$.ajax({
    url: govAction,
    method: "GET"
}).then(function(response){
    console.log(response);
});

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

// use passed coordinates to find location
function reverseGeoCode(lat, lon){
    var locationIQ = "https://us1.locationiq.com/v1/reverse.php?key=pk.d153eede84e6d6d8954c160de6babc21&lat=" + lat + "&lon=" + lon + "&format=json";
    $.ajax({
        url: locationIQ,
        method: "GET"
    }).then(function(response){
        console.log(response);
        var userCountry = response.address.country;
        console.log(userCountry);
        countryMatch(userCountry);
    })
}

getLocation();

// create function that looks for country match
function countryMatch(searchTerm) {
    var allCountries = "https://api.covid19api.com/countries";

    $.ajax({
        url: allCountries,
        method: "GET"
    }).then(function(response){
        for(var i = 0; i<response.length; i++){
            if(response[i].Country === searchTerm){
                currentCountry = response[i].Slug;
                console.log(currentCountry);
                countryISO = response[i].ISO2;
                i = response.length;
            }
        }
        if(currentCountry === ""){
            //write message that country does not match an entry in the data
        }
        activeSearch(currentCountry);
    })
}

// function that builds search for 
function activeSearch(searchTerm){
    if (searchTerm !== ""){
        var currentActive = "https://api.covid19api.com/live/country/" + searchTerm;
        $.ajax({
            url: currentActive,
            method: "GET"
        }).then(function(response){
            console.log(response);
        }); 
    }
}
