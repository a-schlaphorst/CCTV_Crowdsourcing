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