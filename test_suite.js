var start = new Microsoft.Maps.Location(40.7128, -74.0060);
var end = new Microsoft.Maps.Location(38.9072, -77.0369);

directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.driving });


directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({ location: start }));
directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({ location: end }));


// directionsManager.calculateDirections()

directionsManager.getCurrentRoute()

// function to calculate the distance between two lat long points in meters
function getDistance(lat1, lon1, lat2, lon2) {
    return 6371000 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1) + Math.sin(lat1) * Math.sin(lat2));
}
