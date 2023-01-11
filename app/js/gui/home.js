"use strict";

let currentJsonProject;
let currentProjectName;
let project_name_regex = /^[a-z0-9][a-z0-9 -]*[a-z0-9]$/i;

/**
 * Verifica estructura de path de acuerdo a sistema operativo
 * @param simplePath path entregado como ubicación de proyecto
 * @returns {boolean} true si corresponde a estructura soportada por sistema operativo, false si no.
 */
function verifyPathAccordingToOS(simplePath){
    if(isValidUrl(simplePath)) return true;
    var platform = navigator.platform;

    switch(platform) {
      case "Linux x86_64":
        return verLinuxPath(simplePath);
      case "Win32":
        return verWinPath(simplePath);
      case "Macintosh":
        return true;
      default:
        return true;
    }
}

/**
 * Verifica si el path entregado corresponde a una URL HTTP o HTTPS valida
 * @param simplePath Path entregado como string
 * @returns {boolean} true si el path es una URL valida, false si no.
 */
function isValidUrl(path){
  var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  var url = new RegExp(urlRegex, 'i');
  return path.length < 2083 && url.test(path);
}
/**
 * Verifica si el path entregado posee estructura soportada por Linux
 * @param simplePath Path entregado como string
 * @returns {boolean} true si corresponde a estructura soportada por sistema operativo, false si no.
 */
function verLinuxPath(simplePath){

    var linRegex = "^(/[^/]*)";


    if(simplePath.search(linRegex)>=0)
        return true;
    else
		return false;
}

/**
 * Verifica si el path entregado como parámetro corresponde al soportado por MacOS
 * @param simplePath Path entregado como string
 * @returns {boolean} true si corresponde a estructura soportada por sistema operativo, false si no.
 */
function verMacPath(simplePath){
    /**/
 return true;
}

/**
 * Verifica si el path entregado corresponde a uno soportado por Windows
 * @param simplePath Path entregado como string
 * @returns {boolean} true si corresponde a estructura soportada por sistema operativo, false si no.
 */
function verWinPath(simplePath){

    var winRegex = "/^[a-z]:((\\\\|\\/)[a-z0-9\\s_@\\-^!#$%&+={}\\[\\]]+)";

    if(simplePath.search(winRegex)>=0)
        return true;
    else
		return true;
}



/**
 * Parsea una fila de la tabla con proyecto, retorna html para la fila.
 * @param fileName Nombre del archivo como string
 */
function addProjectRow(fileName){

  return ("<div> <label class='pull-left'>{name}</label> " +
         "<img class=\"new-project-image pull-right\" onclick=\"openConfiguration('{name}')\" id=\"settings\" src=\"resources/home/settings.png\" />" +
         "<img class=\"new-project-image pull-right\" onclick=\"openRemove('{name}')\" id=\"minus\" src=\"resources/home/minus.png\" />" +
         "<img class=\"new-project-image pull-right\" onclick=\"startProject('{name}')\" id=\"plus\" src=\"resources/home/start.png\" />" +
         "</div><br/> <hr class='hr-primary'/>").formatUnicorn({name: fileName});
}

/**
 * Carga la lista de proyectos una vez que el modulo de filesystem este cargado.
 */
function onFSReady() {
  let projectsDiv = $("#existing-projects");
  projectsDiv.empty();
  fileSystem.ls(fileSystem.projects, arr => {
    arr.sort((f1,f2) => f1.name.localeCompare(f2.name));
    arr.map(file => {
      if(!file.isDirectory) return;
      projectsDiv.append($(addProjectRow(file.name)));
    });
  });
}

/**
 * Elimina el proyecto seleccionado.
 * @param name nombre de la carpeta.
 * @param action
 */
function removeAction(name){
  fileSystem.getFolder(fileSystem.projects,name,project => {fileSystem.remove(project,onFSReady);});
}

/**
 * Abre la ventana de configuración.
 * @param name nombre del proyecto
 */
function openConfiguration(name){
  $('#configModal').modal();
  currentProjectName = name;
  fileSystem.getFolder(fileSystem.projects, name, project =>
      fileSystem.getFile(project, "config.json", configFile =>
        fileSystem.readFromFile(configFile, text => {
              currentJsonProject = JSON.parse(text);
              $('#results-on').prop('checked', !currentJsonProject.RESULTS_DISABLED);
              //$('#generadores-agregados').prop('checked', currentJsonProject.AGGREGATE_GENERATORS_ENABLED);
              $('#debug-mode').prop('checked', currentJsonProject.ENABLE_TIME_LOG);
              $('#ruta-proyecto').val(currentJsonProject.BASE_FOLDER_NAME + currentJsonProject.MODEL_FOLDER_NAME);
              $('#ruta-topologia').val(currentJsonProject.TOPOLOGY_FOLDER);
              $('#ruta-resultados').val(currentJsonProject.RESULTS_FOLDER);
        })));
  $('#projectConfigName').text(name);
}

/**
 * Abre la ventana de confirmacion de eliminar proyecto.
 * @param name nombre del proyecto
 */
