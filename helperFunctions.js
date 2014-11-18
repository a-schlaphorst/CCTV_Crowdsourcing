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
	coords = coords + "))',4326"
	return coords;
}

function convertLeafletLocationToString(location){
	var coord = "'POINT((" + location.lng + " " + location.lat + ")', 4326)";
	return coord;
}

function getCameraTypeString(id){
	if(id == 1){
		return "dome";
	} 
	else if(id == 2){
		return "bullet";
	}
	else if (id == 3){
		return "mobile";
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
		return "#FF0000";
	} 
	else if(type == 2){
		return "#FFFB00";
	} 
	else if(type == 3){
		return "#0004FF";
	} else {
		return "A8A8A8"
	}
}

function getTimestamp(){
	var date = new Date();
	var timestamp = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
	return timestamp;
}