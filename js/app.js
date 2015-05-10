$(document).ready(function(){

     
	$("#search").submit(function(event){
		$('#event-list').html('');
		$('#search-results').html('');
		event.preventDefault();
		var city = $("#location").val();
        var yelpTerm = $("#yelp-search").val();
        
        //set a default value for yelp search term
        if(yelpTerm == ''){
        	yelpTerm = "restaurants";
        } 
        
		if (city == ''){
			$('.error').show();
		}
		else{
			$('.error').hide();

			getRequest(city, yelpTerm);
		}
		
        
        
	})

	
});


//get event info form last.fm api
var getRequest = function(city, terms){

	var apiKey = "2565e9dfd67470ca4cfef71af08d9279";
	var city = city;
	var url = "http://ws.audioscrobbler.com/2.0/";
	var search = url + "?method=geo.getevents&location=" + city + "&distance=50&limit=20&api_key=" + apiKey + "&format=json";

	var result = $.ajax({
		url: search,
		dataType: "json",
		type: "GET",

	})
	.done(function(result){
        
        //show number of concerts in area in search-results
        if (result.events === undefined){
        	$('#search-results').html(showSearchResults(0));
        }
        else
        {
        	$('#search-results').html(showSearchResults(result.events.event.length));
        };
        
 
        
		
		
		$.each(result.events.event, function(key, value){
			//get latitude and longitutde of venue to pass to yelp api
			var venueLatitude = value.venue.location['geo:point']['geo:lat'];
			var venueLongitude = value.venue.location['geo:point']['geo:long'];
	        // console.log(value.venue.name + venueLatitude + " " + venueLongitude);
	        var venue = value.venue.name;
	        
	        //call to yelp api to get businesses near venue
	        getYelp(venueLatitude, venueLongitude, city, venue, terms, key);
           	//add last.fm event info to page
			$('.results-container #event-list').append(showEventInfo(value));
			// $('.results-container #event-list').append(showInTheArea(busniess));
			// showInTheArea(businesses);
			
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		console.log(error);
	});
};

//function to call yelp api
var getYelp = function(lat, lon, city, venue, term, eventIndex){
     
    var auth = {
		consumerKey: "yKyfPqeZJWNE2xRgWZoq0Q",
		consumerSecret: "NwfAzqthyOenVj_ZsKuMHUvsmTs",
		accessToken: "r2fInMUZfXpV3nSqi18_63R9PtcZaTNk",
		accessTokenSecret: "1H0fLXK8wwolBQqKXTOFAip7hxw",
		serviceProvider: {
			signatureMethod: "HMAC-SHA1"
		}
	};
	var terms = term;
	var near = city;
	var lat_long = lat + "," + lon;
	var accessor = {
	  consumerSecret: auth.consumerSecret,
	  tokenSecret: auth.accessTokenSecret
	};
	parameters = [];
	parameters.push(['term', terms]);
	// parameters.push(['location', near]);
	parameters.push(['ll', lat_long]);
	parameters.push(['radius_filter', '400']);
	parameters.push(['limit', '5']);
	parameters.push(['callback', 'cb']);
	parameters.push(['oauth_consumer_key', auth.consumerKey]);
	parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
	parameters.push(['oauth_token', auth.accessToken]);
	parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
	var message = {
	  'action': 'http://api.yelp.com/v2/search',
	  'method': 'GET',
	  'parameters': parameters
	};
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);
	var parameterMap = OAuth.getParameterMap(message.parameters);
	parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
	
	
	
	$.ajax({
	  'url': message.action,
	  'data': parameterMap,
	  'cache': true,
	  'dataType': 'jsonp',
	  // 'jsonpCallback': 'cb',
	   success: function(data, textStats, XMLHttpRequest) {
	   
	    //array for business near event
	   	var business = [];
	    // $('.results-container .event-container').append(showInTheArea(data));
	    
	    $.each(data.businesses, function(key, value){
	    	business.push(value.name);

	    	
	    });

	    //call to function to handle busniess array
	  // console.log(venue);
	  showInTheArea(business, eventIndex, data);
	    
	  },
	  error: function(jqHHR, textStats, errorThrown){
	  		console.log(errorThrown);

	  }

	});
	
	
};	

//return message to display how many concerts the call last.fm returned
var showSearchResults = function(numConcerts){
	var results = "";
	if(numConcerts == undefined){
		results += "There are <strong>0</strong> concerts near you tonight";
	}
	else {
		 results += 'There are <strong>' + numConcerts + '</strong> concerts near you tonight';
	}
	
	return results
	

}

var showEventInfo = function(data){
	
	
	var eventDiv = $('.templates .events').clone();
	var titleElem = eventDiv.find('.title');
	// titleElem.text(data.title);
    
    titleElem.attr("href", data.url).text(data.artists.headliner);
   
    
	var venueElem = eventDiv.find('.venue');
	venueElem.text(data.venue.name);
    
    var eventPic = eventDiv.find('.event-pic img');
    var pic = data.image[1]["#text"];
    if (pic == ""){
    	eventPic.attr('src', data.venue.image[1]["#text"]);
    }
    else{
    	 eventPic.attr('src', data.image[1]["#text"]);
    }
   
    // console.log(data.image[2]["#text"]);
	var venueLocationElem = eventDiv.find('.venue-location');

	venueLocationElem.text(data.venue.location.street + " " + data.venue.location.city);



	return eventDiv;
	
	
};

var showInTheArea = function(data, eventIndex, yelpData){
	
	var placesDiv = $('.templates .places-container').clone();
	var places = placesDiv.find('.places');
	$.each(data, function(key, value){
		
		places.append('<li><a href="' + yelpData.businesses[key].url + '" target="_blank">' + value + '</li></a>');
	});
	$('#event-list .event-container').eq(eventIndex).append(placesDiv);
};	