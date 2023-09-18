// var start = new Microsoft.Maps.Location(40.7128, -74.0060);
// var end = new Microsoft.Maps.Location(38.9072, -77.0369);

// directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.driving });


// directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({ location: start }));
// directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({ location: end }));


// // directionsManager.calculateDirections()

// directionsManager.getCurrentRoute()

// // function to calculate the distance between two lat long points in meters
// function getDistance(lat1, lon1, lat2, lon2) {
//     return 6371000 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1) + Math.sin(lat1) * Math.sin(lat2));
// }


// get latitudes and longitudes of the top 20 cities in the world
var cities = [
    [19.4326, -99.1332],
    [40.7128, -74.0060],
    [41.9028, 12.4964],
    [35.6895, 139.6917],
    [51.5074, -0.1278],
    [55.7558, 37.6173],
    [23.1291, 113.2644],
    [48.8566, 2.3522],
    [37.7749, -122.4194],
    [22.3964, 114.1095],
    [19.0760, 72.8777],
    [34.0522, -118.2437],
    [40.4168, -3.7038],
    [39.9042, 116.4074],
    [31.2304, 121.4737],
    [41.3851, 2.1734],
    [55.6761, 12.5683],
    [37.5665, 126.9780],
    [35.6762, 139.6503],
    [37.9838, 23.7275]
];


function errorFunction(target_distance,actual_distance,target_elevation_gain,actual_elevation_gain,target_elevation_loss,actual_elevation_loss){
    var error_distance =Max(0,Math.abs(target_distance - actual_distance)-(target_distance/10));
    var error_elevation_gain = Math.abs(target_elevation_gain - actual_elevation_gain);
    var error_elevation_loss = Math.abs(target_elevation_loss - actual_elevation_loss);
    var error = error_distance + error_elevation_gain + error_elevation_loss;
    return error;
}


// (17.424158, 78.447059) (17.427971, 78.448362)