network.on("hold", function (params) {
    let clickedElementID = network.getNodeAt(params.pointer.DOM);
    let clickedElementObject = currentNodes.get(clickedElementID);
    if (clickedElementObject.category == "bus") {
      // console.log("Test");
      // console.log(clickedElementObject.image);
      // clickedElementObject.image.selected = "./resources/network/icons/bus/normal/bus.png"
      // clickedElementObject.image.unselected = "./resources/network/icons/bus/normal/bus.png"
      // console.log(clickedElementObject.image);
      // currentNodes.update(clickedElementObject);
      let formatConfig = {};
      // Setea el tamaño de la imagen
      formatConfig.width = 80;
      formatConfig.height = 10;
      formatConfig.ypos = formatConfig.height * 0.15;
      formatConfig.barWidth = formatConfig.width - 2 * formatConfig.height;
      var i;
      var svgComponents = [];

      svgComponents.push('<svg xmlns="http://www.w3.org/2000/svg" width="30" height="80">');

      // Dibuja la barra
      svgComponents.push('<rect x="10" y="0" width="10" height="100%" fill="{color}" stroke-width="1" stroke="#060606">');

      //formatConfig.color = "rgba(" + getQuantileColor(-1, 10) + ",1)";

      svgComponents.push('</rect>');

      // Muestra spikes para valores menos que el mínimo y más que el máximo
      let width = formatConfig.width;
      let height = formatConfig.height;
      let arrowPoints = [];
      // Flecha de entrada
      formatConfig.radius = height * .3;
      formatConfig.generatorCircleX = height * 0.25
      formatConfig.generatorCircleY = height * 0.25

      if (clickedElementObject.hasGenerators) {

        svgComponents.push('<polyline points="');
        arrowPoints = [];

        arrowPoints.push([height * .16, height * .3]);
        arrowPoints.push([height * .76, height * .3]);
        arrowPoints.push([height * .76, height * .1]);
        arrowPoints.push([height * 1.36, height * .5]);
        arrowPoints.push([height * .76, height * .9]);
        arrowPoints.push([height * .76, height * .7]);
        arrowPoints.push([height * .16, height * .7]);
        arrowPoints.push([height * .16, height * .3]);
        i = arrowPoints.length;
        while (i--)
          svgComponents.push(arrowPoints[i][0] + ',' + arrowPoints[i][1] + ' ');
        svgComponents.push('" style="fill:lime;stroke:green;stroke-width:1;" />');
      }

      // Flecha de salida
      if (clickedElementObject.hasLoad) {
        svgComponents.push('<polyline points="');
        arrowPoints = []

        arrowPoints.push([width - height * 1.3, height * .3]);
        arrowPoints.push([width - height * .7, height * .3]);
        arrowPoints.push([width - height * .7, height * .1]);
        arrowPoints.push([width - height * .1, height * .5]);
        arrowPoints.push([width - height * .7, height * .9]);
        arrowPoints.push([width - height * .7, height * .7]);
        arrowPoints.push([width - height * 1.3, height * .7]);
        arrowPoints.push([width - height * 1.3, height * .3]);

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

      var svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });

      var img = DOMURL.createObjectURL(svg);

      clickedElementObject.image.selected = img;
      clickedElementObject.image.unselected = img;
      currentNodes.update(clickedElementObject);
    }
  });