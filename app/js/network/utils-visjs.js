"use strict";

/**
 *  En este archivo irán todas las variables necesarias para el funcionamiento de visjs.
 *  También tendrá métodos auxiliares.
 */

/**
 * Enumerador que sirve para mejor entendimiento de código.
 * @type {{ELECTRIC: number, HYDRIC: number, GEO: number}}
 */
let TOPOLOGY_TYPES = {
	ELECTRIC: 1,
	HYDRIC: 2,
	GEO: 3
};

/**
 * Variables relacionadas con la red electrica.
 */
let electricNetwork;
const electricContainer = document.getElementById('my-electric-network');
let electricNodes;
let electricEdges;
let edgesArray = [];
let nodesArray = [];

/**
 * Variables relacionadas con la red georeferenciada.
 */
let geoNetwork;
const geoContainer = document.getElementById('my-geo-network');
let geoNodes;
let geoEdges;
let edgesMArray = [];
let nodesMArray = [];

/**
 * Variables relacionadas con la red hídrica.
 */
let hydricNetwork;
const hydricContainer = document.getElementById('my-hydric-network');
let hydricNodes;
let hydricEdges;
let edgesHArray = [];
let nodesHArray = [];
let data, mapdatabasic, mapdatadetailed;

/**
 * Variables que nos indican el actual estado de la red mostrada.
 */
let currentTopologyType = TOPOLOGY_TYPES.ELECTRIC;
let currentNetwork;
let currentContainer;
let currentNodes;
let currentEdges;

/**
 * Variables relacionadas con las hidrologías y resultados.
 */
let chosenTime = 0;
let chosenHydrology;
let hydrologyList;

/**
 * Variables adicionales.
 */
let maxid = 0;
let escala = -500;
let canvas;
let visjsctx;
let options;
let lastUpdateTime;
let defaultPhysicsOptions;

/**
 * Retorna un png que contiene la actual red mostrada.
 */
function canvasToPNG() {
  return currentContainer.firstChild.firstChild.toDataURL();
}

/**
 * Función que retorna verdadero si la variable es 0 o undefined.
 */
let zero = function(x){
  if(typeof x == 'undefined'){
    return true;
  }
  return -0.01<x && x<0.01;
};

/**
 * Cambia los archivos a buscar dependiendo de la hidrología elegida.
 */
function changeConfigHydrology(){
  CONFIG.BUSES_FOLDER = BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Scenarios/" + chosenHydrology + "/Bus/";
  CONFIG.LINES_FOLDER = BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Scenarios/" + chosenHydrology + "/Lines/";
  CONFIG.CENTRALS_FOLDER = BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Scenarios/" + chosenHydrology + "/Centrals/";
  CONFIG.RESERVOIRS_FOLDER = BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Scenarios/" + chosenHydrology + "/Reservoirs/";
}

/**
 *
 * Toma el tipo del elemento y una hidrología y retorna la ruta de la carpeta del tipo.
 * @param type
 * @param hydrology
 */
