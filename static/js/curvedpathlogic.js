// Create our initial map object
// Set the longitude, latitude, and the starting zoom level
var map = L.map("map").setView([39.8283, -98.5795], 5);

// Add a tile layer (the background map image) to our map
// Use the addTo method to add objects to our map
 L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
   maxZoom: 18,
   id: "mapbox.streets",
   accessToken: API_KEY
 }).addTo(map);

//Read the first Json file containing Airport code and coordinates
d3.json("static/data/usAirports.json", function(response1) {
    for (var i = 0; i < response1.length; i++) {
       if (response1[i].country == "United States") {
			var lat = response1[i].lat;
			var long = response1[i].lon;
			//set the new icon size
			var icon = L.Icon.extend({
				options: {
					iconSize: [20, 20]
				}
			});
			//function to locate the new icon
			function createIcons() {
				//Icons_start
				flight_icon = new icon({iconUrl: 'static/images/flight_icon.png'});
				marker.setIcon(flight_icon);
				marker.update();
			}
		   //Set the marker
		   var marker = L.marker([lat,long], {
						}).addTo(map)
						  .bindPopup("<b>" + "Airport Code: " + "</b>" + response1[i].code + "<br>" + 
						             "<b>" + "Airport Name: " + "</b>" + response1[i].name + "<br>" + 
									 "<b>" + "City: "         + "</b>" + response1[i].city + "<br>" +
									 "<b>" + "State: "        + "</b>" + response1[i].state);
			//Call the new icon function						 
			createIcons();
			marker.code = response1[i].code;
			marker.lat = response1[i].lat;
			marker.lon = response1[i].lon;
			marker.on("click",function(){
			//use the new icon
			marker.setIcon(flight_icon);
			var airport_code = this.code;
			var origin_lat = this.lat;
			var origin_lon = this.lon;				
			//Read the second file
				d3.json("static/data/flights_data.json", function(response2) {
					//create for loop
					for (var j = 0; j < response2.length; j++) {
						//compare airport_code with 2nd file airport origin code

						if (response2[j].Origin == airport_code) {
						//get the destination lat/lon
						for (var k in response1) {
							if (response1[k].code == response2[j].Destination) {
								console.log("airport_code: " + airport_code);
								console.log("response1[i].lat: " + origin_lat);
								console.log("response1[i].lon: " + origin_lon);
								//convert string to decimal
								var x1y1 = [parseFloat(origin_lat), parseFloat(origin_lon)];
							    var x2y2 = [parseFloat(response1[k]['lat']), parseFloat(response1[k]['lon'])];
								
								//---Code for curved line
									var latlngs = [];
								
									var latlng1 = x1y1,
									  latlng2 = x2y2;

									var offsetX = latlng2[1] - latlng1[1],
									  offsetY = latlng2[0] - latlng1[0];

									var r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)),
									  theta = Math.atan2(offsetY, offsetX);

									var thetaOffset = (3.14 / 10);

									var r2 = (r / 2) / (Math.cos(thetaOffset)),
									  theta2 = theta + thetaOffset;

									var midpointX = (r2 * Math.cos(theta2)) + latlng1[1],
									  midpointY = (r2 * Math.sin(theta2)) + latlng1[0];

									var midpointLatLng = [midpointY, midpointX];

									latlngs.push(latlng1, midpointLatLng, latlng2);

									var pathOptions = {
									color: '#111111',
									weight: 2
									}
									
									var curvedPath = L.curve(
									  [
										'M', latlng1,
										'Q', midpointLatLng,
										latlng2
									  ], pathOptions).addTo(map);
									  
									//To auto refresh the page
									//setTimeout(location.reload.bind(location), 10000);
								
								//---End of curved line
								}	
							}
						}
					}
				});
			});
	   }
   }
});