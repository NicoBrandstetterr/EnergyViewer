"use strict";

/**
 * En este archivo irán los métodos que afecten a las barras de manera transversal al tipo de grafo.
 *
 */



/* Cada barra tendrá lo siguiente
 id-barra: {
    name: "Nombre",
    generadores: [ // La lista de generadores serán los nodos de los generadores y cada generador tendrá su arista entre el y la barra.
      {
        // Características del generador.
         id: identificador,
        //label: generators[i].name,
        image: giveUrlByType(generators[i].type),
        shape: 'image',
        size: 11,arrows:{to:{scaleFactor:2}}
        nodeName: generators[i].name,
        title: title,

        arista: {
          color: "black", // Colores de las aristas dependientes del voltaje.
          from: maxid, // desde que nodo empíeza la arista.
          to: generators[i].bus_id // hasta que nodo termina la arista.
        }
      }
	]
  }
*/

var dictBarras = {};
var nodesSelected = [];

// Existe una variable buses en donde se cargan los datos previamente.

/**
 * Genera nodos a partir de datos de las barras en red eléctrica
 * @param buses Datos de las barras
 * @param electricTopology Red eléctrica
 * @param type Tipo de topología
 */
// function parseBuses(buses, electricTopology, type) {
//   console.log("pasando por parseBuses")
//   //  Necesitamos formar los nodos a partir de las barras [id: #, label: "nombre"]
//   let i;
// // Deben ser del estilo [{id: 1, label: "Maitencillo"}, {id: 2, label: "La Serena"}]
//   let totalx = 0;
//   let totaly = 0;
//   let validbars = 0;
  
//   let typeToString = "";
//   switch (type) {
// 	case TOPOLOGY_TYPES.ELECTRIC:
// 		typeToString = "eléctrica";
// 		break;
// 	case TOPOLOGY_TYPES.GEO:
// 		typeToString = "geográfica";
// 		break;
//   }

//   const busesLog = createLog("Creando barras en la red " + typeToString);
//   let badCoordinatesLog = null;
//   for (i = 0; i < buses.length; i++) {

//     // Variable para dejar en el label si esta activo en forma intuitiva.
//     const active = buses[i].active === 1 ? "Si" : "No";

//     var currentBusTime = {
//       marginal_cost: 'undefined',
//       DemBarE: 'undefined',
//       DemBarP: 'undefined'
//     };
//     // Agregamos la barra al diccionario para linkearla a sus generadores.
//     dictBarras[buses[i].id] = {
//       indice: i
//     };
//     // Guardamos el id maximo para no topar entre id de generador y id de barra
//     maxid = Math.max(buses[i].id, maxid);
//     const hasLoad = getBusLoad(buses[i].id);
//     const hasGenerators = false;
//     let io_val;
//     switch (hasGenerators){
//       case true:
//         switch (hasLoad){
//           case true:
//             io_val = "_io"
//             break
//           default:
//             io_val = "_i"
//         }
//         break
//       default:
//         switch (hasLoad){
//           case true:
//             io_val = "_o"
//             break
//           default:
//             io_val = ""
//         }
//     }

//     // Creamos el nodo de la barra con sus caracteristicas correspondientes.
//     let barra = {
//       id: buses[i].id,
//       font: {
//         size: 30
//       },
//       label: buses[i].name.replace(/_/gi, " "),
//       active: buses[i].active,
//       shape: 'image',
//       size: 40,
//       marginal_cost: currentBusTime.marginal_cost,
//       demandE: currentBusTime.DemBarE,
//       demandP: currentBusTime.DemBarP,
//       maxSize: 40,
//       // Variables relacionadas con lo que son las barras.
//       category: 'bus',
//       nodeName: buses[i].name.replace(/_/gi, " "),
//       generadores: [], // Lista de los generadores que tiene la barra

//       // Actualizamos los datos en los tooltipa.
//       displaying: false, // Nos indica si se estan mostrando los generadores de la barra.
//       hasLoad: hasLoad,
//       hasGenerators: hasGenerators,
//       type: buses[i].type
//     };
//     createBusImage(barra);
//     barra.x = buses[i].longitude * -escala;
//     barra.y = buses[i].latitude * escala;
//     barra.longitude = buses[i].longitude;
//     barra.latitude = buses[i].latitude;
//     barra.validCoords = !(zero(barra.x) && zero(barra.y));

