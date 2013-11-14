//=== first support methods that don't (yet) exist in v3
intel.maps.LatLng.prototype.distanceFrom = function (newLatLng) {
	var EarthRadiusMeters = 6378137.0; // meters
	var lat1 = this.lat();
	var lon1 = this.lng();
	var lat2 = newLatLng.lat();
	var lon2 = newLatLng.lng();
	var dLat = (lat2 - lat1) * Math.PI / 180;
	var dLon = (lon2 - lon1) * Math.PI / 180;
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = EarthRadiusMeters * c;
	return d;
};

intel.maps.LatLng.prototype.latRadians = function () {
	return this.lat() * Math.PI / 180;
};

intel.maps.LatLng.prototype.lngRadians = function () {
	return this.lng() * Math.PI / 180;
};

//=== A method which returns the length of a path in metres ===
intel.maps.Polygon.prototype.Distance = function () {
	var dist = 0, i = 0;
	for (i = 1; i < this.getPath().getLength(); i++) {
		dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
	}
	return dist;
};

//=== A method which returns a GLatLng of a point a given distance along the path ===
//=== Returns null if the path is shorter than the specified distance ===
intel.maps.Polygon.prototype.GetPointAtDistance = function (metres) {
	// some awkward special cases
	if (metres == 0) {
		return this.getPath().getAt(0);
	}
	if (metres < 0) {
		return null;
	}
	if (this.getPath().getLength() < 2) {
		return null;
	}

	var dist = 0, olddist = 0, i = 0;

	for (i = 1; (i < this.getPath().getLength() && dist < metres); i++) {
		olddist = dist;
		dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
	}
	if (dist < metres) {
		return null;
	}
	var p1 = this.getPath().getAt(i - 2);
	var p2 = this.getPath().getAt(i - 1);
	var m = (metres - olddist) / (dist - olddist);
	return new intel.maps.LatLng(p1.lat() + (p2.lat() - p1.lat()) * m, p1.lng() + (p2.lng() - p1.lng()) * m);
};

//=== A method which returns the Vertex number at a given distance along the path ===
//=== Returns null if the path is shorter than the specified distance ===
intel.maps.Polygon.prototype.GetIndexAtDistance = function (metres) {
	// some awkward special cases
	if (metres == 0) {
		return this.getPath().getAt(0);
	}
	if (metres < 0) {
		return null;
	}
	var dist = 0, i = 0;
	for (i = 1; (i < this.getPath().getLength() && dist < metres); i++) {
		dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
	}
	if (dist < metres) {
		return null;
	}
	return i;
};

//=== Copy all the above functions to GPolyline ===
intel.maps.Polyline.prototype.Distance             = intel.maps.Polygon.prototype.Distance;
intel.maps.Polyline.prototype.GetPointAtDistance   = intel.maps.Polygon.prototype.GetPointAtDistance;
intel.maps.Polyline.prototype.GetIndexAtDistance   = intel.maps.Polygon.prototype.GetIndexAtDistance;





