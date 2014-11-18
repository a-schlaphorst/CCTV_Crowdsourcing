/*
This class delegates the site navigation
*/
var cameraType;
var cameraHeight;
var viewingDistance;
var angularSize;
var description;
var selectedCameraId;

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
		
			cameraHeight = $('#slider-floor-level-dome').val();
			description = $('#dome-description').val();
			
		} else if(cameraType == "bullet") {
		
			cameraHeight = $('#slider-floor-level-bullet').val();
			angularSize = $('#angular-size :radio:checked').val();
			description = $('#bullet-description').val();
			
		} else if(cameraType == "mobile") {
		
			cameraHeight = $('#slider-floor-level-mobile').val();
			description = $('#mobile-description').val();
		}
		viewingDistance = cameraHeight / 100;	
		initializeAddCameraMap();
	}
});