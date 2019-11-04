var map;

require([
  "esri/map",
  "esri/dijit/Search",
  "dojo/query",
  "esri/tasks/GeometryService",

  "esri/layers/ArcGISTiledMapServiceLayer",
  "esri/layers/FeatureLayer",

  "esri/Color",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",

  "esri/dijit/editing/Editor",
  "esri/dijit/editing/TemplatePicker",

  "esri/config",
  "dojo/i18n!esri/nls/jsapi",

  "dojo/_base/array", "dojo/parser", "dojo/keys",

  "dijit/layout/BorderContainer", "dijit/layout/ContentPane",

  // Calcite Maps
  "calcite-maps/calcitemaps-v0.10",

  // Bootstrap
  "bootstrap/Collapse",
  "bootstrap/Dropdown",
  "bootstrap/Tab",

  "dojo/domReady!"
], function(
  Map, Search, query, GeometryService,
  ArcGISTiledMapServiceLayer, FeatureLayer,
  Color, SimpleMarkerSymbol, SimpleLineSymbol,
  Editor, TemplatePicker,
  esriConfig, jsapiBundle,
  arrayUtils, parser, keys
) {
  parser.parse();

  // snapping is enabled for this sample - change the tooltip to reflect this
  jsapiBundle.toolbars.draw.start = jsapiBundle.toolbars.draw.start + "<br>Press <b>ALT</b> to enable snapping";

  // refer to "Using the Proxy Page" for more information:  https://developers.arcgis.com/javascript/3/jshelp/ags_proxy.html
  esriConfig.defaults.io.proxyUrl = "/proxy/";

  //This service is for development and testing purposes only. We recommend that you create your own geometry service for use within your applications.
  esriConfig.defaults.geometryService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

  map = new Map("map", {
    basemap: "satellite",
    center: [-88.1285691261062, 41.793264502709576],
    zoom: 9,
    slider: false
  });

  map.on("layers-add-result", initEditor);
  map.on("load", function() {
    map.enableScrollWheel();
  })

  //add boundaries and place names
  var labels = new ArcGISTiledMapServiceLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer");
  map.addLayer(labels);

  var nddPoints = new FeatureLayer("https://services5.arcgis.com/GwzfxPSYbDxtMoCu/arcgis/rest/services/nddPointsLayr/FeatureServer/0", {
    mode: FeatureLayer.MODE_ONDEMAND,
    outFields: ["*"]
  });

  //instantiate cmap counties feature layer
  var cmapCounties = new FeatureLayer("http://services5.arcgis.com/LcMXE3TFhi1BSaCY/arcgis/rest/services/MPOcounties_CMAP_201409/FeatureServer/0", {
    mode: FeatureLayer.MODE_ONDEMAND,
    outFields: ["*"]
  })
  cmapCounties.on("load", function(){
    cmapCounties.disableMouseEvents()
  })


  map.addLayers([nddPoints]);

  function initEditor(evt) {
    var templateLayers = arrayUtils.map(evt.layers, function(result) {
      return result.layer;
    });
    var templatePicker = new TemplatePicker({
      featureLayers: [nddPoints],
      grouping: true,
      rows: "auto",
      columns: 1
    }, "templateDiv");
    templatePicker.startup();

    var layers = arrayUtils.map(evt.layers, function(result) {
      return {
          featureLayer: result.layer
        }
    });

    console.log(layers)
    var settings = {
      map: map,
      templatePicker: templatePicker,
      layerInfos: layers,
      toolbarVisible: true,
      createOptions: {
        polylineDrawTools: [Editor.CREATE_TOOL_FREEHAND_POLYLINE],
        polygonDrawTools: [Editor.CREATE_TOOL_FREEHAND_POLYGON,
          Editor.CREATE_TOOL_CIRCLE,
          Editor.CREATE_TOOL_TRIANGLE,
          Editor.CREATE_TOOL_RECTANGLE
        ]
      },
      toolbarOptions: {
        reshapeVisible: true
      }
    };

    var params = {
      settings: settings
    };
    var myEditor = new Editor(params, "editorDiv");
    //define snapping options
    var symbol = new SimpleMarkerSymbol(
      SimpleMarkerSymbol.STYLE_CROSS,
      15,
      new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID,
        new Color([255, 0, 0, 0.5]),
        5
      ),
      null
    );
    map.enableSnapping({
      snapPointSymbol: symbol,
      tolerance: 20,
      snapKey: keys.ALT
    });

    myEditor.startup();
  }

  // Search
  map.searchDivNav = createSearchWidget("searchNavDiv");
  map.searchWidgetPanel = createSearchWidget("searchPanelDiv");

  function createSearchWidget(parentId) {
    var search = new Search({
      map: map,
      enableHighlight: false
    }, parentId);
    search.startup();
    return search;
  }

  // Basemaps
  query("#selectBasemapPanel").on("change", function(e) {
    map.setBasemap(e.target.options[e.target.selectedIndex].value);
  });

  // Home
  query(".calcite-navbar .navbar-brand").on("click", function(e) {
    map.setExtent(map.initialExtent);
  })

});
