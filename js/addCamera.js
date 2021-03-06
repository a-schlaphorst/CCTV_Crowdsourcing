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

function addEditablePolygon(clickLocation, type, radius){
	if(type === "dome"){
	
		var circleCoords = createFullCirclePolygon(clickLocation, radius, 10);
		cameraLocation = clickLocation;
		cameraShape = L.polygon(circleCoords).addTo(addCameraMap);
		cameraShape.enableEdit();
		
	} else if(type === "mobile"){
	
		var circleCoords = createFullCirclePolygon(clickLocation, radius, 10);
		cameraLocation = clickLocation;
		cameraShape = L.polygon(circleCoords).addTo(addCameraMap);
		cameraShape.enableEdit();
		
	} else if(type === "bullet"){
		if(bulletDirection){
			// draw polygon
			var bearing = getBearing(cameraLocation, clickLocation);
			var angularSize = 180; //default value
			var circleExtractCoords = createCircleExtractPolygon(cameraLocation, bearing, angularSize, radius, Math.round(angularSize/36));
			cameraShape = L.polygon(circleExtractCoords).addTo(addCameraMap);
			cameraShape.enableEdit();
			addCameraMap.removeLayer(originMarker);
			drawEditable = true;
		} else{
			// save camera location
			cameraLocation = clickLocation;
			// draw marker for orientation
			originMarker = L.marker(cameraLocation).addTo(addCameraMap);
			// enable again for second click
			drawEditable = true;
			bulletDirection = true;
			
			$( "#drawBearingPopup" ).popup();
			$( "#drawBearingPopup" ).popup( "open" );
			setTimeout(function(){
				$( "#drawBearingPopup" ).popup("close");
			}, 2000);
		}
	}	
}

function postCamera(){
	// chech if there is a polygon
	if(!cameraShape){
		return;
	}
	
	// check if amount of vertices is not too high
	var vertices = cameraShape.getLatLngs();
	if(vertices.length > MAX_CAMERA_VERTICES){
		$( "#verticesWarningPopup" ).popup();
		$( "#verticesWarningPopup" ).popup( "open" );
		setTimeout(function(){
			$( "#verticesWarningPopup" ).popup("close");
			addCameraMap.removeLayer(cameraShape);
			drawEditable = true;
		}, 2000);
		return;
	}
	if(getPolygonArea(vertices) > MAX_CAMERA_AREA){
		$( "#areaWarningPopup" ).popup();
		$( "#areaWarningPopup" ).popup( "open" );
		setTimeout(function(){
			$( "#areaWarningPopup" ).popup("close");
		}, 2000);
		return;
	}
	cameraShape.disableEdit();
	
	// get attributes
	var cameraDescription = description;
	var selectedCameraType = getCameraTypeId(cameraType);
	var centroid = convertLeafletLocationToString(cameraLocation);
	var coordinates = convertLeafletCoordsToString(cameraShape.getLatLngs());
	
	// send request
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else { // code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			$.mobile.changePage( "#home-page", { transition: "slideup", changeHash: false });
		}
	}
	xmlhttp.open("GET","php/postcamera.php?type=" + selectedCameraType + 
		"&height=" + cameraHeight + 
		"&description=" + cameraDescription +
		"&centroid=" + centroid + 
		"&shape=" + coordinates,true);
	xmlhttp.send();
}