// Load the Bing Maps API script
// function loadMapScenario() {
//     var script = document.createElement("script");
//     script.setAttribute(
//       "src",
//       "https://www.bing.com/api/maps/mapcontrol?key=YOUR_BING_MAPS_API_KEY"
//     );
//     document.body.appendChild(script);
//   }

//   // Initialize the map
//   function initMap() {
//     var map = new Microsoft.Maps.Map("#myMap", {
//       credentials: "YOUR_BING_MAPS_API_KEY",
//     });

//     // Add a pushpin to the map
//     var pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), null);
//     map.entities.push(pushpin);
//   }

//   // Call the loadMapScenario function to load the Bing Maps API script
//   loadMapScenario();

const API_KEY = "";
var map;

function GetMap(){
    map = new Microsoft.Maps.Map('#myMap', {
        center: new Microsoft.Maps.Location(51.50632, -0.12714),
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        zoom: 10
    });
    //Add your post map load code here.
    //Load the directions module.
    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
        //Create an instance of the directions manager.
        directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

        //Create waypoints to route between.
        directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({ address: 'London, UK' }));
        directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({ address: 'Paris, FR' }));
        directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({ address: 'Madrid, ES' }));

        //Set the request options that avoid highways and uses kilometers.
        directionsManager.setRequestOptions({
            distanceUnit: Microsoft.Maps.Directions.DistanceUnit.km,
            routeAvoidance: [Microsoft.Maps.Directions.RouteAvoidance.avoidLimitedAccessHighway]
        });

        //Make the route line thick and green. Replace the title of waypoints with an empty string to hide the default text that appears.
        directionsManager.setRenderOptions({
            drivingPolylineOptions: {
                strokeColor: 'green',
                strokeThickness: 6
            },
            waypointPushpinOptions: {
                title: ''
            }
        });

        //Calculate directions.
        directionsManager.calculateDirections();
    });
}


var centerButton = document.getElementById("GoToRomeButton");
centerButton.addEventListener("click", function() {
    map.setView({ center: new Microsoft.Maps.Location(41.9028, 12.4964) });
});

function addPin(){
    var pin = new Microsoft.Maps.Pushpin(map.getCenter(), null);
    map.entities.push(pin);
}

function getElevation(latitude, longitude) {
    var requestUrl = "https://dev.virtualearth.net/REST/v1/Elevation/List?points=" + latitude + "," + longitude + "&key=" + API_KEY;

    // var elevation = 0.0;
    //Send the request to the Bing Maps REST Elevation API.
    return fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            //Get the elevation value from the response.
            // elevation = data.resourceSets[0].resources[0].elevations[0];
            // console.log("Elevation at (" + latitude + ", " + longitude + "): " + elevation + " meters");
            return data.resourceSets[0].resources[0].elevations[0];
        })
        .catch(error => console.error(error));
    

}

function displayRoute(coordinates) {
    //Load the directions module.
    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
        //Create an instance of the directions manager.
        var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

        //Create waypoints from the coordinates array.
        for (var i = 0; i < coordinates.length; i++) {
            var waypoint = new Microsoft.Maps.Directions.Waypoint({
                location: new Microsoft.Maps.Location(coordinates[i][0], coordinates[i][1])
            });
            directionsManager.addWaypoint(waypoint);
        }

        //Set the request options that avoid highways and uses kilometers.
        directionsManager.setRequestOptions({
            distanceUnit: Microsoft.Maps.Directions.DistanceUnit.km,
            routeAvoidance: [Microsoft.Maps.Directions.RouteAvoidance.avoidLimitedAccessHighway]
        });

        //Make the route line thick and green. Replace the title of waypoints with an empty string to hide the default text that appears.
        directionsManager.setRenderOptions({
            drivingPolylineOptions: {
                strokeColor: 'green',
                strokeThickness: 6
            },
            waypointPushpinOptions: {
                title: ''
            }
        });

        //Calculate directions.
        directionsManager.calculateDirections();
    });
}

