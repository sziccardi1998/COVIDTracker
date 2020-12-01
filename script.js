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
var clearBtn = $("#clearBtn");
var countryText = $("#countryText");
var deathsEle = $("#deaths");
var deathRateEle = $("#deathRate");
var recovRateEle = $("#recovRate");
var infRateEle = $("#infRate");
var flagEle = $("#flag");
var countryInputEle = $("#countryInput");
var searchBtnEle = $("#searchBtn");
var buttonListEle = $("#buttonList");
var storageIndex = 0;

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
        createButton(userCountry);
        countryMatch(userCountry);
    })
}

getLocation();

// create function that looks for country match
function countryMatch(searchTerm) {
    var allCountries = "https://api.covid19api.com/countries";
    var currentCountry = "";
    $.ajax({
        url: allCountries,
        method: "GET"
    }).then(function(response){
        for(var i = 0; i<response.length; i++){
            if(response[i].Country === searchTerm){

                countryText.text(" " + response[i].Country);
                
                console.log(response[i]);
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
            alert("Input does not match an entry in our data. Please use proper spelling and capitalization.");
        }
        
        activeSearch(currentCountry);

    })
}

searchBtn.on("click", function(event){
    event.preventDefault();
    var newSearch = countryInputEle.val();
    console.log(newSearch);
    countryMatch(newSearch);
    createButton(newSearch);
})

// Clears local history and buttons rendered from local storage
clearBtn.click(function () {
    localStorage.clear();
    location.reload();
})

// search when button is clicked
$(document).on("click", ".is-primary", function(event){
    event.stopPropagation();
    var countrySearch = $(this).attr("id");
    countryMatch(countrySearch);
})

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
            deathRateEle.append(" " + deathRate.toFixed(1) + "%");
            var recoveryRate = (recoveredTotal/confirmedCases)*100;
            recovRateEle.append(" " + recoveryRate.toFixed(1) + "%");


            // Giphy Danger Level
            var apiKey = "?api_key=HT7rC7MrQFuW2AoLBTsE8CabD7yuhHXN";
            var gifDangerLow  = "XbxZ41fWLeRECPsGIJ"; // little girl thumbs up
            var gifDangerMed  = "lMm1GKkThcWM5dvI28"; // caution tape
            var gifDangerHigh = "LpkLWXTp0v0qy70xPp"; // Steve Irwin "Danger Danger"
            var gifID;

            if (deathRate <= 5) {
                gifID = gifDangerLow;
            }

            else if (deathRate <= 10 && deathRate > 5) {
                gifID = gifDangerMed;
            }

            else if (deathRate > 10) {
                gifID = gifDangerHigh;
            }

            var queryURL = "https://api.giphy.com/v1/gifs/"+ gifID + apiKey;

                $.ajax({
                    url: queryURL, method: "GET"
                }).then(function (gif) {
                    //console.log(gif);

                    var gifEl = $("#dangerGif");
                    var gifSource = gif.data.images.original.url;
                    //console.log(gifSource);
                    gifEl.attr("src", "");
                    gifEl.attr("src", gifSource);
                    //console.log(gifEl);
                });
        }); 
    }
}

function governmentAction() {
    var govAction = "https://covidtrackerapi.bsg.ox.ac.uk/api/v2/stringency/date-range/2020-04-29/2020-05-06";
    $.ajax({
        url: govAction,
        method: "GET"
    }).then(function(response){
        console.log(response);
    })
}

governmentAction();

// create function to handle addition of buttons of past searches
function createButton(searchTerm){
    // if search is not an empty string create and append the button
    console.log(searchTerm);
    if(searchTerm !== ""){
        // create button and append it to the button list
        var newButton = $("<button>");
        newButton.addClass("searchBtn").addClass("button").addClass("is-primary").addClass("my-2").addClass("px-1");
        newButton.attr("id", searchTerm);
        newButton.text(searchTerm);
        buttonListEle.append(newButton);
        buttonListEle.append("<br>")
        // send button to local storage
        localStorage.setItem(storageIndex, searchTerm);
        storageIndex++;
    }
}

// retrieve stored buttons from localStorage
function retrieveButtons(){
    if(localStorage !== null){
    
        for(var i=0; i<localStorage.length; i++){
        var storedButton = localStorage.getItem(i);
        createButton(storedButton);
        }
    }
}

retrieveButtons();