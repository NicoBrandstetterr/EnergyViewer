"use strict";

/**
 * En este archivo se encuentran todos los métodos en relación a la carga de resultados.
 */


/**
 * Estructura que guarda todos los datos de los resultados, las llaves son las hidrologías y estas a su vez
 * son diccionarios que contienen como llaves los tipos de datos asociados.
 */


/*var bReq = new XMLHttpRequest();


bReq.onreadystatechange = function () {
  if (this.readyState === 4) {
    hydrologyList = JSON.parse(this.responseText);
    if (hydrologyList.length > 0) {
      chosenHydrology = hydrologyList[0];
      loadLinesFiles();
      buildDropdownHydrology();
    }
  }
};

try {
  bReq.open("GET", CONFIG.URL_HYDROLOGIES, false);
  bReq.send();
} catch(e) {
  console.log("No está el archivo con la lista de hidrologías existentes.");
}*/

let hydrologyTimes = {};
loadHydrologies();

/**
 * Carga la lista de hidrologías disponibles.
 */
function loadHydrologies(){

  let hReq = new XMLHttpRequest();

  // Función que se ejecuta al cargar el archivo de las hidrologías.
  let onLoad = function (req) {
    return function() {
      if (req.readyState === 4) {
        hydrologyList = JSON.parse(req.responseText); // guarda la lista
        if (hydrologyList.length > 0) {
          hydrologyTimes={}
          chosenHydrology = hydrologyList[0];
          CONFIG.BUSES_FOLDER = CONFIG.BUSES_FOLDER.formatUnicorn({hydrology:chosenHydrology});
          CONFIG.CENTRALS_FOLDER = CONFIG.CENTRALS_FOLDER.formatUnicorn({hydrology:chosenHydrology});
          CONFIG.LINES_FOLDER = CONFIG.LINES_FOLDER.formatUnicorn({hydrology:chosenHydrology});
          CONFIG.RESERVOIRS_FOLDER = CONFIG.RESERVOIRS_FOLDER.formatUnicorn({hydrology:chosenHydrology});
          if(!CONFIG.RESULTS_DISABLED) loadLinesFiles();
          buildDropdownHydrology();
        } else {
          createLog('El archivo de hidrologías no tiene datos.', LOG_TYPE.ERROR);
        }
      }
    }
  };

  hReq.onreadystatechange = onLoad(hReq);
  try {
    hReq.open("GET", CONFIG.URL_HYDROLOGIES, false);
    hReq.send();
  } catch (err){
    createLog('No esta el archivo de hidrologías.', LOG_TYPE.ERROR);
  }
}


let tReq = new XMLHttpRequest();
tReq.onreadystatechange = function () {
  if (this.readyState === 4) {
    let line = JSON.parse(this.responseText);
    if (line.length > 1) {
      hydrologyTimes[chosenHydrology].lines[line[0].id] = line;

    } else {
      console.log("Linea no tiene archivo de resultados.");
    }
  }
};

/**
 * Función que carga todos los archivos de resultado de las líneas de la actual hidrología.
 */
async function loadLinesFiles(){
  if(typeof lines === 'undefined') return;

  // Esto solo revisa si la estructura fue creada.
  checkHydrologyTimes(chosenHydrology);

  let noLineResultsLog = [];
  
  // for (let i = 0; i < lines.length; i++) {
  //     loadLineFile(lines[i].id, chosenHydrology, noLineResultsLog);
  // }
  lines.forEach(async function(line) {
    await loadLineFile(line.id, chosenHydrology, noLineResultsLog);
  });
}

/**
 * Carga el resultado de la línea si es necesario. Guarda en la estructura hydrologyTimes los resultados
 * obtenidos del archivo leído.
 * @param lineID identificador de la línea.
 * @param hydro hidrología del resultado a leer.
 */
// function loadLineFile(lineID, hydro, noLineResultsLog){

//   // Método que se usa al cargar correctamente el archivo, guarda los datos si no fueron previamente cargados.
//   let lineOnLoad = function(req, hydrology){
//     return function() {
//       if (req.readyState === 4){
//         let lineData = JSON.parse(req.responseText);

//         // Siempre debería entrar aquí.
//         if(!(lineID in hydrologyTimes[hydrology].lines)) {
//           hydrologyTimes[hydrology].lines[lineID] = lineData;
//         }
//       }
//     };
//   };

//   // Creamos una petición.
//   let lineReq = new XMLHttpRequest();

//   // En caso de cambiar de estados usamos el método lineOnLoad.
//   lineReq.onreadystatechange = lineOnLoad(lineReq, hydro);

