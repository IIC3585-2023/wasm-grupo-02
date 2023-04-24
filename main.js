Module.onRuntimeInitialized = () => {
    const clusterNum = 3;
    const times = [1, 4, 3, 7];
    const timesArray = Uint32Array.from(times);
    const timePtr = Module._malloc(timesArray.byteLength);
    Module.HEAPU32.set(timesArray, timePtr >> 2);
    const optimizeFunc = Module.cwrap('optimize', 'number', ['number', 'number', 'number']);
    const clustersPtr = optimizeFunc(timePtr, times.length, clusterNum);
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
  
    Module._free(clustersPtr);
  };