function calculateRouteDistance(starting_latitude, starting_longitude, ending_latitude, ending_longitude) {
    var start = new Microsoft.Maps.Location(starting_latitude, starting_longitude);
    var end = new Microsoft.Maps.Location(ending_latitude, ending_longitude);

    //Create a directions manager and add the start and end waypoints.
    var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
    directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({ location: start }));
    directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({ location: end }));

    //Set the travel mode to driving.
    directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.driving });

    //Calculate the directions and get the route distance.
    directionsManager.calculateDirections(function (result) {
        var routeDistance = result.routes[0].routeLength / 1000;

        //Get the route geometry from the result.
        var routeGeometry = result.routes[0].routePath;

        //Construct a request URL for the Bing Maps REST Elevation API.
        var requestUrl = "https://dev.virtualearth.net/REST/v1/Elevation/List?points=" + routeGeometry.coordinates.map(coord => coord[0] + "," + coord[1]).join(',') + "&key=YOUR_BING_MAPS_KEY";

        //Send the request to the Bing Maps REST Elevation API.
        var promise = fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
                //Get the elevation data from the response.
                var elevations = data.resourceSets[0].resources[0].elevations;

                //Calculate the total elevation gain and loss.
                var elevationGain = 0;
                var elevationLoss = 0;
                for (var i = 1; i < elevations.length; i++) {
                    var diff = elevations[i] - elevations[i-1];
                    if (diff > 0) {
                        elevationGain += diff;
                    } else {
                        elevationLoss += Math.abs(diff);
                    }
                }

                console.log("Route distance: " + routeDistance + " km");
                console.log("Total elevation gain: " + elevationGain + " meters");
                console.log("Total elevation loss: " + elevationLoss + " meters");

                return {
                    'routeDistance': routeDistance,
                    'elevationGain': elevationGain,
                    'elevationLoss': elevationLoss
                }
            })
            .catch(error => console.error(error));
        
        return promise;
    });
}

async function calculateRouteDistanceSync(){
    var start = new Microsoft.Maps.Location(starting_latitude, starting_longitude);
    var end = new Microsoft.Maps.Location(ending_latitude, ending_longitude);

    //Create a directions manager and add the start and end waypoints.
    var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
    directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({ location: start }));
    directionsManager.addWaypoint(new Microsoft.Maps.Directions.Waypoint({ location: end }));

    //Set the travel mode to driving.
    directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.driving });

    //Calculate the directions and get the route distance.
    directionsManager.calculateDirections(function (result) {
        var routeDistance = result.routes[0].routeLength / 1000;

        //Get the route geometry from the result.
        var routeGeometry = result.routes[0].routePath;

        //Construct a request URL for the Bing Maps REST Elevation API.
        var requestUrl = "https://dev.virtualearth.net/REST/v1/Elevation/List?points=" + routeGeometry.coordinates.map(coord => coord[0] + "," + coord[1]).join(',') + "&key=YOUR_BING_MAPS_KEY";

        //Send the request to the Bing Maps REST Elevation API.
        
        var response = fetch(requestUrl);
        var data = response.json();

        var elevations = data.resourceSets[0].resources[0].elevations;

                //Calculate the total elevation gain and loss.
                var elevationGain = 0;
                var elevationLoss = 0;
                for (var i = 1; i < elevations.length; i++) {
                    var diff = elevations[i] - elevations[i-1];
                    if (diff > 0) {
                        elevationGain += diff;
                    } else {
                        elevationLoss += Math.abs(diff);
                    }
                }

                console.log("Route distance: " + routeDistance + " km");
                console.log("Total elevation gain: " + elevationGain + " meters");
                console.log("Total elevation loss: " + elevationLoss + " meters");

                return {
                    'routeDistance': routeDistance,
                    'elevationGain': elevationGain,
                    'elevationLoss': elevationLoss
                }
    });
}


function getElevations(locations) {
    //Construct a request URL for the Bing Maps REST Elevation API.
    var requestUrl = "https://dev.virtualearth.net/REST/v1/Elevation/List?points=" + locations.map(loc => loc[0] + "," + loc[1]).join(',') + "&key=" + API_KEY;

    //Send the request to the Bing Maps REST Elevation API.
    return fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            //Get the elevation data from the response.
            var elevations = data.resourceSets[0].resources[0].elevations;
            return elevations;
        })
        .catch(error => console.error(error));
}

function randomizedPoints(point,prev_bearing){
    let num_points = 5;
    
    let bearing_range = 180;
    let bearing = prev_bearing;
    let points = [];
    let bearings = []
    for (let i = 0; i < num_points; i++){
        bearing = bearing + (Math.random() * bearing_range - bearing_range/2);
        bearings.push(bearing);
        points.push(getNextPoint(point,bearing));
    }

    return [points,bearings];
}

