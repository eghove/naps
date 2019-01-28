//GLOBAL VARIABLES
//===============================================================
// url array for campsite info
var campURLarray = [];
var campURL = [];

var npsSearch;
var npsURL;
var nasalat;
var nasalon;
var z = 0;
var b = 0;
var y = 0;
var o;
var weatherlat;
var weatherlon;

//array that captures the latitude and longitude of each NPS returned from the initial NPS ajax call
let latLongParkData = [];

//array that will capture the imagre URLs from NASA for the park results page
let NASAImages = [];

// array that will capture the Park Names
var ParkNames = [];

// array that will capture the park description
var ParkDescription = [];

// this will be an array that will hold campsite objects for each park in order.
var CampsiteLocations = [];
var CampsiteNames = [];
var CampsiteDescription = [];
var CampsiteDirections = [];
var CampsiteWeather = [];
var CampsiteWater = [];
var CampsiteToilets = [];
var CampsiteShowers = [];



//EVENT LISTENERS
// ==============================================================
$(document).ready(function () {
    $("#accordion").accordion({
        collapsible: true,
        active: true
    });
    //console.log('ready')
    //checks to see if the user is authenticated
    authUserCheck();
    //on click listener for the logout button
    $('#Logout').on("click", function () {
        logOut();
    });
    $("#Search").on("click", function (event) {
        event.preventDefault();
        $("#MainContent").empty();
        $("#accordion").empty();
        npsSearch = $("#searchBox").val();

        campURLarray = [];
        campURL = [];

        npsURL = [];
        nasalat = [];
        nasalon = [];
        z = 0;
        b = 0;
        o = "";
        weatherlat = [];
        weatherlon = [];

        latLongParkData = [];

        NASAImages = [];

        ParkNames = [];
        ParkDescription = [];

        CampsiteLocations = [];
        CampsiteNames = [];
        CampsiteDescription = [];
        CampsiteDirections = [];
        CampsiteWeather = [];
        CampsiteWater = [];
        CampsiteToilets = [];
        CampsiteShowers = [];


        //prevents from searching an empty string
        if($('#searchBox').val() == ''){
                return false;
            } else {
                Search();
            }
        
        

    });



});

//FUNCTIONS
//===============================================================


