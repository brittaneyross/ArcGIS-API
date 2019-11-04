require([
  'esri/map',
  'esri/layers/FeatureLayer',
  'dojo/on',
  'esri/InfoTemplate'
], function (
	Map, FeatureLayer, on, InfoTemplate
) {
   var new_data =  [{"P0010001":"4779736","P0050010":"185602","NAME":"Alabama","state":"01"},{"P0010001":"710231","P0050010":"39249","NAME":"Alaska","state":"02"}];


  var map = new Map("map", {
    center: [-90.1978, 38.6272],
    zoom: 6,
    basemap: "topo"
  });
  
  var infoTemplate = new InfoTemplate("Attributes", "${*}");
  var layer = new FeatureLayer('https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2015/MapServer/82', {
  outFields: '*',
  infoTemplate: infoTemplate
  });
  map.addLayer(layer);
  
  on(map, 'update-end', function() {
    for(var i = 0; i < layer.graphics.length; i++) {
      for(var j = 0; j < new_data.length; j++) {
        if(layer.graphics[i].attributes.BASENAME == new_data[j].NAME) {
        	console.log('found item! updating NEWFIELD with value', new_data[j].P0010001);
          layer.graphics[i].attributes.CENSUS = new_data[j].P0010001;
        }
      }
    }
  }.bind(this));
});
