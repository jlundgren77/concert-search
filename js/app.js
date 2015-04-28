$(document).ready(function(){
	$("#search").submit(function(event){
		event.preventDefault();
		var city = $("#location").val();
        getRequest(city);

	})

	
});

var getRequest = function(city){
	
	var apiKey = "2565e9dfd67470ca4cfef71af08d9279";
	var city = city;
	var url = "http://ws.audioscrobbler.com/2.0/";
	var search = url + "?method=geo.getevents&location=" + city + "&distance=30&api_key=2565e9dfd67470ca4cfef71af08d9279&format=json";

	var result = $.ajax({
		url: search,
		dataType: "json",
		type: "GET",
	})
	.done(function(result){

		
		$.each(result.events.event, function(key, value){
			var venueLatitude = value.venue.location['geo:point']['geo:lat'];
			var venueLongitude = value.venue.location['geo:point']['geo:long'];
	        console.log(value.venue.name + venueLatitude + " " + venueLongitude);
	        getYelp(venueLatitude, venueLongitude, city);
			$('.results-container #event-list').append(showEventInfo(value));
		});
	})

};

var getYelp = function(lat, lon, city){
     
     
	
	var auth = {
		consumerKey: "yKyfPqeZJWNE2xRgWZoq0Q",
		consumerSecret: "NwfAzqthyOenVj_ZsKuMHUvsmTs",
		accessToken: "r2fInMUZfXpV3nSqi18_63R9PtcZaTNk",
		accessTokenSecret: "1H0fLXK8wwolBQqKXTOFAip7hxw",
		serviceProvider: {
			signatureMethod: "HMAC-SHA1"
		}
	};
	var terms = 'food';
	var near = city;
	var lat_long = lat + "," + lon;
	var accessor = {
	  consumerSecret: auth.consumerSecret,
	  tokenSecret: auth.accessTokenSecret
	};
	parameters = [];
	parameters.push(['term', terms]);
	parameters.push(['location', near]);
	parameters.push(['cll', lat_long]);
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
	// console.log(parameterMap);
	$.ajax({
	  'url': message.action,
	  'data': parameterMap,
	  'cache': true,
	  'dataType': 'jsonp',
	  'jsonpCallback': 'cb',
	 //  'success': function(data, textStats, XMLHttpRequest) {
	 //    // console.log(data.businesses);
	 //    // var output = prettyPrint(data);
	 //    // $.each(data.businesses, function(key, value){
	 //    // 	console.log(data.businesses);
	 //    // 	// showInTheArea(value);
	 //    // });
		// for(business in data.businesses)
		// {
		// 	console.log(business);
		// }
	   
	 //  }
	})
	.done(function(data){
		console.log(data + "for: " + lat + lon);
	})
};	
	
	


var showEventInfo = function(data){
	
	
	var eventDiv = $('.templates .event-container').clone();
	var artistElem = eventDiv.find('.artist');
	artistElem.text(data.artists.headliner);

	var venueElem = eventDiv.find('.venue');
	venueElem.text(data.venue.name);
    
    
	var venueLocationElem = eventDiv.find('.venue-location');

	venueLocationElem.text(data.venue.location.street + " " + data.venue.location.city);



	return eventDiv;
	
	
};

var showInTheArea = function(data){
	var eventDiv = $('.templates .event-container').clone();
	var placesElem = eventDiv.find('.places');
	var place = "<li class='business'>" + data.name + "</li>";
	console.log(place);
};

