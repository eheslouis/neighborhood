var map;
function initMap() {

	var myLatLng = {lat: 21.063467, lng: 105.829238};

	map = new google.maps.Map(document.getElementById('map'), {
		center: myLatLng,
		zoom: 12
  	});
}