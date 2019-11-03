var app;

require([
  // ArcGIS
  "esri/map",
  "esri/dijit/Search",
  "dojo/query",
  "esri/layers/FeatureLayer",

  // Calcite Maps
  "calcite-maps/calcitemaps-v0.10",

  // Bootstrap
  "bootstrap/Collapse",
  "bootstrap/Dropdown",
  "bootstrap/Tab",

  "dojo/domReady!"
], function(Map, Search, query, FeatureLayer, CalciteMaps) {

  // App
  app = {
    map: null,
    basemap: "dark-gray",
    center: [-88.1285691261062, 41.793264502709576], // lon, lat
    zoom: 9,
    initialExtent: null,
    searchWidgetNav: null,
    searchWidgetPanel: null
  }

  // Map
  app.map = new Map("mapViewDiv", {
    basemap: app.basemap,
    center: app.center,
    zoom: app.zoom
  });

  var cmapCounties = new FeatureLayer("http://services5.arcgis.com/LcMXE3TFhi1BSaCY/arcgis/rest/services/MPOcounties_CMAP_201409/FeatureServer")
  //map.add(cmapCounties);

  var nddPoints = new FeatureLayer("https://services5.arcgis.com/GwzfxPSYbDxtMoCu/arcgis/rest/services/points/FeatureServer")
    //outFields: ['*'],
    //opacity: 0.8,
    //renderer: renderer,
    //popupTemplate: template
  //)
  //map.add(nddPoints)
  app.map.addLayer(cmapCounties)

  app.map.on("load", function(){
    app.initialExtent = app.map.extent;

  })

  // Search
  app.searchDivNav = createSearchWidget("searchNavDiv");
  app.searchWidgetPanel = createSearchWidget("searchPanelDiv");

  function createSearchWidget(parentId) {
    var search = new Search({
      map: app.map,
      enableHighlight: false
      }, parentId);
    search.startup();
    return search;
  }

  // Basemaps
  query("#selectBasemapPanel").on("change", function(e){
    app.map.setBasemap(e.target.options[e.target.selectedIndex].value);
  });

  // Home
  query(".calcite-navbar .navbar-brand").on("click", function(e) {
    app.map.setExtent(app.initialExtent);
  })

});
