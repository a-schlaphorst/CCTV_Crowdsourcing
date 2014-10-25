/*
This class delegates the site navigation
*/
var cameraType;
var viewingDistance;
var drawEditable = true;

$(document).delegate('.ui-page', 'pageshow', function() {
	if ($.mobile.activePage.attr('id') == 'home-page'){
		initializeHomeMap();
		
	} else if ($.mobile.activePage.attr('id') == 'confirm-dome-camera-page'){
		cameraType = "dome";
		
	} else if ($.mobile.activePage.attr('id') == 'add-camera-map-page'){
		var value = $('#slider-height').val();
		viewingDistance = (value * 3) / 1000
		initializeAddCameraMap();
	}
});