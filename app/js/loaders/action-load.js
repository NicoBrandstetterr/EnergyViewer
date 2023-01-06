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

  var select = document.getElementById("hydrology-picker");

  // Tomamos el valor del select.
  chosenHydrology = parseInt(select.options[select.selectedIndex].value);

  // Cargamos los archivos necesarios
  loadLinesFiles();
  
  // Actualizamos los datos en los tooltip
  updateLines(currentEdges);
  updateBuses(currentNodes);
  updateCentrals(currentNodes);

  // Cambiamos la ruta de los archivos.
  changeConfigHydrology();
}

logTime("action-load.js");
