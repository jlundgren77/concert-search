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
			
			$('.results-container .event-list').append(showEventInfo(value));
		});
	})

};

var showEventInfo = function(data){
	console.log(data);
	
	var eventDiv = $('.templates .event-container').clone();
	var artistElem = eventDiv.find('.artist');
	artistElem.text(data.artists.headliner);

	var venueElem = eventDiv.find('.venue');
	venueElem.text(data.venue.name);
    
    
	var venueLocationElem = eventDiv.find('.venue-location');
	
	venueLocationElem.text(data.venue.location.street + " " + data.venue.location.city);

	return eventDiv;
	// console.log(data.artists.headliner);
	// var artistElem = newEvents.find('.artist');
	// artistElem.text(data.artists.headliner);
	// console.log(artistElem)
	// return newEvents;
	
};
// var getData = function(results){
// 	var artists = results.artists;
// 	var headliner = artists.headliner;
// 	var venue = results.venue.name;
// 	var venue_city = results.venue.location.city
// 	var venue_street = results.venue.location.street;
// 	var event_url = results.url;
// 	console.log(event_url);
// }
// 
