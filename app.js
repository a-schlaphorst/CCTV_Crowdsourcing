/*****Variables*****/

var map;
var marker;
var addCamera = true;

// Leaflet draw
var drawnItems = new L.FeatureGroup();

/*****Events*****/
function connectEvents(){
	map.on('draw:created', function(e){
		drawCreated(e); 
	});
}

/*****Functions*****/

$(document).ready( function(){

	// create map
	map = L.map('map').setView([44.9716, -93.2429], 18);
	
	// create baselayer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18
	}).addTo(map);
	
	// create locateme button
	L.control.locate({
		icon: 'fa fa-map-marker',
		iconLoading: 'fa fa-spinner fa-spin'
	}).addTo(map);
	
	// load polygons from test-json
	$.ajax({
		'async': true,
		'url': 'examplePolygon.json',
		'beforeSend': function(xhr){
			if (xhr.overrideMimeType){
				xhr.overrideMimeType("application/json");
			}
		},
		'dataType': "json",
		'success': function (data) {
			// add polygons to map
			addPolygonsToMap(data);
		},
		'error': function(jqXHR, textStatus, errorThrown) {alert('Error ' + errorThrown);}
	});
	
	// connect events
	connectEvents();
});

function addPolygonsToMap(json){
	var cameras = json.cameras;
	
	for(var i = 0; i < cameras.length; i++){
		var camera = cameras[i];
		
		// coordinates can be single point or array of polygon-corners
		var coordinates = camera.coordinates;
	
		// check if camera is polygon
		if(camera.type === "Polygon"){
		
			var coordinates = camera.coordinates;
			
			// convert lnglat(GeoJSON-format) to latlng(leaflet-format)
			var latlng = new Array();
			for(var j = 0; j < coordinates.length; j++){
				latlng.push(L.latLng(coordinates[j][1],coordinates[j][0]));
			}
			
			// TODO: save/cache global?
			var polygon = L.polygon(latlng);
			polygon.addTo(map);
		}
		
		// check if camera is circle
		if(camera.type === "Circle"){
			var radius = camera.radius;
			// create leaflet circle (convert coordinate-format)
			var circle = L.circle(L.latLng(coordinates[1], coordinates[0]), radius);
			circle.addTo(map);
		}
	}
}

function addCameraMenu(){
	if(!addCamera){
		return;
	}
	
	var dialog = $('<p>What kind of camera would you like to submit?</p>').dialog({
		modal: true,
		width: 300,
		title: "Submit new CCTV",
		buttons: {
			"Bullet": function() {
				createBulletCamera();
				dialog.dialog('close');},
			"Dome": function() {
				createDomeCamera();
				dialog.dialog('close');},
			"Mobile": function() {
				createDomeCamera();
				dialog.dialog('close');},
			"Other": function() {
				createOtherCamera();
				dialog.dialog('close');}
		}
	});	
	
	addCamera = false;
}

function createBulletCamera(){
	//open form for entering parameteres
}

function createDomeCamera(){
	//open form for entering parameters or enable drawing tools
}

function createMobileCamera(){
	//open form for entering parameters
}

function createOtherCamera(){
	//enable drawing tools
	enableDrawing();
}
	
function enableDrawing(){
	// Leaflet draw
	map.addLayer(drawnItems);
	var drawControl = new L.Control.Draw({
		edit: {
			featureGroup: drawnItems
		}
	});
	map.addControl(drawControl);	
}

function drawCreated(feature) {
    var type = feature.layerType,
        layer = feature.layer;

    if (type === 'marker') {
        var dialog = $('<p>Please add some information.</p>').dialog({
			modal: true,
			width: 330,
			title: "Marker created",
			buttons: {
				"OK": function() {dialog.dialog('close');}
			}
		});	
    
	} else if(type === 'rectangle'){
		var dialog = $('<p>Please add some information.</p>').dialog({
			modal: true,
			width: 330,
			title: "Rectangle created",
			buttons: {
				"OK": function() {dialog.dialog('close');}
			}
		});	
	
	} else if(type === 'circle'){
		var dialog = $('<p>Please add some information.</p>').dialog({
			modal: true,
			width: 330,
			title: "Circle created",
			buttons: {
				"OK": function() {dialog.dialog('close');}
			}
		});	
	
	} else if(type === 'polygon'){
		var dialog = $('<p>Please add some information.</p>').dialog({
			modal: true,
			width: 330,
			title: "Polygon created",
			buttons: {
				"OK": function() {dialog.dialog('close');}
			}
		});	
	}

    // Do whatever else you need to. (save to db, add to map etc)
    map.addLayer(layer);
}