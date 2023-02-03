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
    console.log("pasando por gReq.onreadystatechange")
    let t0 = performance.now();
    generators = JSON.parse(this.responseText);
	  createLog('Archivo de generadores leído', LOG_TYPE.SUCCESS)
    console.log("Tiempo de carga centrals topology:" + (performance.now()-t0) + " milisegundos.");
    let t1 = performance.now();
    // console.log("generators = JSON.parse(this.responseText); tardó " + (t1 - t0) + " milisegundos.")
    loadElectricTopology(buses, lines, generators);
    let t2 = performance.now();
    console.log("loadElectricTopology tardó " + (t2 - t1) + " milisegundos.")
    parseElectricTopologyToNetwork();
    let t3 = performance.now();
    console.log("parseElectricTopologyToNetwork tardó " + (t3 - t2) + " milisegundos.")
    addDataToMapNetwork();
    let t4 = performance.now();
    console.log("addDataToMapNetwork tardó " + (t4 - t3) + " milisegundos.")
    console.log("Se viene creacion red electrica")
    var result = generateNetwork(electricContainer, nodesArray, edgesArray, TOPOLOGY_TYPES.ELECTRIC);
	  createLog('Red eléctrica generada correctamente!', LOG_TYPE.SUCCESS)
    electricNetwork = result.network;
    electricNodes = result.nodes;
    electricEdges = result.edges;
    console.log("se viene creacion de vista georeferenciada");
    var resultMap = generateNetwork(geoContainer, nodesMArray, edgesMArray, TOPOLOGY_TYPES.GEO);
	  createLog('Vista georeferenciada generada correctamente!', LOG_TYPE.SUCCESS)
    geoNetwork = resultMap.network;
    geoNodes = resultMap.nodes;
    geoEdges = resultMap.edges;
    enableDrag(geoNetwork, $('#my-geo-network'), geoNodes);
    toElectricView();
    enableDrag(electricNetwork, $('#my-electric-network'), electricNodes);
    let t5 = performance.now();
    // console.log("final de greq tardó " + (t5-t4) + " milisegundos.")
    console.log("total de greq tardó " + (t5-t0) + " milisegundos.")
    
    
  }
};

lReq.onreadystatechange = function () {
  
  if (this.readyState === 4) {
    let t0 = performance.now();
    console.log("pasando por lReq.onreadystatechange")
    lines = JSON.parse(this.responseText);
    if(!CONFIG.RESULTS_DISABLED) loadLinesFiles();
    createLog('Archivo de líneas leído', LOG_TYPE.SUCCESS);
    console.log("Tiempo de carga lines topology:" + (performance.now()-t0) + " milisegundos.");
    gReq.open("GET", CONFIG.URL_CENTRALS, false);
    gReq.send();
    let t1 = performance.now();
    console.log("final de lreq tardó " + (t1-t0) + " milisegundos.")
  }
};

bReq.onreadystatechange = function () {
  
  if (this.readyState === 4) {
    console.log("hidrotimes -1: ",hydrologyTimes)
    console.log("pasando por bReq.onreadystatechange")
    // console.log(process.versions.v8)
    // console.log("version: ",process.versions.node)
    let t0 = performance.now();
    buses = JSON.parse(this.responseText);
	  createLog('Archivo de barras leído', LOG_TYPE.SUCCESS)
    let t1 = performance.now();
    // console.log("El código breq 1 tardó " + (t1 - t0) + " milisegundos.")
    lReq.open("GET", CONFIG.URL_LINES, false);
    lReq.send();
    let t2 = performance.now();
    // console.log("El código breq 2 tardó " + (t2 - t1) + " milisegundos.")
    console.log("final de breq  tardó " + (t2 - t0) + " milisegundos.")

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