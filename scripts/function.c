#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>


EMSCRIPTEN_KEEPALIVE

// Modificar la firma de la función optimize
int** optimize(int* times, int times_length, int numClusters) {
    int** clusters = (int**)malloc(numClusters * sizeof(int*));
    int* clustersTimes = (int*)calloc(numClusters, sizeof(int));

    for (int i = 0; i < numClusters; i++) {
        clusters[i] = (int*)malloc(times_length * sizeof(int));
    }

    for (int i = 0; i < times_length; i++) {
        int time = times[i];
        int minTime = 1000000;
        int clusterId;

        for (int id = 0; id < numClusters; id++) {
            int totalTiempo = clustersTimes[id];
            if (totalTiempo < minTime) {
                minTime = totalTiempo;
                clusterId = id;
            }
        }

        clusters[clusterId][i] = i + 1;
        clustersTimes[clusterId] = minTime + time;
        printf("Tiempo: %d, clusterId: %d, minTime: %d\n", time, clusterId, minTime);
    }

    free(clustersTimes);
    return clusters;
}