// this function will tell all of the ajax what information to look up and will also reset the arrays each time it runs.
function Search() {

    $("#accordion").accordion("destroy")

    // this will catch the url for the campsites that will be passed into the campground ajax.
    

    // this will pick up the text from the input box

    npsURL = "https://developer.nps.gov/api/v1/parks?q=" + npsSearch + "&api_key=z3gukqYquzKbLQXkLJFI7OpTS88qyjCZV5DbjcHc";
    



    // initial ajax to the nps
    $.ajax({
        url: npsURL,
        method: "GET"
    }).then(function (response) {
        //console.log(response);
        // data retrieved from the park api
        var ParkData = response.data;
        // for loop to gather all relevant peices of info from the api and store them in arrays 
        for (var j = 0; j < ParkData.length; j++) {
            // campsite url, park names, and descriptions array push is done here
            campURLarray.push("https://developer.nps.gov/api/v1/campgrounds?q=" + ParkData[j].fullName + "&api_key=z3gukqYquzKbLQXkLJFI7OpTS88qyjCZV5DbjcHc");
            ParkNames.push(ParkData[j].fullName);
            ParkDescription.push(ParkData[j].description);

            //push the latitude and longitude string from the above response into latLongParkData array
            latLongParkData.push(ParkData[j].latLong);

            // this will be used as the DOM storage to be appended to the html
            var parkInfoWell = $("<div>");
            // first storing name of park

            parkInfoWell.addClass("container" + j);
            parkInfoWell.css("display", "none");
            parkInfoWell.append(
                "<div class = 'container'><div class = 'row'><div class = 'col-md-12'><div class='card'"
                + " style='background-color: rgb(250, 248, 248, 0.7); margin-top: 20px'><div class ='card-body'><h1>"
                + ParkData[j].fullName + "</h1><br><button class='back btn btn-default btn-sm'>Back</button><br><p>" + ParkData[j].description + "</p><br><br><div id='img" + j
                + "'></div><br><br><div id='weather" + j + "'></div><div class = 'accordions" + j + "'>" + "</div></div></div></div></div></div></div>"
            );

            parkInfoWell.css("text-align", "center");

            $("#MainContent").append(parkInfoWell);


            var displayParkName = $("<h3>" + ParkNames[j] + "</h3>");

            //for the click to learn more button    
            var displayParkDescription = $("<div><p>" + ParkDescription[j] + "</p><div id='secondbutton" + j + "'></div></div>");



            //appending everything to the accordion and invoking the accordion function
            $("#accordion").append(displayParkName).append(displayParkDescription)
            $(function () {
                //console.log("accordion")
                $("#accordion").accordion({
                    collapsible: true,
                    active: true
                });
            });

            var Buttons = $("<button>");
            Buttons.addClass("button");
            Buttons.attr("value", j);
            Buttons.append("Click Here For More Information");

            var FavButtons = $("<button>");
            FavButtons.addClass("favButtons");
            FavButtons.css("margin-left", "10px")
            FavButtons.attr("value", ParkNames[j]);
            FavButtons.append("Add This Park to Favorites!");


            $("#secondbutton" + j).append(Buttons);
            $("#secondbutton" + j).append(FavButtons);



        }
        //calls the function that parses the latitude and longitude into something the other APIs can use
        latLongParser();


        $(document).ready(function () {

            $(".button").on("click", function () {
                //console.log(this.value);
                o = this.value;
                $("#signin").css("display", "none");
                $("#favoritesBox").css("display", "none");
                $(".container" + o).css("display", "block");
                campURL = campURLarray[o];
                camping();
                nasalat = latLongParkData[o][0];
                nasalon = latLongParkData[o][1]
                NASAQuery(nasalat, nasalon);
                weatherlat = latLongParkData[o][0];
                weatherlon = latLongParkData[o][1];
                weatherQuery(weatherlat, weatherlon);
            });

            $(".back").on("click", function () {
                $("#signin").css("display", "block");
                $("#favoritesBox").css("display", "block");
                $(".container" + o).css("display", "none")
            });

            $(".favButtons").on("click", function () {
                //console.log(this.value)
                var favParks = $("<button>");
                favParks.addClass("favParks");
                favParks.css("margin", "10px")
                favParks.attr("value", this.value);
                favParks.append(this.value);

                $("#favorites").append(favParks);
                $(".favParks").on("click", function () {
                    npsSearch = this.value;
                    $("#MainContent").empty();
                    $("#accordion").empty();

                    campURLarray = [];
                    campURL = [];
            
                    npsURL = [];
                    nasalat = [];
                    nasalon = [];
                    z = 0;
                    b = 0;
                    o = "";
                    weatherlat = [];
                    weatherlon = [];
            
                    latLongParkData = [];
            
                    NASAImages = [];
            
                    ParkNames = [];
                    ParkDescription = [];
            
                    CampsiteLocations = [];
                    CampsiteNames = [];
                    CampsiteDescription = [];
                    CampsiteDirections = [];
                    CampsiteWeather = [];
                    CampsiteWater = [];
                    CampsiteToilets = [];
                    CampsiteShowers = [];
            
                    WeatherTemperature = [];
                    WeatherWind = [];
                    WeatherHumidity = [];
                    WeatherDescription = [];
            
            
            
                    Search();

                });
            });

            $("#clear").on("click", function () {
                $("#favorites").empty();
                
            });

            

        });

    });

    //console.log(ParkNames);
    // console.log(latLongParkData);

};

function camping() {
    // console.log("hi");
    $(".accordions" + o).empty()

    $.ajax({
        url: campURL,
        method: "GET"
    }).then(function (response) {
        var campData = response.data;
        // console.log("campdata:", campData);


        if (campData.length === 0) {
            $(".accordions" + o).append("<h3>No Campgrounds Found</h3>")
        } else {

            for (var c = 0; c < campData.length; c++) {
                CampsiteNames.push(campData[c].name);
                CampsiteDescription.push(campData[c].description);
                CampsiteDirections.push(campData[c].directionsUrl);
                CampsiteWeather.push(campData[c].weatherOverview);
                CampsiteWater.push(campData[c].amenities.potableWater[0]);
                CampsiteToilets.push(campData[c].amenities.toilets[0]);
                CampsiteShowers.push(campData[c].amenities.showers[0]);
                // console.log(CampsiteNames);

                var campsiteInfoWell = $("<div>");
                campsiteInfoWell.addClass("accordion")


                for (var v = 0; v < CampsiteNames.length; v++) {

                    campsiteInfoWell.append(
                        "<h3>" + CampsiteNames[v] + "</h3><div><p>" + "Description : " + CampsiteDescription[v] + "</p>"
                        + "<a href=" + CampsiteDirections[v] + " target='_blank'>" + "Directions" + "</a>" + "<p>"
                        + "Weather Overview : " + CampsiteWeather[v] + "</p><p>" + "Potable Water : "
                        + CampsiteWater[v] + "</p><p>" + "Toilets : " + CampsiteToilets[v] + "</p><p>"
                        + "Showers : " + CampsiteShowers[v] + "</p></div>"
                    )
                    // console.log("append camps")

                    $(".accordions" + o).append(campsiteInfoWell);

                }
                CampsiteNames = [];
                CampsiteDescription = [];
                CampsiteDirections = [];
                CampsiteWeather = [];
                CampsiteWater = [];
                CampsiteToilets = [];
                CampsiteShowers = [];
                $(".accordion").accordion({
                    collapsible: true,
                    active: true,
                    //makes the accordions expand
                    heightStyle: "content",
                });
            }
        }

    });
};





