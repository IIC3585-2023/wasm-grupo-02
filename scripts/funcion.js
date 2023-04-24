function optimize(times, numClusters) {
    const clusters = Array.from({ length: numClusters }, () => []);
    const clustersTimes = new Map();

    for (let i = 0; i < numClusters; i++) {
        clustersTimes.set(i, 0);
    }

    for (let i = 0; i < times.length; i++) {
        const time = times[i];
        let minTime = Infinity;
        let clusterId;

        for (const [id, totalTiempo] of clustersTimes.entries()) {
            if (totalTiempo < minTime) {
                minTime = totalTiempo;
                clusterId = id;
            }
        }

        clusters[clusterId].push(i);
        clustersTimes.set(clusterId, minTime + time);
    }

    return clusters;
}
