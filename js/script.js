var initLocation = {lat: 21.063467, lng: 105.829238};
var myPlaces = 
[
	{
		position: {lat: 21.063467, lng: 105.829238},
		title: "my house"
	},
	{
		position: {lat: 21.030708, lng: 105.852405},
		title: "Hoan Kiem Lake"
	},
	{
		position: {lat: 21.035302, lng: 105.849257},
		title: "Old Quarter"
	},
	{
		position: {lat: 21.036713, lng: 105.834731},
		title: "Ho Chi Minh Mausoleum"
	},
	{
		position: {lat: 21.047953, lng: 105.836979},
		title: "Pagoda Trấn Quốc"
	}

];

var Marker = function (data, map){
	this.position = ko.observable(data.position);
	this.title = ko.observable(data.title);
	this.marker = new google.maps.Marker({
		position: this.position(),
		map: map,
		title: this.title()
	});
	this.marker.setMap(map);
};

var ViewModel = function(){
	var self = this;

	this.map = new google.maps.Map(document.getElementById('map'), {
		center: initLocation,
		zoom: 13
  	});
	this.markersList = ko.observableArray([]);
	myPlaces.forEach(function(placeItem){
		self.markersList.push(new Marker(placeItem, self.map));
	});

};

ko.applyBindings(new ViewModel());