/*
This class delegates the site navigation
*/
var cameraType;
var viewingDistance;
var angularSize;
var description;

// ensures that only one polygon is drawn
var drawEditable = true;

$(document).delegate('.ui-page', 'pageshow', function() {
	if ($.mobile.activePage.attr('id') == 'home-page'){
		initializeHomeMap();
		
	} else if ($.mobile.activePage.attr('id') == 'confirm-dome-camera-page'){
	
		cameraType = "dome";
		
	} else if ($.mobile.activePage.attr('id') == 'confirm-bullet-camera-page'){
	
		cameraType = "bullet";
		
	} else if ($.mobile.activePage.attr('id') == 'confirm-mobile-camera-page'){
	
		cameraType = "mobile";
		
	} else if ($.mobile.activePage.attr('id') == 'add-camera-map-page'){
	
		if(cameraType == "dome") {
		
			viewingDistance = $('#slider-floor-level-dome').val() / 100;
			description = $('#dome-description').val();
			
		} else if(cameraType == "bullet") {
		
			viewingDistance = $('#slider-floor-level-bullet').val() / 100;	
			angularSize = $('#angular-size :radio:checked').val();
			description = $('#bullet-description').val();
			
		} else if(cameraType == "mobile") {
		
			viewingDistance = $('#slider-floor-level-mobile').val() / 100;
			description = $('#mobile-description').val();
		}
		initializeAddCameraMap();
	}
});