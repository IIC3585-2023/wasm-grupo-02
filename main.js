import optimizeModule from './assembly.js';

console.log('Hello from main.js!');

const OptimizeModule = await optimizeModule({
  onRuntimeInitialized() {
    try {
      console.log('Runtime initialized!');
      console.log('Calling optimize...');

      const tiempos = [30,50,10,20,90];
      const M = 2;

      console.log(`Tiempos: ${tiempos.join(", ")}`);

      const resultPtr = OptimizeModule.ccall('optimize',tiempos, M);

      const result = optimize.getVectorVectorInt(resultPtr);
      console.log(`Result: ${result}`);

      result.forEach((cluster, i) => {
        console.log(`Cluster ${i + 1}: ${cluster.map(trabajo => `T${trabajo + 1}`).join(" ")}`);
      });

      OptimizeModule.destroyVectorVectorInt(resultPtr);

    } catch (e) {
      console.error(e);
    }
    
  }
});

console.log('Bye from main.js!');