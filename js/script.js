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
	}

];

var Marker = function (data){
	this.position = ko.observable(data.position);
	this.title = ko.observable(data.title);
};


var ViewModel = function(){
	console.log("viewModel");
	var self = this;

	this.myLatLng = {lat: 21.063467, lng: 105.829238};
	this.map = new google.maps.Map(document.getElementById('map'), {
		center: this.myLatLng,
		zoom: 12
  	});
}; 

// 	var marker = new google.maps.Marker({
// 		position: myLatLng,
// 		map: map,
// 		title: 'my house'
// 	});
// };


ko.applyBindings(new ViewModel());