'use strict';

/**
 *List files from path
 */
function getFiles(){
    var inp = document.getElementById("folder-input");
// Access and handle the files
    var i;
    for (i = 0; i < inp.files.length; i++) {
        var file = inp.files[i];
        // do things with file
    }
}

/**
 * Muestra archivos
 */
function showFiles(){
    // console.log(getFiles("./data/CHL"));
}

/**
 * Actualiza los datos en el network (grafo) según la hidrología elegida en el select.
 */
function updateHydrology() {
  var time = getCurrentTime();

  var select = document.getElementById("hydrology-picker");
  
  // Tomamos el valor del select.
  chosenHydrology = parseInt(select.options[select.selectedIndex].value);
//   console.log("Tiempo en obtener valores del select: ",time-getCurrentTime(),"ms")

  // Cargamos los archivos necesarios
  time=getCurrentTime();
  loadLinesFiles();
//   console.log("loadlinesfiles: ",time-getCurrentTime(),"ms")
  
  // Actualizamos los datos en los tooltip
  time=getCurrentTime();
  updateLines(currentEdges);
//   console.log("updateLines: ",time-getCurrentTime(),"ms")

  time=getCurrentTime();
  updateBuses(currentNodes);
//   console.log("updateBuses: ",time-getCurrentTime(),"ms")
  
  time=getCurrentTime();
  updateCentrals(currentNodes);
//   console.log("updateCentrals: ",time-getCurrentTime(),"ms")

  time=getCurrentTime();
  // Cambiamos la ruta de los archivos.
  changeConfigHydrology();
//   console.log("changeConfigHydrology: ",time-getCurrentTime(),"ms")

}

logTime("action-load.js");
