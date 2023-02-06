"use strict";

/**
 * Todos los métodos relevantes al generar la topología.
 *
 */
var electricTopology = {
  buses: [],
  lines: [],
  centrals: []
};

var electricMapTopology = {
  buses: [],
  lines: [],
  centrals: []
};

function loadElectricTopology(buses, lines, centrals){
  console.log("pasando por loadElectricTopology");
  // console.log("hidrotimes 0: ",hydrologyTimes)
  // Parseamos las variables recibidas.
  let t0 = performance.now();
  console.log("----------------------------------------------------------------")
  parseBuses(buses, electricTopology, TOPOLOGY_TYPES.ELECTRIC);
  let t1 = performance.now();
  console.log("parseBuses electrictopology tardó " + (t1-t0) + " milisegundos.")
  console.log("----------------------------------------------------------------")
  parseBuses(buses, electricMapTopology, TOPOLOGY_TYPES.GEO);
  let t2 = performance.now();
  console.log("parseBuses geoTopology tardó " + (t2-t1) + " milisegundos.")
  parseLines(lines, electricTopology);
  let t3=performance.now()
  parseCentrals(centrals, electricTopology, TOPOLOGY_TYPES.ELECTRIC);
  let t4 = performance.now();
  console.log("parseCentrals electricTopology tardó " + (t4-t3) + " milisegundos.")
  parseCentrals(centrals, electricMapTopology, TOPOLOGY_TYPES.GEO);
  let t5 = performance.now();
  console.log("parseCentrals geoTopology tardó " + (t5-t4) + " milisegundos.")
  console.log("loadElectricTopology tardó " + (t5 - t0) + " milisegundos.")

}

function parseElectricTopologyToNetwork(){

 // nodesArray = [];
 // edgesArray = [];
  console.log("pasando por parseElectricTopologyToNetwork")
  let t0 = performance.now();
  addBusesToNetwork(electricTopology.buses);
  addLinesToNetwork(electricTopology.lines);
  addCentralsToNetwork(electricTopology.centrals);

  var bus_ids = electricTopology.buses.map(bus => bus.id);
  var owners = connexComponents(bus_ids,electricTopology.lines.map(line => [line.from,line.to]));
  var count = {};
  for(var i=0; i<owners.length; i++){
    if(! (owners[i] in count)){
      count[owners[i]] = 0;
    }
    count[owners[i]] = count[owners[i]] + 1;
  }
  var loners = [];
  for(var i=0; i<owners.length; i++){
    if(count[owners[i]] === 1){
      loners.push(bus_ids[i]);
    }
  }
  var i = loners.length;
  var myLog;
  if(i){
    myLog = createLog("Hay barras disconexas",LOG_TYPE.WARNING);
  }
  while(i--){
    var id = i;
    addDetailsToLog(myLog,
      {
        message: "La barra " +
                  electricTopology.buses[dictBarras[loners[id]].indice].label +
                  " se encuentra disconexa",
        fun: () => {if(currentTopologyType === TOPOLOGY_TYPES.ELECTRIC) goToNode(electricNetwork, electricNodes, loners[id])}});
  }
  let t1 = performance.now();
  console.log("parseElectricTopologyToNetwork tardó " + (t1-t0) + " milisegundos.")
}

function addDataToMapNetwork(){
  let t0 = performance.now();
  console.log("pasando por addDataToMapNetwork")
  addBusesToMapNetwork(electricMapTopology.buses);
  addLinesToMapNetwork(electricMapTopology.lines);
  addCentralsToMapNetwork(electricMapTopology.centrals);
  let t1 = performance.now();
  console.log("addDataToMapNetwork tardó " + (t1-t0) + " milisegundos.")

}

function generateTooltip(labels) {
    // Generación del tooltip
    let tooltip = document.createElement('div');
    
    for (var i = 0; i < labels.length; i++) {
        let tooltip_i = document.createElement('p');
        tooltip_i.innerHTML = labels[i];
        tooltip.appendChild(tooltip_i);
    }
    
    return tooltip;
}

logTime("electric-topology-visjs.js");