function openRemove(name){
  $('#removeModal').modal();
  currentProjectName = name;
  $('#projectRName').text(name);
}

/**
 * Abre la ventana para agregar archivos.
 * @param name
 */
function openFilesWindow(name){
  $('#filesModal').modal();


  $('#projectFName').text(name);
}

/**
 * Redirige la apliacion al visualizador.
 * @param name Nombre del proyecto
 */
function startProject(name){
  console.log("Se entro en startProject");
  fileSystem.getFolder(fileSystem.projects, name, project =>
    fileSystem.getFile(project, "config.json", configFile =>
      fileSystem.readFromFile(configFile, text => {
        var cfg = JSON.parse(text);
        cfg.RESULTS_ENABLED = !(cfg.RESULTS_DISABLED)
        var url = "app.html?base_uri={BASE_FOLDER_NAME}&"+
                                        "model={MODEL_FOLDER_NAME}&"+
                                        "debug={ENABLE_TIME_LOG}&"+
                                        "results={RESULTS_ENABLED}&"+
                                        "standalone=true";
        url = url.formatUnicorn(cfg);
        window.location.href = url
      })));
}

/**
 * Guarda el archivo de configuración.
 */
function saveConfig(){

  var rutaProyecto = $("#ruta-proyecto").val();
  //console.log(verifyPathAccordingToOS(rutaProyecto));
  if(rutaProyecto!=="" && verifyPathAccordingToOS(rutaProyecto) ){
      savePath(rutaProyecto, 'proyecto');

      currentJsonProject.RESULTS_DISABLED = !$('#results-on').is(':checked');
      currentJsonProject.ENABLE_TIME_LOG = $('#debug-mode').is(':checked');
      console.log(currentJsonProject);
      console.log(currentProjectName);
      fileSystem.getFolder(fileSystem.projects, currentProjectName, project =>
          fileSystem.getFile(project, "config.json", configFile =>
              fileSystem.writeToFile(configFile, JSON.stringify(currentJsonProject), () => {
              })));

      $('#configModal').modal('toggle');
  }
}

/**
 * Se guarda el path en el currentJsonProject
 * @param path
 */
function savePath(path) {
  // Guardamos el path con el proyecto.
  var baseIdx = path.lastIndexOf("/");
  var modelIdx = path.length;
  if (baseIdx == modelIdx - 1)
  {
      baseIdx = path.substring(0, baseIdx - 1).lastIndexOf("/");
      modelIdx = path.length - 1;
  }
  currentJsonProject.BASE_FOLDER_NAME = path.substring(0, baseIdx + 1); // Path sin nombre del modelo, pero con el "/" final
  currentJsonProject.MODEL_FOLDER_NAME = path.substring(baseIdx + 1, modelIdx); // Modelo (Ej. "CHL")
}

/**
 * Función de conveniencia que cierra el modal dado por modalID
 * @param modalID Nombre (string) del modal a cerrar
 */
function closeModal(modalID) {
    $('#' + modalID).modal('toggle');
}

/**
 * Función que permite crear un nuevo proyecto, dado el nombre que el usuario escribe en el text-box
 */
function createNewProject() {
    // Apretando la tecla enter.

    var project = $('#inputName').val();
    if(project_name_regex.test(project)){
        $('#valid p').text("");

        let json = {
            "BASE_FOLDER_NAME": "",
            "MODEL_FOLDER_NAME": "",
            "SIMULATION_FOLDER_NAME": "",
            "AGGREGATE_GENERATORS_ENABLED": false,
            "ENABLE_TIME_LOG": false,
            "RESULTS_DISABLED": false
        };

        fileSystem.createFolder(fileSystem.projects, project, project =>
            fileSystem.createFile(project, "config.json", configFile =>
                fileSystem.writeToFile(configFile, JSON.stringify(json), () => {
                })));


        $("#existing-projects").append($("<p>" + addProjectRow(project) + "</p>"));
        $('#inputName').val('');

        $('#newProjectModal').modal('toggle');
    }
}

// Esto ejecuta la acción del input del modal para agregar un nuevo proyecto.
$(function(e){
  // Al apretar una tecla en la ventana emergente se ejecuta esta acción.
  $('#aboutModal').keypress(function(e) {
      if (e.which === 13) {
          createNewProject();
    }
  })
});

$('#inputName').on("input",(event) =>
  {
    var input_content = event.target.value;
    if(!project_name_regex.test(input_content)){
      $('#valid p').text("Nombre de proyecto inválido. Se permiten caracteres alfanumericos [0-9a-zA-Z] con guiones (-) y espacios ( ) entre medio.");
    } else {
       $('#valid p').text("");
    }
  });

$('#ruta-proyecto').on("input",(event) =>
  {
    var rutaProyecto = event.target.value;
    if(rutaProyecto==="" || !verifyPathAccordingToOS(rutaProyecto) ){
      $('#valid-path p').text("Ruta inválida");
    } else {
       $('#valid-path p').text("");
    }
  });