// 	// Solo se entra si no es el grafo del mapa. para mantener coordenadas.
//     if (type === TOPOLOGY_TYPES.ELECTRIC) {
//       if (barra.validCoords) {
//         totalx += barra.x;
//         totaly += barra.y;
//         validbars += 1;
//       } else {
//         if (badCoordinatesLog === null) {
// 			badCoordinatesLog = createLog("Hay barras con coordenadas inválidas o incorrectas.", LOG_TYPE.WARNING);
// 		}
// 		addDetailsToLog(badCoordinatesLog, {
// 				message: barra.label, 
// 				fun: () => { 
// 					if(currentTopologyType === TOPOLOGY_TYPES.ELECTRIC) 
// 						goToNode(electricNetwork, electricNodes, barra.id)
// 					}
// 			});
//       }
//     }
//     // Agrega la barra al grafo.
//     electricTopology.buses.push(barra);
//     const bid = buses[i].id;
//     addDetailsToLog(busesLog,
//   		{
//   			message: 'Barra ' + buses[i].name.replace(/_/gi, " ") + ' cargada',
//         // Se recomienda no tocar. Si no hago esto la id con la que se llama goToNode
//         // siempre es la ultima (277 para CHL), por lo que tengo que usar un lambda para
//         // capturar el valor de bid y dentro de ese scope puedo definir mi lambda
//   			fun: ((id) => (() => {
//           let network;
//           let nodes;
//           switch (type) {
//           case TOPOLOGY_TYPES.ELECTRIC:
//             network = electricNetwork;
//             nodes = electricNodes;
//             break;
//           case TOPOLOGY_TYPES.GEO:
//             network = geoNetwork;
//             nodes = geoNodes;
//             break;
//           }
//           if(currentTopologyType === type) {
//             goToNode(network,nodes,id);
//           }
//         }))(bid)
//   		}
// 	 );
//   }
//   // Se ajustan para tener el grafo más parecido al mapa.
//   if(type === TOPOLOGY_TYPES.ELECTRIC){
//     totalx /= validbars;
//     totaly /= validbars;
//     for(i = 0; i<electricTopology.buses.length; i++){
//       if(electricTopology.buses[i].validCoords){
//         electricTopology.buses[i].x -= totalx;
//         electricTopology.buses[i].y -= totaly;
//       }
//     }
//   }
//   getNodesUpdates();
// }

