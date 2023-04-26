function main() {
  Module.onRuntimeInitialized = () => {
    const clusterNum = 1;
    const times = [];
    const clusters = [];

    console.log(clusters);
    const clustersInput = document.getElementById("clusters");
    const clustersTbody = document.getElementById("clusters-body");
    clustersInput.addEventListener("input", actualizarClusters);

    const trabajosInput = document.getElementById("trabajos");
    const trabajosTbody = document.getElementById("trabajos-body");
    trabajosInput.addEventListener("input", actualizarTrabajos);

    // Añadimos una fila por defecto con un id único a las jugadas
    const row = document.createElement("tr");
    row.id = "trabajo-1";
    const trabajoCell = document.createElement("td");
    trabajoCell.textContent = `Trabajo 1`;
    row.appendChild(trabajoCell);
    const tiempoCell = document.createElement("td");
    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.value = Math.ceil(Math.random() * 10);
    tiempoCell.appendChild(input);
    row.appendChild(tiempoCell);
    trabajosTbody.appendChild(row);

    // Añadimos una fila por defecto con un id único a los clusters
    const row2 = document.createElement("tr");
    row2.id = "Cluster-1";
    const clusterCell = document.createElement("td");
    clusterCell.textContent = `Cluster 1`;
    row2.appendChild(clusterCell);
    const tiempoCell2 = document.createElement("td");
    const input2 = document.createElement("button");
    input2.type = "button";
    input2.id = `cluster-1`;
    input2.textContent = "Ver tareas asignadas";
    tiempoCell2.appendChild(input2);
    row2.appendChild(tiempoCell2);
    clustersTbody.appendChild(row2);
    const buttonCalculate = document.getElementById("Calcular");
    buttonCalculate.addEventListener("click", actualizarTiempos);

    function actualizarTrabajos() {

      const trabajosInput = document.getElementById('trabajos');

      trabajosInput.addEventListener('change', () => {
        console.log('El valor del input de trabajos ha cambiado a: ', trabajosInput.value);
      });
      


      const numTrabajos = trabajosInput.value;
      const rows = trabajosTbody.getElementsByTagName("tr");
      let numRows = rows.length;
    
      // Actualizamos las celdas existentes y creamos nuevas filas y celdas de tiempo de asignación para la tabla de trabajos
      for (let i = 1; i <= numTrabajos; i++) {
        let row;
        let tiempoCell;
        let input;
      
        if (i <= numRows) { // Si la fila ya existe, la actualizamos
          row = i == 1 ? document.getElementById("trabajo-1") : rows[i-1];
          tiempoCell = row.getElementsByTagName("td")[1];
          input = tiempoCell.getElementsByTagName("input")[0];
        } else { // Si la fila no existe, la creamos
          row = document.createElement("tr");
          const trabajoCell = document.createElement("td");
          trabajoCell.textContent = `Trabajo ${i}`;
          row.appendChild(trabajoCell);
          tiempoCell = document.createElement("td");
          input = document.createElement("input");
          input.type = "number";
          input.min = "1";
          tiempoCell.appendChild(input);
          row.appendChild(tiempoCell);
          trabajosTbody.appendChild(row);
        }
      
        // Si la celda es nueva, le asignamos un valor aleatorio
        if (i > numRows) {
          input.value = Math.ceil(Math.random() * 10);
        }
      }
    
      // Eliminamos las filas sobrantes
      while (trabajosTbody.getElementsByTagName("tr").length > numTrabajos) {
        trabajosTbody.removeChild(trabajosTbody.lastChild);
      }

      const tiempoInputs = document.querySelectorAll('#trabajos-body td input');
      tiempoInputs.forEach(input => {
        input.addEventListener('change', () => {
          console.log(`El valor del input de tiempo de asignación ha cambiado a: ${input.value}`);
        });
      });
    }

    function actualizarClusters() {

      const clustersInput = document.getElementById('clusters');

      clustersInput.addEventListener('change', () => {
        console.log('El valor del input de clusters ha cambiado a: ', clustersInput.value);
      });

      const numClusters = clustersInput.value;
    
      // Eliminamos todas las filas existentes de la tabla de clusters
      while (clustersTbody.firstChild) {
        clustersTbody.removeChild(clustersTbody.firstChild);
      }
    
      // Creamos las nuevas filas y celdas de tiempo de asignación para la tabla de clusters
      for (let i = 1; i <= numClusters; i++) {
        const row2 = document.createElement("tr");
        const clusterCell = document.createElement("td");
        clusterCell.textContent = `Cluster ${i}`;
        row2.appendChild(clusterCell);
        const tiempoCell2 = document.createElement("td");
        const button = document.createElement("button");
        button.id = `cluster-${i}`;
        button.type = "button";
        button.textContent = "Ver tareas asignadas";
        tiempoCell2.appendChild(button);
        row2.appendChild(tiempoCell2);
        clustersTbody.appendChild(row2);
      }
    }
  
    function actualizarTiempos() {
      const times = [];
    const tiempoInputs = document.querySelectorAll('#trabajos-body td input');
      tiempoInputs.forEach(input => {
        times.push(input.value);
        });
    const clusterNum = document.getElementById('clusters').value;
    const timesArray = Uint32Array.from(times);
    const timePtr = Module._malloc(timesArray.byteLength);
    Module.HEAPU32.set(timesArray, timePtr >> 2);
    const optimizeFunc = Module.cwrap('optimize', 'number', ['number', 'number', 'number']);

    const startTimeC = performance.now();
    const clustersPtr = optimizeFunc(timePtr, times.length, clusterNum);
    const endTimeC = performance.now();
    const timeC = endTimeC - startTimeC;

    const clusters = [];
  
    for (let i = 0; i < clusterNum; i++) {
      const clusterPtr = Module.getValue(clustersPtr + i * 4, 'i32');
      const cluster = [];
  
      for (let j = 0; j < times.length; j++) {
        const value = Module.getValue(clusterPtr + j * 4, 'i32');
        if (value === -1) break;
        cluster.push(value);
      }
  
      clusters.push(cluster);
    }

    console.log(clusters);
    console.log(`Tiempo de ejecución en C: ${endTimeC - startTimeC} ms`);

    Module._free(clustersPtr);


    const startTimeJS = performance.now();
    const clusters2 = optimize(times, clusterNum);
    const endTimeJS = performance.now();
    const timeJS = endTimeJS - startTimeJS;

    console.log(clusters2);
    console.log(`Tiempo de ejecución en JS: ${endTimeJS - startTimeJS} ms`);
    
    const timeJSElement = document.getElementById("timeJS");
    timeJSElement.textContent = `${Number(timeJS).toFixed(2)} ms`;

    const timeCElement = document.getElementById("timeC");
    timeCElement.textContent = `${Number(timeC).toFixed(2)} ms`;
    const trabajosList = document.getElementById(`cluster-1`);
    trabajosList.textContent = clusters[0];
    for(var i = 1; i < clusterNum+1; i++){
      const trabajosList = document.getElementById(`cluster-${i}`);
      trabajosList.textContent = clusters[i-1];
    }
  }
  };
}

setTimeout(main, 1);