//   // En caso de que los datos no estén cargados, cargamos el archivo de la línea.
//   if(!(lineID in hydrologyTimes[hydro].lines)) {
//     try {
//       // Mandamos la petición vía get.
//       lineReq.open("GET", getUrlByHydrology('lines', hydro) + getTypeToFileString('lines') + lineID + ".json", false);
//       lineReq.send();
//     } catch (err) {
//       if (noLineResultsLog.length === 0) {
// 		  noLineResultsLog.push(createLog('Hay líneas sin archivo de resultados', LOG_TYPE.ERROR));
// 	  }
async function loadLineFile(lineID, hydro, noLineResultsLog) {
  // Método que se usa al cargar correctamente el archivo, guarda los datos si no fueron previamente cargados.
  let lineOnLoad = function(lineData, hydro) {
    if (!(lineID in hydrologyTimes[hydro].lines)) {
      hydrologyTimes[hydro].lines[lineID] = lineData;
    }
  };

  // En caso de que los datos no estén cargados, cargamos el archivo de la línea.
  if (!(lineID in hydrologyTimes[hydro].lines)) {
    try {
      // Mandamos la petición vía get.
      let response = await fetch(getUrlByHydrology('lines', hydro) + getTypeToFileString('lines') + lineID + ".json");
      let lineData = await response.json();
      lineOnLoad(lineData, hydro);
    } catch (err) {
      if (noLineResultsLog.length === 0) {
        noLineResultsLog.push(createLog('Hay líneas sin archivo de resultados', LOG_TYPE.ERROR));
      }
	  addDetailsToLog(noLineResultsLog[0], "Línea ID: "+lineID);
    }
  }

}

/**
 *
 * Se encarga de cargar datos de una barra y ejecutar la acción pedida con los datos cargados.
 *
 * @param busId identificador de la barra
 * @param noLoadAction función que se ejecuta si los datos estan ya cargados en el cache. Debe recibir un json con los resultados de esa barra.
 * @param loadAction función que se ejecuta al cargar correctamente los datos. Debe recibir el xmlhttprequest por parámetro.
 * @param hydro
 *
 */
function loadBusFile(busId, noLoadAction , loadAction, hydro) {

  if(typeof hydro === 'undefined') hydro = chosenHydrology;

  // Verifica si esta la estructura de datos necesaria.
  checkHydrologyTimes(hydro);

  // verifico si los resultado ya fueron cargados.
  if(busId in hydrologyTimes[hydro].buses) {
    noLoadAction(hydrologyTimes[hydro].buses[busId]);
  } else {
    // cargo los datos que no fueron cargados previamente.
    let chartReq = new XMLHttpRequest();
    chartReq.onreadystatechange = loadAction(chartReq, hydro);
    try {
      chartReq.open("GET", getUrlByHydrology('buses', hydro) + getTypeToFileString('buses') + busId + ".json", false);
      chartReq.send();
    } catch (err) {
      createLog('El archivo de resultados de la barra ' + busId + " no existe", LOG_TYPE.ERROR);
    }
  }
}

/**
 *
 * Se encarga de cargar datos de un elemento y ejecutar la acción pedida con los datos cargados.
 *
 * @param elementId id del elemento a cargar
 * @param noLoadAction función que se ejecuta si los datos ya estan cargados, toma como parámetro un json con los datos.
 * @param loadAction función que se ejecuta si los datos no estan cargados, requiere como primer parámetro un XMLHTTPRequest y el segundo la hidrología a cargar.
 * @param hydro hidrología a cargar, en caso de no estar definida se usa la que esta en el momento.
 * @param typeId tipo de dato a cargar ('buses', 'lines', 'centrals', 'reservoirs')
 */
function loadTypeFile(elementId, noLoadAction, loadAction, hydro, typeId){
  if(typeof hydro === 'undefined') hydro = chosenHydrology;

  // Verifica si esta la estructura de datos necesaria.
  checkHydrologyTimes(hydro);

  // verifico si los resultado ya fueron cargados.
  if(elementId in hydrologyTimes[hydro][typeId]) {
    noLoadAction(hydrologyTimes[hydro][typeId][elementId]);
  } else {
    // cargo los datos que no fueron cargados previamente.
    let chartReq = new XMLHttpRequest();
    chartReq.onreadystatechange = loadAction(chartReq, hydro);
    try {

      // Se ejecuta un get pidiendo los datos de un archivo.
      chartReq.open("GET", getUrlByHydrology(typeId, hydro) + getTypeToFileString(typeId) + elementId + ".json", false);
      chartReq.send();
    } catch (err) {

      // Se muestra en pantalla si existió algún tipo de error.
      createLog('El archivo de resultados ' + getTypeToString(typeId) + ' ' + elementId + " no existe", LOG_TYPE.ERROR);
    }
  }
}

/**
 * Construye la estructura si es necesario.
 *
 * Esta estructura nos sirve para guardar en memoria los datos ya cargados,
 * así no tenemos que volver a gastar recursos en descargar archivos.
 */
function checkHydrologyTimes(hydro){

  if (!(hydro in hydrologyTimes)){
    hydrologyTimes[hydro] = {
      lines: {},
      buses: {},
      centrals: {},
      reservoirs: {}
    };
  }
}