//weather Quaery API
function weatherQuery(latitude, longitude) {
    $("#weather" + o).empty()
    // open weather api key

    var weatherAPIkey = 'e0517042c4c62f6d8cc8a258ba9ed1b4';

    // open weather base url

    var weatherBaseURL = "https://api.openweathermap.org/data/2.5/weather?"

    let weatherLatitudeParam = latitude;

    let weatherLongtudeParam = longitude;

    // setting up the query url
    var weatherQueryURL = weatherBaseURL + "lat=" + weatherLatitudeParam + "&lon=" + weatherLongtudeParam + "&appid=" + weatherAPIkey;
    // console.log(weatherQueryURL);

    //the Ajax call
    $.ajax({
        url: weatherQueryURL,
        method: "GET"
    })
        .then(function (response) {
            //capture the temperature, convert it to F
            var temperature = (response.main.temp - 273.15) * 1.80 + 32;
            var temperature = temperature.toFixed(2);


            //capture the windspeed
            var windspeed = response.wind.speed;

            //capture the humidity
            var humidity = response.main.humidity;

            //weather description
            var weatherDescrip = "";
            weatherDescrip = response.weather[0].description;


            var WeatherWell = $("<table>");
            WeatherWell.addClass("table");

            WeatherWell.append(
                "<thead><tr><th scope='col'>Temperature</th><th scope='col'>Wind Speed</th><th scope='col'>Humidity</th><th scope='col'>Weather Description</th></tr></thead>" +
                "<tbody><tr><td>" + temperature + "F</td><td>" + windspeed + "mph</td><td>" + humidity + "%</td><td>" + weatherDescrip + "</td></tr></tbody>"
            )


            $("#weather" + o).append(WeatherWell);


            
        })
}

//basic NASA Satellinte Imagery API QUERY FUNCTION
function NASAQuery(latitude, longitude) {
    $("#img" + o).empty();
    //NASA API Key
    const NASAAPIKey = 'z3gukqYquzKbLQXkLJFI7OpTS88qyjCZV5DbjcHc';
    //base NASA Imagery API
    const NASABaseURL = 'https://api.nasa.gov/planetary/earth/imagery?';
    let longitudeParam = longitude;
    let latitudeParam = latitude;
    //setting up the query url
    let NASAQueryURL = NASABaseURL + 'lon=' + longitudeParam + '&lat=' + latitudeParam + '&api_key=' + NASAAPIKey;
    //console.log(NASAQueryURL);
    //the ajax call
    $.ajax({
        url: NASAQueryURL,
        method: "GET"
    })
        .then(function (response) {
            //sets the url for the image to NASAImageURL variables
            let NASAImages = response.url;
            //push the url for the image to the NASAImages array

            var imageWell = $("<div>");
            // throw in the src for the nasa images
            imageWell.html("<img src=" + NASAImages + ">");
            //used this console to make sure real images and fail images are showing up in the rigth places
           

            $("#img" + o).append(imageWell);
            

        })
        .fail(function (error) {
            //set up default image
            let defaultImageUrl = 'https://imgplaceholder.com/420x320/ff7f7f/333333/fa-image';
            //push the link to the default image to NASAImages array
            NASAImages = defaultImageUrl;

            //copied this code from the .then function above.
            var imageWell = $("<div>");
            // throw in the src for the nasa images
            imageWell.html("<img src=" + NASAImages + ">");
           

            $("#img" + o).append(imageWell);
            

        });
};

//latitute, longitude parser
//takes the latitude and longitude from the NPS API and turns it into a value the other APIs can use
function latLongParser() {
    for (var k = 0; k < latLongParkData.length; k++) {
        //set a itemToConvert to the latitude longitude string
        let itemToConvert = latLongParkData[k];
        //remove "lat:" from itemToConvert
        itemToConvert = itemToConvert.replace("lat:", "");
        //remove " long:" from itemToConvert (there is a space before 'long')
        itemToConvert = itemToConvert.replace(" long:", "");
        //turn the itemToConvert string to an array of 2 items
        itemToConvert = itemToConvert.split(",");
        //for loop that turns itemToConvert to values NASA API and OpenWeather API can use
        for (var l = 0; l < itemToConvert.length; l++) {
            //set latitude or longitude to the variable value
            let value = itemToConvert[l];
            //transform the string to a floating point decimal
            value = parseFloat(value);
            //transform the fp decimal above to a string with two decimals
            value = value.toFixed(2);
            //put the new converted value back into itemToConvert array
            itemToConvert[l] = value;
        }
        //replaces the items in the original latLongParkData array with the converted strings
        latLongParkData[k] = itemToConvert;
    }
};


//the function that will re-direct the user back to the login page if an account has not yet been created (self-invoking)
function authUserCheck() {
    var firebase = app_fireBase;
    var uid = null;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            uid = user.uid;
        } else {
            //redirect to login page
            uid = null;
            window.location.replace("login.html");
        }
    });


};
//logs the user out
function logOut() {
    firebase.auth().signOut();
};

