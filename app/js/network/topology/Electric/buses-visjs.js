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
function parseBuses(buses, electricTopology, type) {
  //  Necesitamos formar los nodos a partir de las barras [id: #, label: "nombre"]
  let i;
// Deben ser del estilo [{id: 1, label: "Maitencillo"}, {id: 2, label: "La Serena"}]
  let totalx = 0;
  let totaly = 0;
  let validbars = 0;
  
  let typeToString = "";
  switch (type) {
	case TOPOLOGY_TYPES.ELECTRIC:
		typeToString = "eléctrica";
		break;
	case TOPOLOGY_TYPES.GEO:
		typeToString = "geográfica";
		break;
  }

  const busesLog = createLog("Creando barras en la red " + typeToString);
  let badCoordinatesLog = null;

  for (i = 0; i < buses.length; i++) {

    // Variable para dejar en el label si esta activo en forma intuitiva.
    const active = buses[i].active === 1 ? "Si" : "No";

    var currentBusTime = {
      marginal_cost: 'undefined',
      BarRetP: 'undefined'
    };
    
    // Agregamos la barra al diccionario para linkearla a sus generadores.
    dictBarras[buses[i].id] = {
      indice: i
    };

    // Guardamos el id maximo para no topar entre id de generador y id de barra
    maxid = Math.max(buses[i].id, maxid);
    const hasLoad = getBusLoad(buses[i].id);
    const hasGenerators = false;

    // Creamos el nodo de la barra con sus caracteristicas correspondientes.
    let barra = {
      id: buses[i].id,
      font: {
        size: 30
      },
      label: buses[i].name.replace(/_/gi," "),
      active: buses[i].active,
      shape: 'image',
	    size: 40,
      marginal_cost: currentBusTime.marginal_cost,
      demand: currentBusTime.BarRetP,
      maxSize: 40,
      // Variables relacionadas con lo que son las barras.
      category: 'bus',
      nodeName: buses[i].name.replace(/_/gi," "),
      generadores: [], // Lista de los generadores que tiene la barr

    // Actualizamos los datos en los tooltipa.
      displaying: false, // Nos indica si se estan mostrando los generadores de la barra.
	  hasLoad: hasLoad,
	  hasGenerators: hasGenerators
    };
	
	let imageConfig = {
		hasLoad: hasLoad,
		hasGenerators: hasGenerators,
		label: barra.nodeName
	};
	
	barra.image = {};
	barra.image.unselected = createBusImage(imageConfig);
	imageConfig.selected = true;
	barra.image.selected = createBusImage(imageConfig);

    barra.x = buses[i].longitude * -escala;
    barra.y = buses[i].latitude * escala;
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
    const bid = buses[i].id;
    addDetailsToLog(busesLog,
  		{
  			message: 'Barra ' + buses[i].name.replace(/_/gi, " ") + ' cargada',
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
      if(electricTopology.buses[i].validCoords){
        electricTopology.buses[i].x -= totalx;
        electricTopology.buses[i].y -= totaly;
      }
    }
  }
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
function getNodesUpdates(){

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
  
  for (let i = 0; i < inodes.length; i++) {

    let currentBusTime = {
      marginal_cost: 0,
      BarRetP: 0
    };


    /* Se cargan los datos de la barra seleccionada. */
    let callBack = function (x) {
      return function() {
        if (x.readyState === 4){
          let busData = JSON.parse(x.responseText);

          if(!(inodes[i].id in hydrologyTimes[chosenHydrology]['buses'])) {
            hydrologyTimes[chosenHydrology]['buses'][inodes[i].id] = busData;
          }
        }
      };
    };

    /* Si los datos estan cargados se ejecuta este método. */
    let preLoad = function (data) {};

    /* se cargan los datos y si existen se crea el gráfico. */
    loadTypeFile(inodes[i].id, preLoad, callBack, chosenHydrology, 'buses');

    // Verificar posibles errores
    if (chosenHydrology in hydrologyTimes && 'buses' in hydrologyTimes[chosenHydrology]) {
        if (inodes[i].id in hydrologyTimes[chosenHydrology].buses) {
            let tempBus = hydrologyTimes[chosenHydrology].buses[inodes[i].id][chosenTime];
            if (tempBus !== undefined) {
                currentBusTime = tempBus;
            } else {
                if (typeof datosInvalidosLog === 'undefined') {
                    datosInvalidosLog = createLog("La hidrologia " + chosenHydrology + " tiene barras inválidas", LOG_TYPE.WARNING);
                }
                addDetailsToLog(datosInvalidosLog, "La barra " + inodes[i].nodeName + " no contiene datos válidos");
            }
        } else {
            if (typeof datosInvalidosLog === 'undefined') {
                datosInvalidosLog = createLog("La hidrologia " + chosenHydrology + " tiene barras inválidas", LOG_TYPE.WARNING);
            }
            addDetailsToLog(datosInvalidosLog, "La barra " + inodes[i].nodeName + " no se encontró o se cargó incorrectamente");
        }
    } else {
        if (typeof hydrologyInvalidLog === 'undefined') {
            hydrologyInvalidLog = createLog("La carga de la hidrología actual falló", LOG_TYPE.WARNING);
        }
    }
    
    const active = inodes[i].active === 1 ? "Si" : "No";
    let tooltip = generateTooltip(["Barra: " + inodes[i].nodeName.replace(/_/gi, " "), 
                                  "Activo: " + active, 
                                  "Costo marginal: " + parseFloat(currentBusTime.marginal_cost).toFixed(2) + " [USD/MWh]", 
                                  "Demanda: " + parseFloat(currentBusTime.BarRetP).toFixed(2) + " [MWh]"]);

    let node = {
      id: inodes[i].id,
      title: tooltip,
      marginal_cost: currentBusTime.marginal_cost,
      demand: currentBusTime.BarRetP
    };
	
		const configSelected = {
		  hasLoad: inodes[i].hasLoad,
		  hasGenerators: inodes[i].hasGenerators,
		  selected: true,
		  label: inodes[i].nodeName,
		};

		const configUnselected = {
		  hasLoad: inodes[i].hasLoad,
		  hasGenerators: inodes[i].hasGenerators,
		  selected: false,
		  label: inodes[i].nodeName
		};

		node.image = {
			unselected: createBusImage(configUnselected,
			  {
				'costo_marginal':
				  {
					shape: 'circle',
					value: currentBusTime.marginal_cost
				  }
			  }),
			selected: createBusImage(configSelected,
			  {
				'costo_marginal':
				  {
					shape: 'circle',
					value: currentBusTime.marginal_cost
				  }
			  })
		  };
		  
    inodes[i].marginal_cost = currentBusTime.marginal_cost;
    inodes[i].demand = currentBusTime.BarRetP;
    inodes[i].title = tooltip;

    updates.push(node);
  }

  return updates;
}

/**
 * Actualiza barras ante un cambio en posición
 * @param nodes actualiza posiciones de los nodos-barra
 */
function updateBuses(nodes){
  nodes.update(getNodesUpdates());
}

/**
 * Retorna verdadero si los datos de la barra con ide busID está cargada
 * @param busID Identificador de la barra
 * @returns {boolean} true si los datos están cargados, false si no.
 */
function getBusLoad(busID){

  if (CONFIG.RESULTS_DISABLED) return;
  let busLoad=false;

  /* Se cargan los datos de la barra seleccionada. */
  let callBack = function (x) {
    return function() {
      if (x.readyState === 4){
        let busData = JSON.parse(x.responseText);

        if(!(busID in hydrologyTimes[chosenHydrology]['buses'])) {
          hydrologyTimes[chosenHydrology]['buses'][busID] = busData;
        }

        for(let i = 0; i < busData.length; i++){
          if(parseFloat(busData[i]["BarRetP"]) > 0){
            busLoad = true;
            break;
          }
        }
      }
    };
  };

  /* Si los datos estan cargados se ejecuta este método. */
  let preLoad = function (data) {
    for(let i = 0; i < data.length; i++){
      if(parseFloat(data[i]["BarRetP"]) > 0){
        busLoad = true;
        break;
      }
    }
  };

  loadTypeFile(busID, preLoad, callBack, chosenHydrology, 'buses');

  return busLoad;
}


