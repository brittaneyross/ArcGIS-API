
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
  'esri/layers/FeatureLayer',
  'esri/widgets/Popup',
  'esri/PopupTemplate',
  'esri/widgets/Editor',
  'esri/popup/content/AttachmentsContent',
  'esri/popup/content/TextContent',
], function(Map,
  MapView,
  FeatureLayer,
  Popup,
  PopupTemplate,
  Editor,
  AttachmentsContent,
  TextContent) {
  //the names of the functions can be named anything
  //Instantiate the Map
  //Create the new map
  //the map is the container of the map
  const map = new Map({
    //set basemap to one of the available online
    basemap: 'streets'
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

  //view is how you view the Map
  //multiple view can reference the same map but in a different location/extent
  //Map is like the backyard and the view of the map is like the window from your house
  //each window can have a different view of the same map
  const view = new MapView({
    //all properties set are directly in constructor in 4x
    //all properties can be set when instantiating the map view
    container: 'viewDiv',
    map: map,
    zoom: 9,
    center: [-88.1285691261062, 41.793264502709576],
    popup: {
      dockEnabled: true,
      dockOptions: {
        buttonEnabled: true,
        breakpoint: false,
        position: 'bottom-left',
      }
    }
  });

  // editor = new Editor({
  //   view: view,
  //   allowedWorkflows:['create']
  // });
  //
  // view.ui.add(editor, "bottom-right");

  //add feature layer to Map using when statement
  //to load layer when map is done loading
  view.when(function() {
    // Create the Editor with the specified layer and a list of field configurations
    editor = new Editor({
      view: view,
      container: document.createElement("div"),
      layerInfos: [{
        layer: nddPoints,
        fieldConfig: [{
            name: 'status_type',
            label: 'status_type',
            hint: 'Select status from dropdown'
          },
          {
            name: 'contact',
            label: 'contact',
            hint: 'Enter contact info'
          }
        ]
      }]
    });

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

      // We need to set a timeout to ensure the editor widget is fully rendered. We
      // then grab it from the DOM stack
      setTimeout(function() {
        // Use the editor's back button as a way to cancel out of editing
        let arrComp = editor.domNode.getElementsByClassName(
          "esri-editor__back-button esri-interactive"
        );
        if (arrComp.length === 1) {
          // Add a tooltip for the back button
          arrComp[0].setAttribute(
            "title",
            "Cancel edits, return to popup"
          );
          // Add a listerner to listen for when the editor's back button is clicked
          arrComp[0].addEventListener("click", function(evt) {
            // Prevent the default behavior for the back button and instead remove the editor and reopen the popup
            evt.preventDefault();
            view.ui.remove(editor);
            view.popup.open({
              features: features
            });
          });
        }
      }, 150);
    }

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
    } else {
      // Grab the features of the popup
      features = view.popup.features;
    }
  });

  nddPoints.on("apply-edits", function() {
    // Once edits are applied to the layer, remove the Editor from the UI
    view.ui.remove(editor);

    // Iterate through the features
    features.forEach(function(feature) {
      // Reset the template for the feature if it was edited
      feature.popupTemplate = template;
    });

    // Open the popup again and reset its content after updates were made on the feature
    if (features) {
      view.popup.open({
        features: features
      });
    }

    // Cancel the workflow so that once edits are applied, a new popup can be displayed
    editor.viewModel.cancelWorkflow();
  });

});
