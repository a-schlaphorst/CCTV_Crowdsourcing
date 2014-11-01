/*
This class delegates the site navigation
*/
var cameraType;
var viewingDistance;
var angularSize;

// ensures that only one polygon is drawn
var drawEditable = true;

$(document).delegate('.ui-page', 'pageshow', function() {
	if ($.mobile.activePage.attr('id') == 'home-page'){
		initializeHomeMap();
		
	} else if ($.mobile.activePage.attr('id') == 'confirm-dome-camera-page'){
		cameraType = "dome";
		
	} else if ($.mobile.activePage.attr('id') == 'confirm-bullet-camera-page'){
		cameraType = "bullet";
		
	} else if ($.mobile.activePage.attr('id') == 'add-camera-map-page'){
		viewingDistance = ($('#slider-height').val() * 3) / 1000;		
		angularSize = $('#angular-size :radio:checked').val();
		
		initializeAddCameraMap();
	}
});