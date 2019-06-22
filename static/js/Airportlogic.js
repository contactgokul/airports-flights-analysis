// Creating map object
//var map = L.map("map", {
//  center: [40.4258686, -86.9080655],
//  zoom: 4,
//  layers: [streetmap, markers]
//});



// Initialize all of the LayerGroups we'll be using
var layers = {
  VERY_HIGH: new L.LayerGroup(),
  EMPTY: new L.LayerGroup(),
  LOW: new L.LayerGroup(),
  NORMAL: new L.LayerGroup(),
  OUT_OF_ORDER: new L.LayerGroup()
};

// Create the map with our layers
//var map = L.map("map", {
//  center: [40.73, -86.9080655],
//  zoom: 4,
//  layers: [
//    layers.COMING_SOON,
//    layers.EMPTY,
//    layers.LOW,
//    layers.NORMAL,
//    layers.OUT_OF_ORDER
//  ]
//});

// Adding tile layer
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});


//.addTo(map);

//var link = "http://data.beta.nyc//dataset/0ff93d2d-90ba-457c-9f7e-39e47bf2ac5f/resource/" +
//"35dd04fb-81b3-479b-a074-a27a37888ce7/download/d085e2f8d0b54d4590b1e7d1f35594c1pediacitiesnycneighborhoods.geojson";
airportfile="static/data/airports.json";
//flightdata="static/data/flights_data.json";
flightdata="static/data/airlines_grouped.csv";
// Add our 'lightmap' tile layer to the map
//streetmap.addTo(map);

// Create an overlays object to add to the layer control
//var overlays = {
//  "Very High": layers.VERY_HIGH,
//  "High Traffic": layers.HIGH,
//  "Norml Traffic": layers.NORMAL,
//  "Low": layers.LOW,
//  "Very Low": layers.VERY_LOW
//};


// Create a control for our layers, add our overlay layers to it
//L.control.layers(null, overlays).addTo(map);

// Initialize an object containing icons for each layer group
//var icons = {
//  VERY_HIGH: L.ExtraMarkers.icon({
//    icon: "ion-settings",
//    iconColor: "white",
//    markerColor: "yellow",
//    shape: "star"
//  }),
//  HIGH: L.ExtraMarkers.icon({
//    icon: "ion-android-bicycle",
//    iconColor: "white",
//    markerColor: "red",
//    shape: "circle"
//  }),
//  NORMAL: L.ExtraMarkers.icon({
//    icon: "ion-minus-circled",
//    iconColor: "white",
//    markerColor: "blue-dark",
//    shape: "penta"
//  }),
//  LOW: L.ExtraMarkers.icon({
//    icon: "ion-android-bicycle",
//    iconColor: "white",
//    markerColor: "orange",
//    shape: "circle"
//  }),
//  VERY_LOW: L.ExtraMarkers.icon({
//    icon: "ion-android-bicycle",
//    iconColor: "white",
//    markerColor: "green",
//    shape: "circle"
//  })
//};

function stationStatus(destinationCount) {
  return destinationCount > 200 ? "VERY HIGH":
      destinationCount > 150 ? "HIGH":
        destinationCount > 100 ? "NORMAL":
          destinationCount > 50 ? "LOW":
            "VERY LOW"; // <= 1 default
}
// Grabbing our GeoJSON data..

// Create a new marker cluster group
var markers = L.markerClusterGroup();
var all_flightsdata;

  d3.csv(flightdata, function(datafl){
    all_flightsdata =  datafl;       
    
});

d3.json(airportfile , function(dataap) {

    for (var i = 0; i < dataap.length; i++) {
      var destinationCount = 'No Data';
      if (dataap[i].country == "United States" ) {
          
          for (var j = 0; j < all_flightsdata.length; j++) {
                //console.log("Airport file code : " +  dataap[i].code);
                

            if (dataap[i].code == all_flightsdata[j].Origin ) {
                //console.log("All Flights file code : " +  all_flightsdata[j].Origin);
                destinationCount = all_flightsdata[j].Destination;
                
                //define icon based on destination count range
                stationStatusCode = stationStatus(destinationCount);

                  // Update the station count
                // Create a new marker with the appropriate icon and coordinates
//                  var newMarker = L.marker([dataap[i].lat, dataap[i].lon ], {
//                    icon: icons[stationStatusCode]
//                  });

                  // Add the new marker to the appropriate layer
//                  newMarker.addTo(layers[stationStatusCode]);
//                  newMarker.bindPopup(  dataap[i].name + "<hr> City  :" + dataap[i].city+ "<br> State   : " + dataap[i].state + "<br> Destination Flights  :" + destinationCount  );
              
              //  console.log(" destinationCount : " + all_flightsdata[j].Destination);
                markers.addLayer(L.marker([dataap[i].lat, dataap[i].lon ])
                        .bindPopup(  dataap[i].name + "<hr> City  :" + dataap[i].city+ "<br> State   : " + dataap[i].state + "<br> Destination Flights  :" + destinationCount  ));

                
            }
              
           }
        
        
        }
    
    }

  // Add our marker cluster layer to the map
 // map.addLayer(markers); 


});

// Add our marker cluster layer to the map
//  map.addLayer(markers); 

// Define a baseMaps object to hold our base layers
var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Light Map" : lightmap
};

var overlayMaps = {
  "Airports cluster": markers
};
// Creating map object
var map = L.map("map", {
  center: [40.4258686, -86.9080655],
  zoom: 4,
  layers: [streetmap, markers]
});
// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(map);