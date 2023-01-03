"use strict";

/**
 * Configura gráfico apilado
 * @param canvas Objeto HTML donde se dibuja gráfico
 * @param xlabel Llave para obtener valores asociados a puntos en eje  X desde dataset.
 * @param type Tipo de gráfico
 * @param dataset Datos como diccionario de donde se obtienen valores a graficar
 * @param chartName Nombre de gráfico
 * @param lblStrX Etiqueta de nombre de eje X
 * @param lblStrY Etiqueta de nombre de eje Y
 * @param selectedElement Elemento seleccionado del cual se genera este gráfico apilado
 * @param PDTO Estructura de datos abstracta que representa
 */
function setUpChart(canvas, xlabel, type, dataset, chartName, lblStrX, lblStrY, selectedElement, PDTO) {

    const ctx = canvas[0].getContext('2d');

    let config = {
        type: type, // Charts de tipo 'line' solo usan un color
        data: {
            labels: xlabel,
            datasets: dataset
        },
        options: {
            title:{
                display:true,
                text: chartName
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'index',
                intersect: false
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero:true
                    },
                    stacked: true,
                    scaleLabel: {
                        display: true,
                        labelString: lblStrY
                    }
                }],
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: lblStrX
                    }
                }]
            },
            responsive: true
        }
    };

  let myChart = new Chart(ctx, config);

  let hydrolist = $("#" + (PDTO.print()).replace(/ /gi,"_").normalize() + "-" + selectedElement);
  hydrolist.prop('disabled', true).trigger("chosen:updated");


  // Se agregan eventos con respecto al grafico creado.
  addGraphEvents(myChart, PDTO, selectedElement);
}

/**
 * Agrega datos a gráfico
 * @param allData Conjunto de datos como diccionario
 * @param xAxis Llave identificadora de valores para eje X
 * @param yAxis Llave identificadora de valores para eje y
 * @param setDeDatos Arreglo vacío que recibe datos procesados
 * @param xlabel Etiqueta del eje X en gráfico
 */
function addDataSets(allData, xAxis, yAxis, setDeDatos, xlabel) {

    let color = 0;
    for (const key in allData) {
        // check if the property/key is defined in the object itself, not in parent
        if (allData.hasOwnProperty(key)) {
            const data = allData[key];
            if (data.length > 0) {
                let ylabel = [];
                let title = key;

                for (let i = 0; i < data.length; i++) {
                    ylabel.push(data[i][yAxis]);
                }

                if (color === 0){
                    for (let i = 0; i < data.length; i++) {
                        xlabel.push(data[i][xAxis]);
                    }
                }

                // Colores respecto a CONFIG
                let colorBkg;
                switch(title) {
                    case "Serie":
                        colorBkg = CONFIG.COLOR_SERIE;
                        break;
                    case "Embalse":
                        colorBkg = CONFIG.COLOR_EMBALSE;
                        break;
                    case "Pasada":
                        colorBkg = CONFIG.COLOR_PASADA;
                        break;
                    case "Minihidro":
                        colorBkg = CONFIG.COLOR_MINIHIDRO;
                        break;
                    case "Solar":
                        colorBkg = CONFIG.COLOR_SOLAR;
                        break;
                    case "Eolica":
                        colorBkg = CONFIG.COLOR_EOLICA;
                        break;
                    case "Carbon":
                        colorBkg = CONFIG.COLOR_CARBON;
                        break;
                    case "Diesel":
                        colorBkg = CONFIG.COLOR_DIESEL;
                        break;
                    case "GNL":
                        colorBkg = CONFIG.COLOR_GNL;
                        break;
                    case "Biomasa":
                        colorBkg = CONFIG.COLOR_BIOMASA;
                        break;
                    case "Cogeneracion":
                        colorBkg = CONFIG.COLOR_COGENERACION;
                        break;
                    default:
                        colorBkg = randomColor();
                }
                if(title == "null") title = "H1";
                const dataset = {
                  label: title,
                  data: ylabel,
                  borderWidth: 0,
                  lineTension: 0,
                  backgroundColor: colorBkg,
                  borderColor: colorBkg
                };
                color += 1;
                setDeDatos.push(dataset);
            }
        }
    }
}


/**
 * Agrega datos al dictionario centralsData, esto es para dar formato al dataset para un gráfico apilado.
 * @param data Datos
 * @param tipo Tipo de generador
 * @param centralsData Arreglo de datos de generadores
 * @param yAxis Llave de valores de eje Y
 */
function addCentralData(data, tipo, centralsData, yAxis) {

    if (!(tipo in centralsData)){
        centralsData[tipo] = [];
    }

    // Caso en el que ya hay datos
    if (centralsData[tipo].length > 0) {
        for(let i = 0; i < data.length; i++){
            centralsData[tipo][i][yAxis] += data[i][yAxis];
        }
    } else { // Datos nuevos agregados completamente, solo interesa time y generación.
      for(let i = 0; i < data.length; i++){
        centralsData[tipo][i] = { time : i+1,  [yAxis] : data[i][yAxis]};
        console.log(yAxis, centralsData[tipo][i]);
      }
    }
}


/**
 * Funcion para cargar datos de las centrales (generadores)
 * @param x
 * @param m
 * @param centralsData Arreglo con los datos de los generadores
 * @param yAxis Llave para acceder a valores de eje Y
 * @returns {Function}
 */
function createCallback(x, m, centralsData, yAxis) {
    return function() {
        if (x.readyState === 4){
            addCentralData(JSON.parse(this.responseText), m, centralsData, yAxis);
        }
    };
}
