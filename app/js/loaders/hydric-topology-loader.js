"use strict";

// var wt = [];
// var jt = [];
// var rs = [];

// /* Cargamos los datos de las lineas, barras y generadores. */
// var bReq = new XMLHttpRequest();
// var lReq = new XMLHttpRequest();
// var gReq = new XMLHttpRequest();

// gReq.onreadystatechange = function () {
//   if (this.readyState === 4) {
//     rs = JSON.parse(this.responseText);
// 	createLog('Archivo de embalses leído', LOG_TYPE.SUCCESS)
//     console.log("en gReq, se viene loadHydricTopology");
    
//     loadHydricTopology(jt, wt, rs);
//     parseHydricTopologyToNetwork();
//     var result = generateNetwork(hydricContainer, nodesHArray, edgesHArray, TOPOLOGY_TYPES.HYDRIC);
// 	createLog('Red hídrica generada correctamente!', LOG_TYPE.SUCCESS)
//     hydricNetwork = result.network;
//     hydricNodes = result.nodes;
//     hydricEdges = result.edges;
//     enableDrag(hydricNetwork, $('#my-hydric-network'), hydricNodes);
//   }
// };

// lReq.onreadystatechange = function () {
//   if (this.readyState === 4) {
//     wt = JSON.parse(this.responseText);
// 	createLog('Archivo de waterways leído', LOG_TYPE.SUCCESS)
//     try {
//       gReq.open("GET", CONFIG.URL_RESERVOIRS, false);
//       gReq.send();
//     } catch (e) {
//       createLog("No está el archivo de embalses (reservoirs.json)", LOG_TYPE.ERROR);
//     }
//   }
// };

// bReq.onreadystatechange = function () {
//   if (this.readyState === 4) {
//     jt = JSON.parse(this.responseText);
// 	createLog('Archivo de junctions leído', LOG_TYPE.SUCCESS)
//     try {
//       lReq.open("GET", CONFIG.URL_WATERWAYS, false);
//       lReq.send();
//     } catch (e) {
//       createLog("No está el archivo de waterways (waterways.json)", LOG_TYPE.ERROR);
//     }
//   }
// };
// try {
// bReq.open("GET", CONFIG.URL_JUNCTIONS, false);
// bReq.send();
// } catch(e) {
//   createLog("No está el archivo de junctions (junctions.json)", LOG_TYPE.ERROR);
// }

async function loadHydricData() {
  const [jtResponse, wtResponse, rsResponse] = await Promise.all([
    fetch(CONFIG.URL_JUNCTIONS),
    fetch(CONFIG.URL_WATERWAYS),
    fetch(CONFIG.URL_RESERVOIRS)
  ]);

  if (!jtResponse.ok) {
    createLog("No está el archivo de junctions (junctions.json)", LOG_TYPE.ERROR);
    return;
  }
  if (!wtResponse.ok) {
    createLog("No está el archivo de waterways (waterways.json)", LOG_TYPE.ERROR);
    return;
  }
  if (!rsResponse.ok) {
    createLog("No está el archivo de embalses (reservoirs.json)", LOG_TYPE.ERROR);
    return;
  }

  const [jt, wt, rs] = await Promise.all([
    jtResponse.json(),
    wtResponse.json(),
    rsResponse.json()
  ]);
  
  createLog('Archivo de junctions leído', LOG_TYPE.SUCCESS);
  createLog('Archivo de waterways leído', LOG_TYPE.SUCCESS);
  createLog('Archivo de embalses leído', LOG_TYPE.SUCCESS);

  loadHydricTopology(jt, wt, rs);
  parseHydricTopologyToNetwork();
  const result = generateNetwork(hydricContainer, nodesHArray, edgesHArray, TOPOLOGY_TYPES.HYDRIC);
  createLog('Red hídrica generada correctamente!', LOG_TYPE.SUCCESS);

  hydricNetwork = result.network;
  hydricNodes = result.nodes;
  hydricEdges = result.edges;
  enableDrag(hydricNetwork, $('#my-hydric-network'), hydricNodes);
}

loadHydricData();

logTime("hydric-topology-loader.js");