async function parseBuses(buses, electricTopology, type) {
  console.log("pasando por parseBuses")
  //  Necesitamos formar los nodos a partir de las barras [id: #, label: "nombre"]
  let i;
// Deben ser del estilo [{id: 1, label: "Maitencillo"}, {id: 2, label: "La Serena"}]
  let totalx = 0;
  let totaly = 0;
  let validbars = 0;
  
  const typeToString = {
    [TOPOLOGY_TYPES.ELECTRIC]: "eléctrica",
    [TOPOLOGY_TYPES.GEO]: "geográfica"
  };

  const busesLog = createLog("Creando barras en la red " + typeToString[type]);
  let badCoordinatesLog = null;
  let promises = [];
  for (i = 0; i < buses.length; i++) {
      promises.push(getBusLoad(buses[i].id));
  }
  let results = await Promise.all(promises);
  for (i = 0; i < buses.length; i++) {
    let bus_actual = buses[i];
    // Variable para dejar en el label si esta activo en forma intuitiva.
    const active = bus_actual.active === 1 ? "Si" : "No";

    var currentBusTime = {
      marginal_cost: 'undefined',
      DemBarE: 'undefined',
      DemBarP: 'undefined'
    };
    // Agregamos la barra al diccionario para linkearla a sus generadores.
    dictBarras[bus_actual.id] = {
      indice: i
    };
    // Guardamos el id maximo para no topar entre id de generador y id de barra
    maxid = Math.max(bus_actual.id, maxid);
    // const hasLoad = await getBusLoad(bus_actual.id);
    const hasLoad = results[i];
    const hasGenerators = false;
    let io_val;
    switch (hasGenerators){
      case true:
        switch (hasLoad){
          case true:
            io_val = "_io"
            break
          default:
            io_val = "_i"
        }
        break
      default:
        switch (hasLoad){
          case true:
            io_val = "_o"
            break
          default:
            io_val = ""
        }
    }

    // Creamos el nodo de la barra con sus caracteristicas correspondientes.
    let busname = bus_actual.name.replace(/_/gi, " ");
    let barra = {
      id: bus_actual.id,
      font: {
        size: 30
      },
      label: busname,
      active: bus_actual.active,
      shape: 'image',
      size: 40,
      marginal_cost: currentBusTime.marginal_cost,
      demandE: currentBusTime.DemBarE,
      demandP: currentBusTime.DemBarP,
      maxSize: 40,
      // Variables relacionadas con lo que son las barras.
      category: 'bus',
      nodeName: busname,
      generadores: [], // Lista de los generadores que tiene la barra

      // Actualizamos los datos en los tooltipa.
      displaying: false, // Nos indica si se estan mostrando los generadores de la barra.
      hasLoad: hasLoad,
      hasGenerators: hasGenerators,
      type: bus_actual.type
    };
    createBusImage(barra);
    barra.x = bus_actual.longitude * -escala;
    barra.y = bus_actual.latitude * escala;
    barra.longitude = bus_actual.longitude;
    barra.latitude = bus_actual.latitude;
    barra.validCoords = !(zero(barra.x) && zero(barra.y));

	// Solo se entra si no es el grafo del mapa. para mantener coordenadas.
    if (type === TOPOLOGY_TYPES.ELECTRIC) {
      if (barra.validCoords) {
        totalx += barra.x;
        totaly += barra.y;
        validbars += 1;
      } else {
        if (badCoordinatesLog === null) {
			badCoordinatesLog = createLog("Hay barras con coordenadas inválidas o incorrectas.", LOG_TYPE.WARNING);
		}
		addDetailsToLog(badCoordinatesLog, {
				message: barra.label, 
				fun: () => { 
					if(currentTopologyType === TOPOLOGY_TYPES.ELECTRIC) 
						goToNode(electricNetwork, electricNodes, barra.id)
					}
			});
      }
    }
    // Agrega la barra al grafo.
    electricTopology.buses.push(barra);
    const bid = bus_actual.id;
    addDetailsToLog(busesLog,
  		{
  			message: 'Barra ' + busname + ' cargada',
        // Se recomienda no tocar. Si no hago esto la id con la que se llama goToNode
        // siempre es la ultima (277 para CHL), por lo que tengo que usar un lambda para
        // capturar el valor de bid y dentro de ese scope puedo definir mi lambda
  			fun: ((id) => (() => {
          let network;
          let nodes;
          switch (type) {
          case TOPOLOGY_TYPES.ELECTRIC:
            network = electricNetwork;
            nodes = electricNodes;
            break;
          case TOPOLOGY_TYPES.GEO:
            network = geoNetwork;
            nodes = geoNodes;
            break;
          }
          if(currentTopologyType === type) {
            goToNode(network,nodes,id);
          }
        }))(bid)
  		}
	 );
  }
  // Se ajustan para tener el grafo más parecido al mapa.
  if(type === TOPOLOGY_TYPES.ELECTRIC){
    totalx /= validbars;
    totaly /= validbars;
    for(i = 0; i<electricTopology.buses.length; i++){
      let bus_actual = electricTopology.buses[i];
      if(bus_actual.validCoords){
        bus_actual.x -= totalx;
        bus_actual.y -= totaly;
      }
    }
  }
  await getNodesUpdates();
}

/**
 * Agrega barras a la red eléctrica
 * @param buses Arreglo de datos de barras. Definen un nodo.
 */
function addBusesToNetwork(buses) {

  // Agregamos las barras a la red (Network).
  nodesArray = nodesArray.concat(buses);
}

/**
 * Agrega barras al mapa de referencia geográfica
 * @param buses Arreglo de barras (conjunto de datos que definen una barra)
 */
function addBusesToMapNetwork(buses) {

  // Agregamos las barras a la red (Network).
  nodesMArray = nodesMArray.concat(buses);
}

/**
 * Obtiene datos actualizados de nodos.
 * @returns {Array} arreglo de nodos
 */
// function getNodesUpdates(){

//   let inodes;
//   if (currentTopologyType === TOPOLOGY_TYPES.ELECTRIC)
//     inodes = electricTopology.buses;
//   else if (currentTopologyType === TOPOLOGY_TYPES.GEO)
//     inodes = electricMapTopology.buses;
//   else
//     return [];

//   let updates = [];
//   let datosInvalidosLog;
//   let hydrologyInvalidLog;
//   /* Se cargan los datos de la barra seleccionada. */
  
//   let callBack = function (x,hydro,identificador) {
//     return function() {
//       if (x.readyState === 4){
//         let busData = JSON.parse(x.responseText);
//         if(!(identificador in hydrologyTimes[hydro]['buses'])) {
//           hydrologyTimes[hydro]['buses'][identificador] = busData;
//         }
//       }
//     };
//   };

//   /* Si los datos estan cargados se ejecuta este método. */
//   let preLoad = function (data) {};
  
//   for (let i = 0; i < inodes.length; i++) {

//     let currentBusTime = {
//       marginal_cost: 0,
//       DemBarE: 0,
//       DemBarP: 0
//     };

