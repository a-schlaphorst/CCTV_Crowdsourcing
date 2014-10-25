/*****Variables*****/

var addCameraMap;
var R = 6371; // Earth-Radius in km
var pi = Math.PI;


/*****Functions*****/

function initializeAddCameraMap(){

	// create map
	addCameraMap = L.map('add-camera-map', {editable: true}).setView([44.9716, -93.2429], 18);
	
	// create baselayer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18
	}).addTo(addCameraMap);
	
	// create locateme button
	L.control.locate({
		icon: 'fa fa-map-marker',
		iconLoading: 'fa fa-spinner fa-spin'
	}).addTo(addCameraMap);
	
	addCameraMap.on("click", onMapClick);
	alert("Touch the location where you want to place your camera");
}

function onMapClick(evt){
	if(!drawEditable){
		return;
	}
	addEditablePolygon(evt.latlng, cameraType, viewingDistance);
};

function addEditablePolygon(startPoint, type, radius){
	if(type === "dome"){
		var circleCoords = createCirclePolygon(startPoint, radius, 10);
		var polygon = L.polygon(circleCoords).addTo(addCameraMap);
		polygon.enableEdit();
	}
}

/* Circle coordinates given distance and amount of coordinates from start point
*
* startPoint (coordinates from start point)
* radius (radius of ring)
* n (amount of coordinates)
* return (array of coordinates)
*/
function createCirclePolygon(startPoint, radius, n){
	var coords = [];
	for(var i = 0; i < n; i++){
		coords.push(getBearingCoordinates(startPoint, i * (360 / n), radius));
	}
	
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

function toRadians(degrees){
	var radians = degrees * (pi / 180);
	return radians;
}

function toDegrees(radians){
	var degrees = radians * (180 / pi);
	return degrees;
}