function getNextPoint(point,bearing){
    currentLatitude = point[0];
    currentLongitude = point[1];
    distance = 200 + (Math.random()*200);
    return [
        currentLatitude + distance / 111111 * Math.cos(bearing * Math.PI / 180),
        currentLongitude + distance / 111111 * Math.sin(bearing * Math.PI / 180)
    ];
}

async function calculateRoute(starting_latitude,starting_longitude,target_elevation_gain,target_elevation_loss,target_distance){
    target_distance = Math.min(30,target_distance)
    let currentDistance = 0;
    let currentPoint = [starting_latitude,starting_longitude];
    let currentElevation = await getElevation(starting_latitude,starting_longitude);
    let totalElevationGain = 0;
    let totalElevationLoss = 0;
    let points = []
    let prev_bearing = Math.random() * 360;
    points.push([starting_latitude,starting_longitude])

    while(currentDistance < target_distance){
        let nextPointCandidates,bearings;
        [nextPointCandidates,bearings] = randomizedPoints(currentPoint,prev_bearing);
        let targetGradientUp = Math.max(0,(target_elevation_gain - totalElevationGain) / (target_distance - currentDistance));
        let targetGradientDown = Math.max(0,(target_elevation_loss - totalElevationLoss) / (target_distance - currentDistance));
        console.log(targetGradientUp,targetGradientDown)
        
        var distances = new Array(nextPointCandidates.length);
        var elevations = new Array(nextPointCandidates.length);
        

        for(var i =0; i < nextPointCandidates.length; i++){

            var route = await getRoute({
                'latitude': currentPoint[0],
                'longitude': currentPoint[1]
            },{
                'latitude': nextPointCandidates[i][0],
                'longitude': nextPointCandidates[i][1]
            });
            var elevation = await getElevation(nextPointCandidates[i][0],nextPointCandidates[i][1]);
            elevations[i] = elevation - currentElevation;
            currentElevation = elevation;

            distances[i] = route.resourceSets[0].resources[0].travelDistance;
            // var segmentElevationGain = max(0,getElevation(nextPointCandidates[i][0],nextPointCandidates[i][1]) - currentElevation);
            // var segmentElevationLoss = max(0,currentElevation - getElevation(nextPointCandidates[i][0],nextPointCandidates[i][1]));
            console.log(nextPointCandidates[i]);
            console.log(distances[i]);
            console.log(elevations[i]);

        }
        var bestSegment = getBestSegment(distances,elevations,targetGradientUp,targetGradientDown);
        currentDistance += distances[bestSegment];
        totalElevationGain += Math.max(0,elevations[bestSegment]);
        totalElevationLoss += -1*Math.min(0,elevations[bestSegment]);
        prev_bearing = bearings[bestSegment];
        
        points.push(nextPointCandidates[bestSegment])

        console.log("Current Distance:",currentDistance);
        console.log("Elevation Gain:",totalElevationGain);
        console.log("Elevation Loss:",totalElevationLoss);
        console.log("Bearing:",prev_bearing);

    }
    displayRoute(points)
}

function getRoute(start, end) {
    //Construct a request URL for the Bing Maps REST Route API.
    var requestUrl = "https://dev.virtualearth.net/REST/v1/Routes/Driving?wp.0=" + start.latitude + "," + start.longitude + "&wp.1=" + end.latitude + "," + end.longitude + "&key="+API_KEY;

    return fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            //Get the route distance and travel time from the response.
            // var routeDistance = data.resourceSets[0].resources[0].travelDistance;
            // var travelTime = data.resourceSets[0].resources[0].travelDuration;

            // //Get the route geometry from the response.
            // var routeGeometry = data.resourceSets[0].resources[0].routePath.line.coordinates;

            // var route = {
            //     'distance': routeDistance,
            //     'time': travelTime,
            //     'geometry': routeGeometry
            // };
            
            return data;
        })
        .catch(error => console.error(error));
}

function getBestSegment(distances,elevations,targetGradientUp,targetGradientDown){
    var bestSegment = 0;
    var bestScore = -Infinity;
    for(var i = 0; i < distances.length; i++){
        var score = -1*( Math.abs(targetGradientUp - Math.max(0,elevations[i]) / distances[i]) + Math.abs(targetGradientDown - Math.max(0,-elevations[i]) / distances[i]));
        if(score > bestScore){
            bestScore = score;
            bestSegment = i;
        }
    }
    return bestSegment;
}
// function that takes an array of lat 