//     /* se cargan los datos y si existen se crea el gráfico. */
//     loadBusFile(inodes[i].id, preLoad, chosenHydrology);
//     // loadBusFile(inodes[i].id, preLoad,callBack, chosenHydrology);

//     // Verificar posibles errores
//     if (chosenHydrology in hydrologyTimes && 'buses' in hydrologyTimes[chosenHydrology]) {
//         if (inodes[i].id in hydrologyTimes[chosenHydrology].buses) {
//             let tempBus = hydrologyTimes[chosenHydrology].buses[inodes[i].id][chosenTime];
//             if (tempBus !== undefined) {
//                 currentBusTime = tempBus;
//             } else {
//                 if (typeof datosInvalidosLog === 'undefined') {
//                     datosInvalidosLog = createLog("La hidrologia " + chosenHydrology + " tiene barras inválidas", LOG_TYPE.WARNING);
//                 }
//                 addDetailsToLog(datosInvalidosLog, "La barra " + inodes[i].nodeName + " no contiene datos válidos");
//             }
//         } else {
//             if (typeof datosInvalidosLog === 'undefined') {
//                 datosInvalidosLog = createLog("La hidrologia " + chosenHydrology + " tiene barras inválidas", LOG_TYPE.WARNING);
//             }
//             addDetailsToLog(datosInvalidosLog, "La barra " + inodes[i].nodeName + " no se encontró o se cargó incorrectamente");
//         }
//     } else {
//         if (typeof hydrologyInvalidLog === 'undefined') {
//             hydrologyInvalidLog = createLog("La carga de la hidrología actual falló", LOG_TYPE.WARNING);
//         }
//     }

//     // tooltip es la barra de información que aparece al posar el mouse sobre una barra.
//     const active = inodes[i].active === 1 ? "Si" : "No";
//     let tooltip = generateTooltip(["Barra: " + inodes[i].nodeName.replace(/_/gi, " "), 
//                                   "Activo: " + active, 
//                                   "Costo marginal: " + parseFloat(currentBusTime.marginal_cost).toFixed(1) + " [USD/MWh]", 
//                                   "Demanda-Energía: " + parseFloat(currentBusTime.DemBarE).toFixed(1) + " [MWh]",
//                                   "Demanda-Potencia: " + parseFloat(currentBusTime.DemBarP).toFixed(1) + " [MW]"]);

//     let node = {
//       id: inodes[i].id,
//       title: tooltip,
//       marginal_cost: currentBusTime.marginal_cost,
//       demandE: currentBusTime.DemBarE,
//       demandP: currentBusTime.DemBarP,
//       type: inodes[i].type,
//       hasLoad: inodes[i].hasLoad,
// 		  hasGenerators: inodes[i].hasGenerators,
//       label: inodes[i].nodeName
//     };
	
//     createBusImage(node);
		  
//     inodes[i].marginal_cost = currentBusTime.marginal_cost;
//     inodes[i].demandE = currentBusTime.DemBarE;
//     inodes[i].demandP = currentBusTime.DemBarP;
//     inodes[i].title = tooltip;

//     updates.push(node);
//   }

//   return updates;
// }

