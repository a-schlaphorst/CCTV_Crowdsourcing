/*****Variables*****/

var homeMap;

/*****Functions*****/

function initializeHomeMap(){

	// create map
	homeMap = L.map('map', {editable: true}).setView([44.9716, -93.2429], 18);
	
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
	
	
}

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
			polygon.addTo(homeMap);
		}
		
		// check if camera is circle
		if(camera.type === "Circle"){
			var radius = camera.radius;
			// create leaflet circle (convert coordinate-format)
			var circle = L.circle(L.latLng(coordinates[1], coordinates[0]), radius);
			circle.addTo(homeMap);
		}
	}
}