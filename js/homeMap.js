/*****Variables*****/

var homeMap;
var positionCircle;
var cameras = [];

// array of route-paths with different colored
routePaths = [];

var directionsService = new google.maps.DirectionsService();

/*****Functions*****/

function initializeHomeMap(){
	// If map is already initialized => only refresh polygons
	if(homeMap){
		// load polygons from database
		loadCamerasFromDB();
		return;
	}

	// create map
	homeMap = L.map('map', {editable: true}).setView([44.9716, -93.2429], 16);
	
	// create baselayer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18
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
	
	// create locateme button
 	L.control.locate({
 		icon: 'fa fa-map-marker',		
 		iconLoading: 'fa fa-spinner fa-spin'		
 	}).addTo(homeMap);
	
	// add listener
	homeMap.on('locationfound', onLocationFound);
	
	// load polygons from database
	loadCamerasFromDB();
}

function loadCamerasFromDB(){
	// Delete old camera from map
	if(cameras){
		for(var i = 0; i < cameras.length; i++){
			homeMap.removeLayer(cameras[i]);
		}
		cameras = [];
	}
	
	// Get filter parameter
	var filterParams = getFilterParams();
		
	// Send DB request
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else { // code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var results = JSON.parse(xmlhttp.responseText);
		
			$.each(results.features, function(i, camera){
				var coordinates = convertCoordsToLeaflet(camera.geometry.coordinates[0]);
				for(var j = 0; j < coordinates.length; j++){
					var properties = camera.properties;
					var polygon = L.polygon(coordinates, {color: getCameraColor(properties.type), fillOpacity: 0.1, opacity: 0.1, lineJoin: "round"});
					var container = $('<div>');
					
					container.on('click', '#seeComments', function() {
						selectedCameraId = properties.id;
						fillCommentsPage(selectedCameraId);
					});
					
					container.on('click', '#confirmCamera', function() {
						// register vote on db
						if (window.XMLHttpRequest) {
						// code for IE7+, Firefox, Chrome, Opera, Safari
							xmlhttp = new XMLHttpRequest();
						} else { // code for IE6, IE5
							xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
						}
						xmlhttp.onreadystatechange = function() {
							if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
								// show pop up
								$( "#confirmationRegisteredPopup" ).popup();
								$( "#confirmationRegisteredPopup" ).popup( "open" );
								setTimeout(function(){
									$( "#confirmationRegisteredPopup" ).popup("close")
								}, 2000);
						
								// reload cams on map
								loadCamerasFromDB();
							}
						}
	
						xmlhttp.open("GET","php/postconfirmation.php?id=" + properties.id + "&confirmtimes=" + (parseInt(properties.confirmtimes) + 1),true);
						xmlhttp.send();
					});
					
					container.on('click', '#declineCamera', function() {
						// register vote on db
						if (window.XMLHttpRequest) {
						// code for IE7+, Firefox, Chrome, Opera, Safari
							xmlhttp = new XMLHttpRequest();
						} else { // code for IE6, IE5
							xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
						}
						xmlhttp.onreadystatechange = function() {
							if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
								// show pop up
								$( "#confirmationRegisteredPopup" ).popup();
								$( "#confirmationRegisteredPopup" ).popup( "open" );
								setTimeout(function(){
									$( "#confirmationRegisteredPopup" ).popup("close")
								}, 2000);
						
								// reload cams on map
								loadCamerasFromDB();
							}
						}
	
						xmlhttp.open("GET","php/postconfirmation.php?id=" + properties.id + "&confirmtimes=" + (parseInt(properties.confirmtimes) - 1),true);
						xmlhttp.send();
					});
					
					container.html('<table>' + 
						'<tr><td><b>Description</b></td><td>' + properties.description + '</td></tr>' +
						'<tr><td><b>Latitude</b></td><td>' + coordinates[j].lat + '</td></tr>' +
						'<tr><td><b>Longitude</b></td><td>' + coordinates[j].lng + '</td></tr>' +
						'<tr><td><b>Type</b></td><td>' + getCameraTypeString(properties.type) + '</td></tr>' +					
						'<tr><td><b>Submission</b></td><td>'  + properties.time + '</td></tr>' +
						'<tr><td><b>Floor-level</b></td><td>'  + properties.height + '</td></tr>' +
						'<tr><td><b>Camera-ID</b></td><td>'  + properties.id + '</td></tr>' +
						'<tr><td><b>Rating</b></td><td>' + getStarRating(properties.confirmtimes) + '(' + properties.confirmtimes + ')</td></tr>' +
						'<tr><td><a href="#camera-comments-page" id="seeComments" class="link">Comments</a></td>' +
						'<td>' +
							'<a href="#" id="confirmCamera" class="link"><img src="images/voteup.png"></a>&nbsp;&nbsp;&nbsp;' +
							'<a href="#" id="declineCamera" class="link"><img src="images/votedown.png"></a>' +
						'</td></tr></table></div>');

					// Insert the container into the popup
					polygon.bindPopup(container[0]);
					cameras.push(polygon);
				}
			});
			//TODO add polygons to map
			for(var k = 0; k < cameras.length; k++){
				cameras[k].addTo(homeMap);
			}
		}
	}
	xmlhttp.open("GET","php/getcameras.php?dome=" + filterParams.dome +
		"&bullet=" + filterParams.bullet +
		"&mobile=" + filterParams.mobile + 
		"&threshold=" + filterParams.threshold +
		"&date=" + filterParams.date,
		true
	);
	xmlhttp.send();
}

function getFilterParams(){
	return {
		"dome": $('#dome-flipswitch').val(),
		"bullet": $('#bullet-flipswitch').val(),
		"mobile": $('#mobile-flipswitch').val(),
		"threshold": $('#time-threshold :radio:checked').val(),
		"date": $('#date-filter').val()
	}
}

function resetFilters(){
	$('#dome-flipswitch').val("on").slider("refresh");;
	$('#bullet-flipswitch').val("on").slider("refresh");;
	$('#mobile-flipswitch').val("on").slider("refresh");;
	$('input:radio[name="date-option"]').filter('[value="any"]').parent().find("label[for].ui-btn").click()
	$('#date-filter').val("");
	loadCamerasFromDB();
}

function onLocationFound(location) {
	locationCoordinates = location.latlng;
	
	$('#home-page-header').css({"background":"#40C740"});
	for(var i = 0; i < cameras.length; i++){
		var camera = cameras[i];
		if(camera.getBounds().contains(locationCoordinates)){
			$('#home-page-header').css({"background":"#FF4747"});
		}
	}
}