async function getNodesUpdates(updatehidro = false){

  let inodes;
  if (currentTopologyType === TOPOLOGY_TYPES.ELECTRIC)
    inodes = electricTopology.buses;
  else if (currentTopologyType === TOPOLOGY_TYPES.GEO)
    inodes = electricMapTopology.buses;
  else
    return [];

  let updates = [];
  let datosInvalidosLog;
  let hydrologyInvalidLog;
  /* Si los datos estan cargados se ejecuta este método. */
  
  if (updatehidro){
    let preLoad = function (data) {};
    let busFileLoadPromises = inodes.map(node => {
      return loadBusFile(node.id, preLoad, chosenHydrology);
    });

    await Promise.all(busFileLoadPromises);

  }

  for (let i = 0; i < inodes.length; i++) {

    let inodes_actual=inodes[i];

    let currentBusTime = {
      marginal_cost: 0,
      DemBarE: 0,
      DemBarP: 0
    };

    // Verificar posibles errores
    if (chosenHydrology in hydrologyTimes && 'buses' in hydrologyTimes[chosenHydrology]) {
        if (inodes_actual.id in hydrologyTimes[chosenHydrology].buses) {
            let tempBus = hydrologyTimes[chosenHydrology].buses[inodes_actual.id][chosenTime];
            if (tempBus !== undefined) {
                currentBusTime = tempBus;
            } else {
                if (typeof datosInvalidosLog === 'undefined') {
                    datosInvalidosLog = createLog("La hidrologia " + chosenHydrology + " tiene barras inválidas", LOG_TYPE.WARNING);
                }
                addDetailsToLog(datosInvalidosLog, "La barra " + inodes_actual.nodeName + " no contiene datos válidos");
            }
        } else {
            if (typeof datosInvalidosLog === 'undefined') {
                datosInvalidosLog = createLog("La hidrologia " + chosenHydrology + " tiene barras inválidas", LOG_TYPE.WARNING);
            }
            addDetailsToLog(datosInvalidosLog, "La barra " + inodes_actual.nodeName + " no se encontró o se cargó incorrectamente");
        }
    } else {
        if (typeof hydrologyInvalidLog === 'undefined') {
            hydrologyInvalidLog = createLog("La carga de la hidrología actual falló", LOG_TYPE.WARNING);
        }
    }

    // tooltip es la barra de información que aparece al posar el mouse sobre una barra.
    const active = inodes_actual.active === 1 ? "Si" : "No";
    let tooltip = generateTooltip(["Barra: " + inodes_actual.nodeName.replace(/_/gi, " "), 
                                  "Activo: " + active, 
                                  "Costo marginal: " + parseFloat(currentBusTime.marginal_cost).toFixed(1) + " [USD/MWh]", 
                                  "Demanda-Energía: " + parseFloat(currentBusTime.DemBarE).toFixed(1) + " [MWh]",
                                  "Demanda-Potencia: " + parseFloat(currentBusTime.DemBarP).toFixed(1) + " [MW]"]);

    let node = {
      id: inodes_actual.id,
      title: tooltip,
      marginal_cost: currentBusTime.marginal_cost,
      demandE: currentBusTime.DemBarE,
      demandP: currentBusTime.DemBarP,
      type: inodes_actual.type,
      hasLoad: inodes_actual.hasLoad,
		  hasGenerators: inodes_actual.hasGenerators,
      label: inodes_actual.nodeName
    };
	
    createBusImage(node);
		  
    inodes_actual.marginal_cost = currentBusTime.marginal_cost;
    inodes_actual.demandE = currentBusTime.DemBarE;
    inodes_actual.demandP = currentBusTime.DemBarP;
    inodes_actual.title = tooltip;

    updates.push(node);
  }

  return updates;
}

/**
 * Actualiza barras ante un cambio en posición
 * @param nodes actualiza posiciones de los nodos-barra
 */
// function updateBuses(nodes){
//   nodes.update(getNodesUpdates());
// }

async function updateBuses(nodes){
  const updatebuseswait = await getNodesUpdates(true);
  nodes.update(updatebuseswait);
}

/**
 * Retorna verdadero si los datos de la barra con ide busID está cargada
 * @param busID Identificador de la barra
 * @returns {boolean} true si los datos están cargados, false si no.
 */
async function getBusLoad(busID) {
  if (CONFIG.RESULTS_DISABLED) return;
  let busLoad = false;

  const preLoad = async (data) => {
    for (let i = 0; i < data.length; i++) {
      if (parseFloat(data[i]["DemBarE"]) > 0 || parseFloat(data[i]["DemBarP"]) > 0) {
        busLoad = true;
        break;
      }
    }
  };

  await loadBusFile(busID, preLoad, chosenHydrology);

  return busLoad;
}

// function getBusLoad(busID){
//   // console.log("Entrando a getBusLoad");
//   if (CONFIG.RESULTS_DISABLED) return;
//   let busLoad = false;
//   /* Se cargan los datos de la barra seleccionada. */
//   let callBack = function (x) {
//     return function() {
//       if (x.readyState === 4){
//         let busData = JSON.parse(x.responseText);

//         if(!(busID in hydrologyTimes[chosenHydrology]['buses'])) {
//           hydrologyTimes[chosenHydrology]['buses'][busID] = busData;
//         }

//         for(let i = 0; i < busData.length; i++){
//           if(parseFloat(busData[i]["DemBarE"]) > 0 || parseFloat(busData[i]["DemBarP"]) > 0){
//             busLoad = true;
//             break;
//           }
//         }
//       }
//     };
//   };


//   /* Si los datos estan cargados se ejecuta este método. */
//   let preLoad = function (data) {
//     for(let i = 0; i < data.length; i++){
//       if(parseFloat(data[i]["DemBarE"]) > 0 || parseFloat(data[i]["DemBarP"]) > 0){
//         busLoad = true;
//         break;
//       }
//     }
//   };

//   loadBusFile(busID, preLoad, chosenHydrology);

//   // loadBusFile(busID, preLoad,callBack, chosenHydrology);

//   return busLoad;
// }
