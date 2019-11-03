var app;

require([
  // ArcGIS
  "esri/map",
  "esri/dijit/Search",
  "dojo/query",
  "esri/layers/FeatureLayer",
  "esri/InfoTemplate",
  "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
  "esri/renderers/UniqueValueRenderer", "esri/Color",

  // Calcite Maps
  "calcite-maps/calcitemaps-v0.10",

  // Bootstrap
  "bootstrap/Collapse",
  "bootstrap/Dropdown",
  "bootstrap/Tab",

  "dojo/domReady!"
], function(Map, Search, query, FeatureLayer, InfoTemplate,
  SimpleLineSymbol, SimpleFillSymbol,
  UniqueValueRenderer, Color, CalciteMaps) {



  // App
  app = {
    map: null,
    basemap: "dark-gray",
    center: [-88.1285691261062, 41.793264502709576], // lon, lat
    zoom: 9,
    initialExtent: null,
    searchWidgetNav: null,
    searchWidgetPanel: null,
    //layers:[cmapCounties]
  }

  // Map
  app.map = new Map("mapViewDiv", {
    basemap: app.basemap,
    center: app.center,
    zoom: app.zoom,
  });

  function addBaseLayers() {
    var cmapCounties = new FeatureLayer("https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2010/MapServer/100", {
      mode: FeatureLayer.MODE_ONDEMAND,
      outFields: ["*"],
    })
    app.map.addLayer(cmapCounties);

    var nddPointsLyr = new FeatureLayer("https://services5.arcgis.com/GwzfxPSYbDxtMoCu/arcgis/rest/services/points/FeatureServer", {
      mode: FeatureLayer.MODE_ONDEMAND,
      outFields: ["*"],
    })

    app.map.addLayer(nddPointsLyr)
  }

  app.map.on("load", function() {
    app.initialExtent = app.map.extent;
    //app.map.addLayer(cmapCounties)

  })

  app.map.on("load", addBaseLayers)


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
  query("#selectBasemapPanel").on("change", function(e) {
    app.map.setBasemap(e.target.options[e.target.selectedIndex].value);
  });

  // Home
  query(".calcite-navbar .navbar-brand").on("click", function(e) {
    app.map.setExtent(app.initialExtent);
  })

});
