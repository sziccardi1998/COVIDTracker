// create variables to hold responses from ajax calls
var currentCountry = "";
var countryISO = "";
var todaysDate = new Date();
todaysDate = todaysDate.toISOString();
var yesterday = new Date();
yesterday.setDate(yesterday.getDate()-10);
yesterday = yesterday.toISOString();
console.log(yesterday);

// create variables to hold HTML elements
var countryInput = $("#countryInput");
var searchBtn = $("#searchBtn");
var deathsEle = $("#deaths");
var deathRateEle = $("#deathRate");
var recovRateEle = $("#recovRate");
var infRateEle = $("#infRate");
var flagEle = $("#flag");

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
                var imageLocation = "./flagImages/" + countryISO + ".JPG";
                flagEle.attr("src", imageLocation);
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
            method: "GET",
            timeout: 0,
        }).then(function(response){
            deathsEle.text("Number of Covid-19 deaths:");
            deathRateEle.text("Covid-19 death rate:");
            recovRateEle.text("Recovery rate:");
            var activeCases = 0;
            var confirmedCases = 0;
            var deathsTotal = 0;
            var recoveredTotal = 0;
            console.log(response);
            // create loop that checks all array values and counts active, confirmed, deaths, recovered
            for(var i = 0; i<response.length; i++){
                if(response[i].Date === "2020-05-06T00:00:00Z"){
                    activeCases = activeCases + response[i].Active;
                    confirmedCases = confirmedCases + response[i].Confirmed;
                    deathsTotal = deathsTotal + response[i].Deaths;
                    recoveredTotal = recoveredTotal + (response[i].Confirmed - response[i].Active - response[i].Deaths);
                }
            }
            deathsEle.append(" " + deathsTotal);
            var deathRate = (deathsTotal/confirmedCases)*100;
            deathRateEle.append(" " + deathRate + "%");
            var recoveryRate = (recoveredTotal/confirmedCases)*100;
            recovRateEle.append(" " + recoveryRate + "%");
        }); 
    }
}
