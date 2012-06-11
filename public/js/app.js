window.Tracker = window.Tracker || {};

/*
 * Set up app
 */
var App = Backbone.Model.extend({
  initialize: function() {
    this.user = new User;
    this.stops = new Stops;
    this.coaches = new Coaches;
  }
});

var User = Backbone.Model.extend({
  initialize: function() {

  },
  /*
   * Try and get the users current location
   */
  getLocation: function(callback) {
    var self = this;
    GMaps.geolocate({
      success: function(position) {
        self.set({position: position});
        Tracker.locationbox.data('locationenabled', true);
        GMaps.geocode({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          callback: function(results, status) {
            if (status == 'OK') {
              self.set({ position_address: results });
              if(typeof callback == 'function') {
                callback(position, results[0]);
              }
              /*
              var location = results[0];
              console.log(results);
              $('#indexform #curlocation').val(location.formatted_address).addClass('disabled').attr('disabled', 'true').data('location', true);
              $('#indexform .icon-loading').attr('class', 'icon-map-marker');
              var latlng = results[0].geometry.location;
              var watchid = navigator.geolocation.watchPosition(function(position) {
                console.log(position);
              });
              */
            }
          }
        });
      },
      error: function(error) {
        alert('Geolocation failed: '+error.message);
        Tracker.locationbox.data('locationenabled', false);
      },
      not_supported: function() {
        alert("Your browser does not support geolocation");
        Tracker.locationbox.data('locationenabled', false);
      }
    });
  }
});

var Stop = Backbone.Model.extend({
  addMarker: function() {
    this.marker = Tracker.map.addMarker({
      lat: this.get('latitude'),
      lng: this.get('longitude'),
      title: 'Coach stop',
      icon: 'img/busstop.png',
      animation: google.maps.Animation.Drop,
      infoWindow: {
        content: '<p>'+this.get('description')+'</p>'
      }
    });
  }
});

var Stops = Backbone.Collection.extend({
  model: Stop
});

var Coach = Backbone.Model.extend({

});

var Coaches = Backbone.Collection.extend({
  model: Coach
});

/*
 * Get info from server
 */
Tracker.getInfo = function(route, data, callback) {
  var url = config.serverUrl + route;
  $.ajax({
    dataType: 'jsonp',
    url: url,
    data: data
  }).done(function(msg) {
    if(typeof(callback) == 'function') {
      callback(msg);
    }
  });
}

