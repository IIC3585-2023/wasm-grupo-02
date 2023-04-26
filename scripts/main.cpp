// #include <vector>
// #include <set>
// #include <utility>
// #include <emscripten/bind.h>

// using namespace std;

// vector<vector<int>> optimize(const vector<int>& tiempos, int num_clusters) {
//     vector<vector<int>> clusters(num_clusters);
//     multiset<pair<int, int>> cluster_times;

//     for (int i = 0; i < num_clusters; ++i) {
//         cluster_times.insert({0, i});
//     }

//     for (int i = 0; i < tiempos.size(); ++i) {
//         int time = tiempos[i];
//         auto cluster_iter = cluster_times.begin();
//         int cluster_id = cluster_iter->second;

//         clusters[cluster_id].push_back(i);
//         cluster_times.insert({cluster_iter->first + time, cluster_id});
//         cluster_times.erase(cluster_iter);
//     }

//     return clusters;
// }