function getUrlByHydrology(type, hydrology){
  let urlType = {
    'buses': function (hydro) {return BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Scenarios/" + hydro + "/Bus/"; },
    'lines' : function (hydro) {return BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Scenarios/" + hydro + "/Lines/"; },
    'centrals': function (hydro) {return BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Scenarios/" + hydro + "/Centrals/"; },
    'reservoirs': function (hydro) {return BASE_FOLDER_NAME + MODEL_FOLDER_NAME + "/Scenarios/" + hydro + "/Reservoirs/"; },
  };

  return urlType[type](hydrology);
}

/**
 *
 * Retorna un string el tipo de elemento a cargar.
 *
 * @param type
 */
function getTypeToFileString(type){
  let urlType = {
    'buses': function () {return "bus_"; },
    'lines' : function () {return "line_"; },
    'centrals': function () {return "central_"; },
    'reservoirs': function () {return "reservoir_"; },
  };

  return urlType[type]();
}

/**
 *
 * Retorna el nombre en español del tipo entregado.
 *
 * @param type
 */
function getTypeToString(type){
  let urlType = {
    'buses': function () {return "de la barra"; },
    'lines' : function () {return "de la línea"; },
    'centrals': function () {return "de la central"; },
    'reservoirs': function () {return "del embalse"; },
  };

  return urlType[type]();
}

/*
 * Caché de imágenes.
 */
let BusImages = {};

function fillDefaults(config) {
	let filledConfig = {};
	
	let configProperty = function (fc, c, x, defaultValue) {
		if (c.hasOwnProperty(x))
			fc[x] = c[x];
		else 
			fc[x] = defaultValue;
	}
	
	configProperty(filledConfig, config, 'hasGenerators', false);
	configProperty(filledConfig, config, 'hasLoad', false);
	configProperty(filledConfig, config, 'selected', false);
	configProperty(filledConfig, config, 'label', "");
	configProperty(filledConfig, config, 'quantile', -1);
	
	return filledConfig;
}



/*
 * Función que crea las imágenes correspondientes a las barras, en SVG
 * config trae los parámetros necesarios para la creación de la imagen
 * ejemplo (con los valores por default): 
	config = {
		hasGenerators: true,
		hasLoad: true,
		selected: false,
		label: "",
		...
	}
	debe contener objetos del tipo:
	metrics = {
		"metric1": {
			value: ,
			min: ,
			max: ,
			...
		},
		...
	}		

 */
 
function createBusImage(dirtyConfig, metrics) {
	
	if (typeof metrics === "undefined") {
		metrics = {};
	}
	
	// Calcula el cuantil [0, 6], con 0 menor que el mínimo, 6 más que el máximo
	let val; 
	let range;
	let step;
	// -1 es el cuantil por defecto, con negro.
	let quantile = -1;
	
    let numberOfQuantiles = CONFIG.NUMBER_OF_QUANTILES;
		
	if ($("#marginal-cost-toggle")[0].checked) {		
		if (Object.keys(metrics).length > 0) {
			val = metrics.costo_marginal.value;
			if (val <= CONFIG.FAILURE_THRESHOLD) {
				if (val < CONFIG.LOW_MARGINAL_COST) {
					quantile = 0;
				} if (val > CONFIG.HIGH_MARGINAL_COST) {
					quantile = numberOfQuantiles;
				} else {
					range = CONFIG.HIGH_MARGINAL_COST - CONFIG.LOW_MARGINAL_COST;
					step = range/numberOfQuantiles;
					for (let i = 1; i <= numberOfQuantiles; i++) {
						if (val < (CONFIG.LOW_MARGINAL_COST + i*step)) {
							quantile = i;
							break;
						}
					}
				}
			} else {
				quantile = numberOfQuantiles+1;
			}
		}
	}
	
	dirtyConfig.quantile = quantile;
		
	let config = fillDefaults(dirtyConfig);
	const hash = JSON.stringify(config);
	

	if (!(hash in BusImages)) {
		let formatConfig = {};
		Object.assign(formatConfig,config);
		// Setea el tamaño de la imagen
		formatConfig.width = 80;
		formatConfig.height = 10;
		formatConfig.ypos = formatConfig.height*0.15;
		formatConfig.barWidth = formatConfig.width-2*formatConfig.height;
		var i;
		var svgComponents = [];
		svgComponents.push('<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}">');
		
		// Dibuja la barra
		svgComponents.push('<rect x="{height}" y="{ypos}" width="{barWidth}" height="70%" fill="{color}" stroke-width="1" stroke="#060606">');
		
		formatConfig.color = "rgba(" + getQuantileColor(config.quantile, numberOfQuantiles) + (config.selected?",1)":",0.8)");
		
		svgComponents.push('</rect>');
		//data += '</circle>';
		
		// Muestra spikes para valores menos que el mínimo y más que el máximo
		let width = formatConfig.width;
		let height = formatConfig.height;
		let arrowPoints = [];
		// Flecha de entrada
		formatConfig.radius = height*.3;
		formatConfig.generatorCircleX = height*0.25
		formatConfig.generatorCircleY = height*0.25

		if (config.hasGenerators) {

			svgComponents.push('<polyline points="');
			arrowPoints = [];

			arrowPoints.push([height*.16,height*.3]);
			arrowPoints.push([height*.76,height*.3]);
			arrowPoints.push([height*.76,height*.1]);
			arrowPoints.push([height*1.36,height*.5]);
			arrowPoints.push([height*.76,height*.9]);
			arrowPoints.push([height*.76,height*.7]);
			arrowPoints.push([height*.16,height*.7]);
            arrowPoints.push([height*.16,height*.3]);
			i = arrowPoints.length;
			while (i--)
				svgComponents.push(arrowPoints[i][0] + ',' + arrowPoints[i][1] + ' ');
			svgComponents.push('" style="fill:lime;stroke:green;stroke-width:1;" />');
		}
		
		// Flecha de salida
		if (config.hasLoad) {
			svgComponents.push('<polyline points="');
			arrowPoints = []

			arrowPoints.push([width-height*1.3,height*.3]);
			arrowPoints.push([width-height*.7,height*.3]);
			arrowPoints.push([width-height*.7,height*.1]);
			arrowPoints.push([width-height*.1,height*.5]);
			arrowPoints.push([width-height*.7,height*.9]);
			arrowPoints.push([width-height*.7,height*.7]);
			arrowPoints.push([width-height*1.3,height*.7]);
            arrowPoints.push([width-height*1.3,height*.3]);

			i = arrowPoints.length;
			while (i--)
				svgComponents.push(arrowPoints[i][0] + ',' + arrowPoints[i][1] + ' ');
			svgComponents.push('" style="fill:red;stroke:darkred;stroke-width:1;" />');
		}
		
		// Label
		
		svgComponents.push('</svg>');
		
		var DOMURL = window.URL || window.webkitURL || window;

		//console.log(svgComponents.join(svgComponents).formatUnicorn(config));
		let svgString = svgComponents.join('').formatUnicorn(formatConfig);
	
		var svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
		BusImages[hash] = DOMURL.createObjectURL(svg);
	}
	return BusImages[hash];
}

logTime("utils-visjs.js");