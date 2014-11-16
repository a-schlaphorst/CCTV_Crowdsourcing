/*****Variables*****/

var addCameraMap;
var R = 6371; // Earth-Radius in km
var pi = Math.PI;
var bulletDirection = false;
var cameraLocation;

var originMarker;
var camerashape;


/*****Functions*****/

function initializeAddCameraMap(){

	// create map
	addCameraMap = L.map('add-camera-map', {editable: true}).setView([44.9716, -93.2429], 18);
	
	// create baselayer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery � <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18
	}).addTo(addCameraMap);
	
	// create locateme button
	L.control.locate({
		icon: 'fa fa-map-marker',
		iconLoading: 'fa fa-spinner fa-spin'
	}).addTo(addCameraMap);
	
	// create osm-geocoder-search
	var osmGeocoder = new L.Control.OSMGeocoder();
	addCameraMap.addControl(osmGeocoder);
	
	// add click listener
	addCameraMap.on("click", onMapClick);
	
	// call initial popup
	$( "#drawOriginPopup" ).popup();
	$( "#drawOriginPopup" ).popup( "open" );
	setTimeout(function(){
		$( "#drawOriginPopup" ).popup("close")
	}, 2000);
	
	// fixes bug with uncomplete map-tiles
	setTimeout(function(){
		addCameraMap.invalidateSize()
	}, 1);
}

function onMapClick(evt){
	if(!drawEditable){
		return;
	}
	drawEditable = false;
	addEditablePolygon(evt.latlng, cameraType, viewingDistance);
};

function addEditablePolygon(startPoint, type, radius){
	if(type === "dome"){
	
		var circleCoords = createFullCirclePolygon(startPoint, radius, 10);
		cameraShape = L.polygon(circleCoords).addTo(addCameraMap);
		cameraShape.enableEdit();
		
	} else if(type === "mobile"){
	
		var circleCoords = createFullCirclePolygon(startPoint, radius, 10);
		cameraShape = L.polygon(circleCoords).addTo(addCameraMap);
		cameraShape.enableEdit();
		
	} else if(type === "bullet"){
		if(bulletDirection){
			// draw polygon
			var bearing = getBearing(cameraLocation, startPoint);
			var circleExtractCoords = createCircleExtractPolygon(cameraLocation, bearing, angularSize, radius, Math.round(angularSize/36));
			cameraShape = L.polygon(circleExtractCoords).addTo(addCameraMap);
			cameraShape.enableEdit();
			addCameraMap.removeLayer(originMarker);
		} else{
			// save camera location
			cameraLocation = startPoint;
			// draw marker for orientation
			originMarker = L.marker(cameraLocation).addTo(addCameraMap);
			// enable again for second click
			drawEditable = true;
			bulletDirection = true;
			
			$( "#drawBearingPopup" ).popup();
			$( "#drawBearingPopup" ).popup( "open" );
			setTimeout(function(){
				$( "#drawBearingPopup" ).popup("close")
			}, 2000);
		}
	}	
}

function insertCamera(){
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else { // code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var cameras = JSON.parse(xmlhttp.responseText);
			debugger;
		}
	}
	
	// TODO: Transform polygon to db schema?
	xmlhttp.open("GET","newcamera.php?type=" + type + "&origin=" startPoint+ ,true);
	xmlhttp.send();
}

/* Full-Circle coordinates given distance and amount of coordinates from start point
*
* startPoint (coordinates from start point)
* radius (radius of ring)
* n (amount of coordinates)
* return (array of coordinates)
*/
function createFullCirclePolygon(startPoint, radius, n){
	var coords = [];
	for(var i = 0; i < n; i++){
		coords.push(getBearingCoordinates(startPoint, i * (360 / n), radius));
	}
	
	return coords;
}

/* Circle-Extract coordinates given distance, angularSize, bearing and amount of coordinates from start point
*
* startPoint (coordinates from start point)
* bearing (direction of circle-extract from origin)
* angularSize (extract size)
* radius (radius of ring)
* n (amount of coordinates)
* return (array of coordinates)
*/
function createCircleExtractPolygon(startPoint, bearing, angularSize, radius, n){
	if(n < 2){
		n = 2;
	}
	var coords = [];
	coords.push(startPoint);
	for(var i = 0; i < n + 1; i++){
		coords.push(getBearingCoordinates(startPoint, bearing - (angularSize / 2) + (i * (angularSize / n)), radius));
	}
	coords.push(startPoint);
	
	return coords;
}

/*
* Destination point given distance and bearing from start point
*
* Given a start point, initial bearing, and distance, 
* this will calculate the destination point and final bearing travelling along a (shortest distance) great circle arc.
* startPoint (coordinates of start Location)
* bearing (bearing clockwise from north)
* distance (distance travelled)
*/
function getBearingCoordinates(startPoint, bearing, distance){

	var startLat = toRadians(startPoint.lat);
	var startLng = toRadians(startPoint.lng);
	var bearing = toRadians(bearing);

	var destLat = Math.asin( Math.sin(startLat)*Math.cos(distance/R) + Math.cos(startLat)*Math.sin(distance/R)*Math.cos(bearing));
	var destLng = startLng + Math.atan2(Math.sin(bearing)*Math.sin(distance/R)*Math.cos(startLat), Math.cos(distance/R)-Math.sin(startLat)*Math.sin(destLat));

	return L.latLng(toDegrees(destLat), toDegrees(destLng));
}

function getBearing(start, end){
	var startLat = toRadians(start.lat);
	var startLng = toRadians(start.lng);
	var endLat = toRadians(end.lat)
	var endLng = toRadians(end.lng)
	
	var y = Math.sin(endLng-startLng) * Math.cos(endLat);
	var x = Math.cos(startLat)*Math.sin(endLat) -Math.sin(startLat)*Math.cos(endLat)*Math.cos(endLng-startLng);
	var brng = Math.atan2(y, x);
	
	return toDegrees(brng);
}

/*
* Transform degree to radian
*/
function toRadians(degrees){
	var radians = degrees * (pi / 180);
	return radians;
}

/*
* Transform radian to degree
*/
function toDegrees(radians){
	var degrees = radians * (180 / pi);
	return degrees;
}