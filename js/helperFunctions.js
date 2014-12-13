/*
Convert array of coordinates (longitude,latitude) to leaflet.Latlng
*/
function convertCoordsToLeaflet(coordinates){
	var latlng = new Array();
	for(var j = 0; j < coordinates.length; j++){
		latlng.push(L.latLng(coordinates[j][1],coordinates[j][0]));
	}
	return latlng;
}

/*
Convert array of leaflet-coordinate-objects (latitude,longitude) to string (longitude, latitude)
*/
function convertLeafletCoordsToString(coordinates){
	var coords = "'POLYGON((";
	for(var j = 0; j < coordinates.length; j++){
		if(j != 0){
			coords = coords + ", ";
		}
		coords = coords + coordinates[j].lng + " " + coordinates[j].lat;
	}
	// first coordinate again (required by DB!)
	coords = coords + ", " + coordinates[0].lng + " " + coordinates[0].lat;
	coords = coords + "))'"
	return coords;
}

function convertLeafletLocationToString(location){
	var coord = "'POINT(" + location.lng + " " + location.lat + ")'";
	return coord;
}

/*
Convert array of leaflet-coordinate-objects to google-coordinate-objects
*/
function convertLeafletToGoogleLatLngs(coordinates){
	var googleCoords = [];
	for(var i = 0; i <  coordinates.length; i++){
		googleCoords.push(new google.maps.LatLng(coordinates[i].lat, coordinates[i].lng))
	}
	
	return googleCoords;
}

function getCameraTypeString(id){
	if(id == 1){
		return "360&deg; camera";
	} 
	else if(id == 2){
		return "180&deg; camera";
	}
	else if (id == 3){
		return "mobile camera";
	} else {
		return "NA"
	}
}

function getCameraTypeId(string){
	if(string == "dome"){
		return 1;
	} 
	else if(string == "bullet"){
		return 2;
	}
	else if (string == "mobile"){
		return 3;
	} else {
		return "NA"
	}
}

function getCameraColor(type){
	if(type == 1){
		return "#ff0000";
	} 
	else if(type == 2){
		return "#ffa500";
	} 
	else if(type == 3){
		return "#0000cd";
	} else {
		return "#A8A8A8"
	}
}

function getTimestamp(){
	var date = new Date();
	var timestamp = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
	return timestamp;
}

// toggle visibility of div-elements in webpage
function toggle_visibility(id) {
    var e = document.getElementById(id);
    if (e.style.display != 'block' || e.style.display == null || e.style.display == undefined) {
        e.style.display = 'block';
    } else {
        e.style.display = 'none';
    }
}

// return stars-html-element based on actual confirmations
function getStarRating(confirmtimes){
	if(confirmtimes <= 0){
		return "<img src='images/star0.gif'>";
	} else if (confirmtimes == 1){
		return "<img src='images/star1.gif'>";
	} else if (confirmtimes == 2){
		return "<img src='images/star2.gif'>";
	} else if (confirmtimes == 3){
		return "<img src='images/star3.gif'>";
	} else if (confirmtimes == 4){
		return "<img src='images/star4.gif'>";
	} else if (confirmtimes >= 5){
		return "<img src='images/star5.gif'>";
	}
}

// return index of arrayelement with lowest value for waypoints.distance
function getIndexOfMinDistance(waypoints){
	index = 0;
	minDistance = 0;
	for(var i = 0; i < waypoints.length; i++){
		if(i == 0 || waypoints[i].distance < minDistance){
			minDistance = waypoints[i].distance;
			index = i;
		}
	}
	return index;
}

// calculates the area of a polygon (array of coordinates)
function getPolygonArea(coordinates){
	// create ring (add first element to the end)
	coordinates.push(coordinates[0]);
	var area = 0.0;
	var length = coordinates.length;
	if (length > 2) {
		var p1;
		var p2;
		for (var i = 0; i < length - 1; i++) {
			p1 = coordinates[i];
			p2 = coordinates[i+1];
			area = area + toRadians(p2.lng - p1.lng) * (2 + Math.sin(toRadians(p1.lat)) + Math.sin(toRadians(p2.lat)));
		}
		area = area * 6378137.0 * 6378137.0 / 2.0;
	}
	return area;
}