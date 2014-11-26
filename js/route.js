function calculateRoute(){
	var request = {
      origin: $('#origin-text-field').val(),
      destination: $('#destination-text-field').val(),
      travelMode: google.maps.TravelMode[$("#travel-mode :radio:checked").val()]
	};
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			// create array of coordinates from google-encoded path
			var coordinates = L.PolylineUtil.decode(response.routes[0].overview_polyline)
			
			
			// for each coordinates check if under surveillance
			for(var i = 0; i < coordinates.length - 1; i++){
				var isSurveilled = false;
				// check if within bound of any camera
				for(var j = 0; j < cameras.length; j++){
					// check start and end of each path
					if(cameras[j].getBounds().contains(coordinates[i]) || cameras[j].getBounds().contains(coordinates[i + 1])){
						isSurveilled = true;
						break;
					}
				}
				// select red for "under surveillance" otherwise green
				var color;
				if(isSurveilled){
					color = "#FF4747";
				} else {
					color = "#40C740";
				}
				
				// create polyline
				var polyline = L.polyline([coordinates[i],coordinates[i+1]], {color: color});
				polyline.addTo(homeMap)
				routePaths.push(polyline);
			}		
			// fit map-view to route
			homeMap.fitBounds([
				[coordinates[0][0], coordinates[0][1]],
				[coordinates[coordinates.length-1][0], coordinates[coordinates.length-1][1]]
			]);
			
			// display "remove route" button
			toggle_visibility('routeButton');
		}
	});
}

function removeRoute(){
	for(var i = 0; i < routePaths.length; i++){
		homeMap.removeLayer(routePaths[i]);
	}
	toggle_visibility('routeButton');
	
}