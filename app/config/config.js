"use strict";




var BASE_FOLDER_NAME = getParameterByName("base_uri");//base_cfg.BASE_FOLDER_NAME;
// var BASE_FOLDER_NAME = "file:///home/user/Documents/data/";
// var BASE_FOLDER_NAME = "file:///C:/Users/user/Documents/data/";
var MODEL_FOLDER_NAME = getParameterByName("model");

let base_cfg = {
    "BASE_FOLDER_NAME"      :  BASE_FOLDER_NAME,
    "MODEL_FOLDER_NAME"     :  MODEL_FOLDER_NAME,
    "ENABLE_TIME_LOG"       :  (getParameterByName('debug') === 'true'),
    "RESULTS_DISABLED"      : !(getParameterByName('results') === 'true'),
    "standalone"            :  (getParameterByName('standalone') === 'true')
};





var CONFIG =
  {
    "URL_BUSES"                     : BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Topology/Electric/bus.json",
    "URL_LINES"                     : BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Topology/Electric/lines.json",
    "URL_CENTRALS"                  : BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Topology/Electric/centrals.json",
    "URL_WATERWAYS"                 : BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Topology/Hydric/waterways.json",
    "URL_JUNCTIONS"                 : BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Topology/Hydric/junctions.json",
    "URL_RESERVOIRS"                : BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Topology/Hydric/reservoirs.json",
    "URL_SHAPE_BASIC"               : BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Topology/shape.json",
    "URL_SHAPE_DETAILED"            : BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Topology/shapeDetails.json",
    "URL_HYDROLOGIES"               : BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Scenarios/hydrologies.json",

    "SCENARIOS_FOLDER"              : BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Scenarios/",
    "BUSES_FOLDER"                  : BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Scenarios/{hydrology}/Bus/",
    "CENTRALS_FOLDER"               : BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Scenarios/{hydrology}/Centrals/",
    "LINES_FOLDER"                  : BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Scenarios/{hydrology}/Lines/",
    "RESERVOIRS_FOLDER"             : BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Scenarios/{hydrology}/Reservoirs/",
    "PERCENTIL_MARGINAL_COST_FOLDER": BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Scenarios/Marginal_cost_percentil/",
    "PERCENTIL_FLOW_LINE_FOLDER"    : BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Scenarios/Flow_Line_percentil/",
    "PILED_GENERATION_GRAPH_FOLDER" : BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Scenarios/Generation_system/",

    "LOW_MARGINAL_COST"             : 10,
    "HIGH_MARGINAL_COST"            : 200,
    "FAILURE_THRESHOLD"             : 400,
	"NUMBER_OF_QUANTILES"			: 10,

    "COLOR_SERIE"                   : "#2196F3", // Blue
    "COLOR_EMBALSE"                 : "#3F51B5", // Indigo
    "COLOR_PASADA"                  : "#03A9F4", // Light Blue
    "COLOR_MINIHIDRO"               : "#00BCD4", // Cyan
    "COLOR_SOLAR"                   : "#FFC107", // Amber (almost yellow)
    "COLOR_EOLICA"                  : "#8BC34A", // Light Green
    "COLOR_CARBON"                  : "#212121", // Grey 90%
    "COLOR_DIESEL"                  : "#9E9E9E", // Grey 50%
    "COLOR_GNL"                     : "#FF5722", // Deep Orange
    "COLOR_BIOMASA"                 : "#795548", // Brown
    "COLOR_COGENERACION"            : "#80DEEA"  // Cyan 20%
  };

//Le agrego lo que viene en base_cfg a CONFIG
Object.assign(CONFIG, base_cfg);

//Si la aplicacion no es el standalone con el gestor de proyectos
if(!base_cfg.standalone){
    $(".standalone").addClass('hidden');
}
// API
// "URL_BUSES": "http://172.17.50.97:8080/input/bus",
// "URL_LINES": "http://172.17.50.97:8080/input/lines",
// "URL_CENTRALS": "http://172.17.50.97:8080/input/centrals"

// Local
// "URL_BUSES": "./data/bus29.json",
// "URL_LINES": "./data/lines29.json",
// "URL_CENTRALS": "./data/centrals29.json"
