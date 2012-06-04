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

  /*
  Tracker.map = new google.maps.Map(
    document.getElementById("map_canvas"),
    {
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
  );

  // This is needed to set the zoom after fitbounds,
  google.maps.event.addListener(Tracker.map, 'zoom_changed', function() {
    zoomChangeBoundsListener =
      google.maps.event.addListener(Tracker.map, 'bounds_changed', function(event) {
        if (this.getZoom() > config.minZoom && this.initialZoom == true) {
          // Change max/min zoom here
          this.setZoom(config.minZoom);
          this.initialZoom = false;
        }
        google.maps.event.removeListener(zoomChangeBoundsListener);
      });
  });
  Tracker.map.initialZoom = true;

  Tracker.view = new google.maps.LatLngBounds();
  Tracker.directions = new google.maps.DirectionsService();
  Tracker.directionsDisplay = new google.maps.DirectionsRenderer();
  Tracker.directionsDisplay.setMap(Tracker.map);
  Tracker.directionsDisplay.setOptions({
    preserveViewport: true,
    suppressMarkers: true
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      setPosition(position);
      // get nearest stop location
      getInfo('/findstop'
        , { position: position }
        , function(msg) {
          var pos = new google.maps.LatLng(
            msg.coords.latitude,
            msg.coords.longitude
          );
          if(Tracker.stop) {
            Tracker.stop.setPosition(pos);
          } else {
            Tracker.stop = new google.maps.Marker({
              position: pos,
              map: Tracker.map,
              icon: 'img/busstop.png',
              animation: google.maps.Animation.Drop,
              title: 'Stop'
            });
          }
          Tracker.view.extend(pos);
          Tracker.map.fitBounds(Tracker.view);

          var stop = pos; // TODO

          // get nearest coach location
          getInfo('/findcoach'
            , { position: msg.coords }
            , function(msg) {
              var pos = new google.maps.LatLng(
                msg.coords.latitude,
                msg.coords.longitude
              );
              if(Tracker.coach) {
                Tracker.coach.setPosition(pos);
              } else {
                Tracker.coach = new google.maps.Marker({
                  position: pos,
                  map: Tracker.map,
                  icon: 'img/bus.png',
                  animation: google.maps.Animation.Drop,
                  title: 'Coach'
                });
              }
              Tracker.view.extend(pos);
              Tracker.map.fitBounds(Tracker.view);
              // plot directions on map
              Tracker.directions.route({
                origin: pos,
                destination: stop,
                travelMode: google.maps.TravelMode.DRIVING
              }, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                  Tracker.directionsDisplay.setDirections(result);
                }
              });
            }
          );
        }
      );
    }, function(msg) {
      alert('error: '+msg);
    });
    //navigator.geolocation.watchPosition(setPosition);
  } else {
    alert('geolocation not supported');
    // if no geolocation then prompt to input manually
  }

  */
  /*
  $(window).resize(function() {
    $('#map_canvas').width($(window).width());
    $('#map_canvas').height($(window).height());
  });
  */

  function setPosition(position) {
    /*
     * Set current marker
     */
    var current = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );
    //map.setCenter(current);
    Tracker.view.extend(current);
    Tracker.map.fitBounds(Tracker.view);
    if(Tracker.currentloc) {
      Tracker.currentloc.setPosition(current);
    } else {
      Tracker.currentloc = new google.maps.Marker({
        position: current,
        map: Tracker.map,
        icon: 'img/current.png',
        animation: google.maps.Animation.DROP,
        title:"There you are!"
      });
    }
    google.maps.event.addListener(Tracker.currentloc, 'click', toggleBounce);

    setAddress(current, function(address) {
      $('#address').text(address);
    });

    function toggleBounce() {
      if (Tracker.currentloc.getAnimation() != null) {
        Tracker.currentloc.setAnimation(null);
      } else {
        Tracker.currentloc.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
          Tracker.currentloc.setAnimation(null);
        }, 1000);
      }
    }
  }
});

/*
 * Get address from latlng
 *
 * position - google maps latlng
 *
 * Returns string
 */
function setAddress(position, callback) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'latLng': position}, function(results, status) {
    if(status == google.maps.GeocoderStatus.OK) {
      if(results[0]) {
        if(typeof callback == 'function') {
          callback(results[1].formatted_address);
        }
      }
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

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
