<<<<<<< HEAD
var app;

require([
  "esri/Map",
  "esri/views/MapView",
  "esri/views/SceneView",
  "esri/widgets/Search",
  "esri/widgets/BasemapGallery",
  "esri/core/watchUtils",
=======

//Style with renderers
//renderers and symbols are needed for each type of data (point, line, polygon ect)
//Symbology
var defaultSym = {
  type: 'simple-marker', //autocasts as a new SimpleFillSymbol() - you do not need to add a requirement arguement
  style: 'square',
  color: 'green',
  outline: {
    color: 'grey',
    width: .25
  }
};

//Renderer
var renderer = {
  type: 'simple', //autocasts as new SimpleRenderer()
  symbol: defaultSym, //reference symbology set above
  label: 'ndd points',
  visualVariables: [{
    type: 'color',
    field: 'status_type', //set field to determine Symbology
    stops: [{
        value: 'complete',
        color: 'green',
        style: 'square',
      },
      {
        value: 'in_progress',
        color: 'red',
        style: 'square',
      }
    ]
  }]
}

//Require statements passes in esri map and map view
//Also passing in function calls Map and MapView
//casing does matter!
//all require statements can be find in each classes documentation

//Flow to add layers
// Load Module - Require statement (see class documentation)
// create the layer - instantiate (ie var name = new layer)
// set properties
// add it to your Map

require(['esri/Map',
  'esri/views/MapView',
>>>>>>> parent of e757180... fixed update
  'esri/layers/FeatureLayer',
  'esri/widgets/Popup',
  'esri/PopupTemplate',
  'esri/widgets/Editor',
  'esri/popup/content/AttachmentsContent',
  'esri/popup/content/TextContent',
<<<<<<< HEAD
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/TextSymbol",
  // Calcite Maps
  "calcite-maps/calcitemaps-v0.8",

  // Calcite Maps ArcGIS Support
  "calcite-maps/calcitemaps-arcgis-support-v0.8",

  // Bootstrap
  "bootstrap/Collapse",
  "bootstrap/Dropdown",
  "bootstrap/Tab",
  // Can use @dojo shim for Array.from for IE11
  "@dojo/framework/shim/array"
], function(
  Map,
=======
], function(Map,
>>>>>>> parent of e757180... fixed update
  MapView,
  SceneView,
  Search,
  Basemaps,
  watchUtils,
  FeatureLayer,
  Popup,
  PopupTemplate,
  Editor,
  AttachmentsContent,
<<<<<<< HEAD
  TextContent,
  SimpleMarkerSymbol,
  TextSymbol,
  CalciteMaps,
  CalciteMapsArcGIS
) {
  /******************************************************************
   *
   * App settings
   *
   ******************************************************************/

  app = {
    scale: 600000,
    basemap: "osm",
    zoom: 9,
    center: [-88.1285691261062, 41.793264502709576],
    viewPadding: {
      top: 50,
      bottom: 0
    },
    uiComponents: ["zoom", "compass", "attribution"],
    mapView: null,
    sceneView: null,
    containerMap: "mapViewDiv",
    containerScene: "sceneViewDiv",
    activeView: null,
    searchWidget: null
  };

  /******************************************************************
   *
   * Create the map and scene view and ui components
   *
   ******************************************************************/

  // Map
=======
  TextContent) {
  //the names of the functions can be named anything
  //Instantiate the Map
  //Create the new map
  //the map is the container of the map
>>>>>>> parent of e757180... fixed update
  const map = new Map({
    basemap: app.basemap
  });

  //editing
  let editor, features;

  // const attachmentsElement = new AttachmentsContent({
  //   displayType: "list"
  // });

  //Create new editor constructor
  const editThisAction = {
    title: 'Edit feature',
    id: 'edit-this',
    className: 'esri-icon-edit'
  };

  //PopupTemplate
  const template = new PopupTemplate({
    title: '<h3>Northeastern Illinois Development View</h3>',
    content: popupContent,
    fieldInfos: [{
        fieldName: 'status_type'
      },
      {
        fieldName: 'contact'
      }
    ],
    actions: [editThisAction],
  })

  function popupContent(feature) {
    const attachmentsElement = new AttachmentsContent({
      displayType: 'list'
    });
    const textElement = new TextContent();
    textElement.text = '<hr>' +
      '<h2>Building Name - Building Street Address</h2> ' +
      '<h4>icon | Full building address</h4>' +
      '<h4>icon | link to datahub or cmap ndd</h4>' +
      '<hr>' +
      '<h4>Development Status</h4> - {status_type}' +
      '<h4>Contact</h4> - {contact}' +
      '<hr>'

    return [textElement, attachmentsElement]
  };


  //instantiate feature layer
  const cmapCounties = new FeatureLayer({
    url: 'http://services5.arcgis.com/LcMXE3TFhi1BSaCY/arcgis/rest/services/MPOcounties_CMAP_201409/FeatureServer'
  })
  map.add(cmapCounties);

  const nddPoints = new FeatureLayer({
    url: 'https://services5.arcgis.com/GwzfxPSYbDxtMoCu/arcgis/rest/services/points/FeatureServer',
    outFields: ['*'],
    opacity: 0.8,
    //renderer: renderer,
    popupTemplate: template
  })
  map.add(nddPoints)

  // 2D view
  app.mapView = new MapView({
    container: app.containerMap,
    map: map,
    center: app.center,
    scale: app.scale,
    padding: app.viewPadding,
    ui: {
      components: app.uiComponents
    }
    
  });

  CalciteMapsArcGIS.setPopupPanelSync(app.mapView);

<<<<<<< HEAD
  // 3D view
  app.sceneView = new SceneView({
    container: app.containerScene,
    map: map,
    center: app.center,
    scale: app.scale,
    padding: app.viewPadding,
    ui: {
      components: app.uiComponents
    }

  });

  CalciteMapsArcGIS.setPopupPanelSync(app.sceneView);
=======
    // Execute each time the "Edit feature" action is clicked
    function editThis() {
      // If the EditorViewModel's activeWorkflow is null, make the popup not visible
      if (!editor.viewModel.activeWorkFlow) {
        view.popup.visible = false;
        // Call the Editor update feature edit workflow

        editor.startUpdateWorkflowAtFeatureEdit(
          view.popup.selectedFeature
        );
        view.ui.add(editor, "top-right");
        view.popup.spinnerEnabled = false;
      }
>>>>>>> parent of e757180... fixed update

  // Set the active view to scene
  setActiveView(app.mapView);

<<<<<<< HEAD
  // Create the search widget and add it to the navbar instead of view
  app.searchWidget = new Search({
      view: app.activeView
    },
    "searchWidgetDiv"
  );

  CalciteMapsArcGIS.setSearchExpandEvents(app.searchWidget);

  // Create basemap widget
  app.basemapWidget = new Basemaps({
    view: app.activeView,
    container: "basemapPanelDiv"
  });

  /******************************************************************
   *
   * Synchronize the view, search and popup
   *
   ******************************************************************/

  // Views
  function setActiveView(view) {
    app.activeView = view;
  }

  function syncViews(fromView, toView) {
    const viewPt = fromView.viewpoint.clone();
    fromView.container = null;
    if (fromView.type === "3d") {
      toView.container = app.containerMap;
=======
    // Event handler that fires each time an action is clicked
    view.popup.on("trigger-action", function(event) {
      if (event.action.id === "edit-this") {
        editThis();
      }
    });
  });

  // Watch when the popup is visible
  view.popup.watch("visible", function(event) {
    // Check the Editor's viewModel state, if it is currently open and editing existing features, disable popups
    if (editor.viewModel.state === "editing-existing-feature") {
      view.popup.close();
>>>>>>> parent of e757180... fixed update
    } else {
      toView.container = app.containerScene;
    }
    toView.padding = app.viewPadding;
    toView.viewpoint = viewPt;
  }

  // Search Widget
  function syncSearch(view) {
    watchUtils.whenTrueOnce(view, "ready", function() {
      app.searchWidget.view = view;
      if (app.searchWidget.selectedResult) {
        app.searchWidget.search(app.searchWidget.selectedResult.name);
      }
    });
  }

  // Tab - toggle between map and scene view
  const tabs = Array.from(
    document.querySelectorAll(".calcite-navbar li a[data-toggle='tab']")
  );
  tabs.forEach(function(tab) {
    tab.addEventListener("click", function(event) {
      if (event.target.text.indexOf("Map") > -1) {
        syncViews(app.sceneView, app.mapView);
        setActiveView(app.mapView);
      } else {
        syncViews(app.mapView, app.sceneView);
        setActiveView(app.sceneView);
      }
      syncSearch(app.activeView);
    });
  });

<<<<<<< HEAD
  /******************************************************************
   *
   * Apply Calcite Maps CSS classes to change application on the fly
   *
   * For more information about the CSS styles or Sass build visit:
   * http://github.com/esri/calcite-maps
   *
   ******************************************************************/

  const cssSelectorUi = [
    document.querySelector(".calcite-navbar"),
    document.querySelector(".calcite-panels")
  ];
  const cssSelectorMap = document.querySelector(".calcite-map");

  // Theme - light (default) or dark theme
  const settingsTheme = document.getElementById("settingsTheme");
  const settingsColor = document.getElementById("settingsColor");
  settingsTheme.addEventListener("change", function(event) {
    const textColor =
      event.target.options[event.target.selectedIndex].dataset.textcolor;
    const bgColor =
      event.target.options[event.target.selectedIndex].dataset.bgcolor;

    cssSelectorUi.forEach(function(element) {
      element.classList.remove(
        "calcite-text-dark",
        "calcite-text-light",
        "calcite-bg-dark",
        "calcite-bg-light",
        "calcite-bg-custom"
      );
      element.classList.add(textColor, bgColor);
      element.classList.remove(
        "calcite-bgcolor-dark-blue",
        "calcite-bgcolor-blue-75",
        "calcite-bgcolor-dark-green",
        "calcite-bgcolor-dark-brown",
        "calcite-bgcolor-darkest-grey",
        "calcite-bgcolor-lightest-grey",
        "calcite-bgcolor-black-75",
        "calcite-bgcolor-dark-red"
      );
      element.classList.add(bgColor);
=======
  nddPoints.on("apply-edits", function() {
    // Once edits are applied to the layer, remove the Editor from the UI
    view.ui.remove(editor);

    // Iterate through the features
    features.forEach(function(feature) {
      // Reset the template for the feature if it was edited
      feature.popupTemplate = template;
>>>>>>> parent of e757180... fixed update
    });
    settingsColor.value = "";
  });

  // Color - custom color
  settingsColor.addEventListener("change", function(event) {
    const customColor = event.target.value;
    const textColor =
      event.target.options[event.target.selectedIndex].dataset.textcolor;
    const bgColor =
      event.target.options[event.target.selectedIndex].dataset.bgcolor;

    cssSelectorUi.forEach(function(element) {
      element.classList.remove(
        "calcite-text-dark",
        "calcite-text-light",
        "calcite-bg-dark",
        "calcite-bg-light",
        "calcite-bg-custom"
      );
      element.classList.add(textColor, bgColor);
      element.classList.remove(
        "calcite-bgcolor-dark-blue",
        "calcite-bgcolor-blue-75",
        "calcite-bgcolor-dark-green",
        "calcite-bgcolor-dark-brown",
        "calcite-bgcolor-darkest-grey",
        "calcite-bgcolor-lightest-grey",
        "calcite-bgcolor-black-75",
        "calcite-bgcolor-dark-red"
      );
      element.classList.add(customColor);
      if (!customColor) {
        settingsTheme.dispatchEvent(new Event("change"));
      }
    });
  });

  // Widgets - light (default) or dark theme
  const settingsWidgets = document.getElementById("settingsWidgets");
  settingsWidgets.addEventListener("change", function(event) {
    const theme = event.target.value;
    cssSelectorMap.classList.remove(
      "calcite-widgets-dark",
      "calcite-widgets-light"
    );
    cssSelectorMap.classList.add(theme);
  });

  // Layout - top or bottom nav position
  const settingsLayout = document.getElementById("settingsLayout");
  settingsLayout.addEventListener("change", function(event) {
    const layout = event.target.value;
    const layoutNav =
      event.target.options[event.target.selectedIndex].dataset.nav;

<<<<<<< HEAD
    document.body.classList.remove(
      "calcite-nav-bottom",
      "calcite-nav-top"
    );
    document.body.classList.add(layout);

    const nav = document.querySelector("nav");
    nav.classList.remove("navbar-fixed-bottom", "navbar-fixed-top");
    nav.classList.add(layoutNav);
    setViewPadding(layout);
=======
    // Cancel the workflow so that once edits are applied, a new popup can be displayed
    editor.viewModel.cancelWorkflow();
>>>>>>> parent of e757180... fixed update
  });

  // Set view padding for widgets based on navbar position
  function setViewPadding(layout) {
    let padding, uiPadding;
    // Top
    if (layout === "calcite-nav-top") {
      padding = {
        padding: {
          top: 50,
          bottom: 0
        }
      };
      uiPadding = {
        padding: {
          top: 15,
          right: 15,
          bottom: 30,
          left: 15
        }
      };
    } else {
      // Bottom
      padding = {
        padding: {
          top: 0,
          bottom: 50
        }
      };
      uiPadding = {
        padding: {
          top: 30,
          right: 15,
          bottom: 15,
          left: 15
        }
      };
    }
    app.mapView.set(padding);
    app.mapView.ui.set(uiPadding);
    app.sceneView.set(padding);
    app.sceneView.ui.set(uiPadding);
    // Reset popup
    if (
      app.activeView.popup.visible &&
      app.activeView.popup.dockEnabled
    ) {
      app.activeView.popup.visible = false;
      app.activeView.popup.visible = true;
    }
  }


});
