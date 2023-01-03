"use strict";

var buses = [];
var lines = [];
var generators = [];

/* Cargamos los datos de las lineas, barras y generadores. */
var bReq = new XMLHttpRequest();
var lReq = new XMLHttpRequest();
var gReq = new XMLHttpRequest();

var busInfo;

gReq.onreadystatechange = function () {
  if (this.readyState === 4) {
    generators = JSON.parse(this.responseText);
	  createLog('Archivo de generadores leído', LOG_TYPE.SUCCESS)
    loadElectricTopology(buses, lines, generators);
    parseElectricTopologyToNetwork();
    addDataToMapNetwork();
    var result = generateNetwork(electricContainer, nodesArray, edgesArray, TOPOLOGY_TYPES.ELECTRIC);
	  createLog('Red eléctrica generada correctamente!', LOG_TYPE.SUCCESS)
    electricNetwork = result.network;
    electricNodes = result.nodes;
    electricEdges = result.edges;
    var resultMap = generateNetwork(geoContainer, nodesMArray, edgesMArray, TOPOLOGY_TYPES.GEO);
	  createLog('Vista georeferenciada generada correctamente!', LOG_TYPE.SUCCESS)
    geoNetwork = resultMap.network;
    geoNodes = resultMap.nodes;
    geoEdges = resultMap.edges;
    enableDrag(geoNetwork, $('#my-geo-network'), geoNodes);
    toElectricView();
    enableDrag(electricNetwork, $('#my-electric-network'), electricNodes);
  }
};

lReq.onreadystatechange = function () {
  if (this.readyState === 4) {
    lines = JSON.parse(this.responseText);
    if(!CONFIG.RESULTS_DISABLED) loadLinesFiles();
    createLog('Archivo de líneas leído', LOG_TYPE.SUCCESS);
    gReq.open("GET", CONFIG.URL_CENTRALS, false);
    gReq.send();
  }
};

bReq.onreadystatechange = function () {
  if (this.readyState === 4) {
    buses = JSON.parse(this.responseText);
	  createLog('Archivo de barras leído', LOG_TYPE.SUCCESS)
    lReq.open("GET", CONFIG.URL_LINES, false);
    lReq.send();
  }
};

bReq.open("GET", CONFIG.URL_BUSES, false);
bReq.send();

function loadFile() {
  var input, file, fr;

  if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
  }

  input = document.getElementById('json-input');

  if (!input) {
    alert("Um, couldn't find the fileinput element.");
  }
  else if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  }
  else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");
  }
  else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
    alert("file selected");
    console.log(input.value)
    fr.onloadend = function(event){
      var img = document.getElementById("yourImgTag");
      img.src = event.target.result;
    }

  }

  function receivedText(e) {
    lines = e.target.result;
    var newArr = JSON.parse(lines);
  }

}

logTime("electric-topology-loader.js");