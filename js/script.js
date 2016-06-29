var initLocation = {lat: 21.030708, lng: 105.852405};
var myPlaces = 
[
	{
		position: {lat: 21.023418, lng: 105.8516438},
		title: "Vietnamese Women's Museum",
		search: "Vietnamese Women's Museum"
	},
	{
		position: {lat: 21.030708, lng: 105.852405},
		title: "Hoan Kiem Lake",
		search: "Hoàn Kiếm Lake"
	},
	{
		position: {lat: 21.035302, lng: 105.849257},
		title: "Old Quarter",
		search: "Hoàn Kiếm District"
	},
	{
		position: {lat: 21.036713, lng: 105.834731},
		title: "Ho Chi Minh Mausoleum",
		search: "Ho Chi Minh Mausoleum"
	},
	{
		position: {lat: 21.047953, lng: 105.836979},
		title: "Pagoda Trấn Quốc",
		search: "Trấn Quốc Pagoda"
	}
];

var filterText = ko.observable("");

var wikiURL ='https://en.wikipedia.org/w/api.php?action=opensearch&format=json&callback=wikiCallBack&search=';

var flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6937383c723fa2089a26ae7e3a4fa4cc&format=json&page=1&per_page=1&text=';
var flickrPic = 'https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg';

var Place = function (data, map){
	var self = this;
	this.position = ko.observable(data.position);
	this.title = ko.observable(data.title);
	this.marker = ko.observable();
	this.searchWiki = data.search;
	this.content = '<h3>' + self.title() + '</h3>';

	this.marker = new google.maps.Marker({
	    position: this.position(),
	    map: map,
	    title: this.title()
	  });
	self.marker.setAnimation(null); //init marker with no animation

	//when search is reset, recheck the visibility
	this.visible = ko.computed(function(){
		if (filterText().length > 0){
			return (self.title().toLowerCase().indexOf(filterText().toLowerCase()) > -1);
		}
		else{
			return true;
		}
	},this);

	//search wikipedia for info on place
    $.ajax({
        url: wikiURL+self.searchWiki,
        dataType: 'jsonp',
    	timeout: 8000,
        success: function(data) {
           self.content = '<h3>' + self.title() + '</h3>'+'<p>' + data[2][0] +'<a href=' + data[3][0] + ' target="blank"> Wikipedia</a></p>';
        },
        fail: function(){
        	alert("failed to get wikipedia resources");
        }
    });

    $.ajax({
        url: flickrUrl+self.searchWiki,
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
    	timeout: 8000,
        success: function(data) {
        	var url = flickrPic.replace('{farm-id}',data.photos.photo[0].farm).replace('{server-id}',data.photos.photo[0].server).replace('{id}',data.photos.photo[0].id).replace('{secret}',data.photos.photo[0].secret);
            self.content += '<img class="img-info" src="'+ url +'">';
        },
        fail: function() {
		    alert("failed to get flickr resources");
        }
    });

    //bounce marker when click on it or list
    this.toggleBounce = function() {
	  	if (self.marker.getAnimation() !== null) 
	  	{
	    	self.marker.setAnimation(null);
	  	} 
	  	else 
	  	{
	    	self.marker.setAnimation(google.maps.Animation.BOUNCE);
	    	setTimeout(function(){
    			self.marker.setAnimation(null);
			}, 2000);
	  	}
	};
};

var ViewModel = function(){
	var self = this;
	// this.filterText = ko.observable();

	//init map
	this.map = new google.maps.Map(document.getElementById('map'), {
		center: initLocation,
		zoom: 13
  	});
  	//initialize for marker List
	this.placesList = ko.observableArray([]);
		myPlaces.forEach(function(placeItem){
			self.placesList.push(new Place(placeItem, self.map));
	});

	//setup the event listeners for marker clicks
	this.placesList().forEach(function(place){
		google.maps.event.addListener(place.marker, 'click', function () {
		    self.clickPlace(place);
		});
	});

	//show the info Window when click on marker or list
	var infowindow = new google.maps.InfoWindow();
	this.clickPlace = function(place){
		infowindow.setContent(place.content);
		infowindow.open(this.map, place.marker);
		place.toggleBounce();
	};

	self.filteredList = ko.computed(function(){
		var filtered = [];
		this.placesList().forEach(function(place){
			if (place.visible())
			{
				filtered.push(place);
			}
		});
		return filtered;
	}, this);
};

function start(){
	ko.applyBindings(new ViewModel());
}