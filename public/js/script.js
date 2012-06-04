window.Tracker = window.Tracker || {};

$(function() {

  /*
   * Initialise Google maps
   */
  Tracker.map = new GMaps({
    div: '#map_canvas',
    lat: 51.49843,
    lng: -0.17423
  });

  /*
   * Find user location
   */
  GMaps.geolocate({
    success: function(position) {
      Tracker.map.setCenter(position.coords.latitude, position.coords.longitude); // center map on
      // Find location address
      GMaps.geocode({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        callback: function(results, status) {
          if(status == 'OK') {
            // Add marker
            Tracker.curlocation = Tracker.map.addMarker({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              title: 'You are here!',
              icon: 'img/current.png',
              infoWindow: {
                content: '<p>'+results[0].formatted_address+'</p>'
              }
            });
          } else {
            console.log('Problem in geocode');
          }
        }
      });

      // find nearest stop
      Tracker.getInfo('/findstop', { position: position } , function(result) {
        console.log(result);
        Tracker.nearstop = {
          marker: Tracker.map.addMarker({
                    lat: result.coords.latitude,
                    lng: result.coords.longitude,
                    title: 'Nearest stop',
                    icon: 'img/busstop.png',
                    animation: google.maps.Animation.Drop,
                    infoWindow: {
                      content: '<p>Information about coach stop</p>'
                    }
                  }),
          position: result.coords
        };

        // plot nearest coach location
        Tracker.nearcoach = {
          marker: Tracker.map.addMarker({
                    lat: result.coaches[0].coords.latitude,
                    lng: result.coaches[0].coords.longitude,
                    title: 'Nearest coach',
                    icon: 'img/bus.png',
                    animation: google.maps.Animation.Drop,
                    infoWindow: {
                      content: '<p>Route: '+result.coaches[0].route+'</p>'
                    }
                  }),
          position: result.coaches[0].coords
        };

        // plot route of coach to stop
        Tracker.map.drawRoute({
          origin: [Tracker.nearcoach.position.latitude, Tracker.nearcoach.position.longitude],
          destination: [Tracker.nearstop.position.latitude, Tracker.nearstop.position.longitude]
        });

        // center map on markers
        Tracker.map.centerMap();
      });
    },
    error: function(error) {
      alert('Geolocation failed: '+error.message);
    },
    not_supported: function() {
      alert("Your browser does not support geolocation");
    }
  });
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
