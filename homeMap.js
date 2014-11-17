/*****Variables*****/

var homeMap;
var cameras = [];

/*****Functions*****/

function initializeHomeMap(){

	// create map
	homeMap = L.map('map', {editable: true}).setView([44.9716, -93.2429], 16);
	
	// create baselayer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18
	}).addTo(homeMap);
	
	// create locateme button
	L.control.locate({
		icon: 'fa fa-map-marker',
		iconLoading: 'fa fa-spinner fa-spin'
	}).addTo(homeMap);
	
	// create north arrow
	var north = L.control({position: "topright"});
	north.onAdd = function(map) {
		var div = L.DomUtil.create("div", "info legend");
		div.innerHTML = '<img src="images/north-arrow.png" width="50" height="50">';
    return div;
	}
	north.addTo(homeMap);
	
	// create osm-geocoder-search
	var osmGeocoder = new L.Control.OSMGeocoder();
	homeMap.addControl(osmGeocoder);
	
	// load polygons from database
	loadCamerasFromDB();
}

function loadCamerasFromDB(){
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else { // code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var results = JSON.parse(xmlhttp.responseText);
		
			for(var i = 0; i < results.features.length; i++){
				camera = results.features[i];
				var coordinates = invertCoords(camera.geometry.coordinates[0]);
				for(var j = 0; j < coordinates.length; j++){
					var properties = camera.properties;
					var polygon = L.polygon(coordinates);
					var container = $('<div>');
					
					container.on('click', '#seeComments', function() {
						selectedCameraId = properties.cameraid;
						fillCommentsPage(selectedCameraId);
					});
					
					container.html('<table>' + 
						'<tr><td><b>Description</b></td><td>' + properties.description + '</td></tr>' +
						'<tr><td><b>Latitude</b></td><td>' + coordinates[j].lat + '</td></tr>' +
						'<tr><td><b>Longitude</b></td><td>' + coordinates[j].lng + '</td></tr>' +					
						'<tr><td><b>Camera-ID</b></td><td>'  + properties.cameraid + '</td></tr>' +
						'<tr><td><b>Type</b></td><td>' + properties.type + '</td></tr>' +
						'<tr><td><b>Orientation</b></td><td>' + properties.orientation + '</td></tr>' +
						'<tr><td><a href="#camera-comments-page" id="seeComments" class="link">Comments</a></td></tr></table></div>');

					// Insert the container into the popup
					polygon.bindPopup(container[0]);
					cameras.push(polygon);
				}
			}
			//TODO add polygons to map
			for(var k = 0; k < cameras.length; k++){
				cameras[k].addTo(homeMap);
			}
		}
	}
	xmlhttp.open("GET","getcameras.php",true);
	xmlhttp.send();
}

/*
Convert array of coordinates (longitude,latitude) to leaflet.Latlng
*/
function invertCoords(coordinates){
	var latlng = new Array();
	for(var j = 0; j < coordinates.length; j++){
		latlng.push(L.latLng(coordinates[j][1],coordinates[j][0]));
	}
	return latlng;
}