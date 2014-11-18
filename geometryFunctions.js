/* Full-Circle coordinates given distance and amount of coordinates from start point
*
* startPoint (coordinates from start point)
* radius (radius of ring)
* n (amount of coordinates)
* return (array of coordinates)
*/
function createFullCirclePolygon(startPoint, radius, n){
	var coords = [];
	for(var i = 0; i < n; i++){
		coords.push(getBearingCoordinates(startPoint, i * (360 / n), radius));
	}
	
	return coords;
}

/* Circle-Extract coordinates given distance, angularSize, bearing and amount of coordinates from start point
*
* startPoint (coordinates from start point)
* bearing (direction of circle-extract from origin)
* angularSize (extract size)
* radius (radius of ring)
* n (amount of coordinates)
* return (array of coordinates)
*/
function createCircleExtractPolygon(startPoint, bearing, angularSize, radius, n){
	if(n < 2){
		n = 2;
	}
	var coords = [];
	coords.push(startPoint);
	for(var i = 0; i < n + 1; i++){
		coords.push(getBearingCoordinates(startPoint, bearing - (angularSize / 2) + (i * (angularSize / n)), radius));
	}
	coords.push(startPoint);
	
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

function getBearing(start, end){
	var startLat = toRadians(start.lat);
	var startLng = toRadians(start.lng);
	var endLat = toRadians(end.lat)
	var endLng = toRadians(end.lng)
	
	var y = Math.sin(endLng-startLng) * Math.cos(endLat);
	var x = Math.cos(startLat)*Math.sin(endLat) -Math.sin(startLat)*Math.cos(endLat)*Math.cos(endLng-startLng);
	var brng = Math.atan2(y, x);
	
	return toDegrees(brng);
}

/*
* 	Transform degree to radian
*/
function toRadians(degrees){
	var radians = degrees * (pi / 180);
	return radians;
}

/*
* 	Transform radian to degree
*/
function toDegrees(radians){
	var degrees = radians * (180 / pi);
	return degrees;
}

/*
*	Transform camera type-string into type-id for database
*/
function getCameraType(type){
	if(type == "dome"){
		return 1;
	} 
	else if(type == "bullet"){
		return 2;
	}
	else if (type == "mobile"){
		return 3;
	} else {
		return "NA"
	}
}