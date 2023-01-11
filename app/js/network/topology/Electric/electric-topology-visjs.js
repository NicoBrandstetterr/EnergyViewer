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
  console.log("pasando por loadElectricTopology")
  // Parseamos las variables recibidas.
  parseBuses(buses, electricTopology, TOPOLOGY_TYPES.ELECTRIC);
  parseBuses(buses, electricMapTopology, TOPOLOGY_TYPES.GEO);
  parseLines(lines, electricTopology);
  parseCentrals(centrals, electricTopology, TOPOLOGY_TYPES.ELECTRIC);
  parseCentrals(centrals, electricMapTopology, TOPOLOGY_TYPES.GEO);
}

function parseElectricTopologyToNetwork(){

 // nodesArray = [];
 // edgesArray = [];
  console.log("pasando por parseElectricTopologyToNetwork")
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
}

function addDataToMapNetwork(){
  console.log("pasando por addDataToMapNetwork")
  addBusesToMapNetwork(electricMapTopology.buses);
  addLinesToMapNetwork(electricMapTopology.lines);
  addCentralsToMapNetwork(electricMapTopology.centrals);


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
