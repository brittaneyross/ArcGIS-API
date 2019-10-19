var view;

//Require statements passes in esri map and map view
//Also passing in function calls Map and MapView
//casing does matter!
//all require statements can be find in each classes documentation

//Flow to add layers
// Load Module - Require statement (see class documentation)
// create the layer - instantiate (ie var name = new layer)
// set properties
// add it to your Map

require(["esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "dojo/domReady!"
], function(Map, MapView, FeatureLayer) {
  //the names of the functoions can be named anything
  //Instantiat the Map
  //Create the new map
  //the map is the container of the map
  var map = new Map({
    //set basemap to one of the available online
    basemap: "streets"
  });
  //view is how you view the Map
  //multiple view can reference the same map but in a different location/extent
  //Map is like the backyard and the view of the map is like the window from your house
  //each window can have a different view of the same map
  view = new MapView({
    //all properties set are directly off of constructor in 4x
    //all properties can be set when instantiating the map view
    container: "viewDiv",
    map: map,
    zoom: 9,
    center: [-88.1285691261062,41.793264502709576]
  });
});
