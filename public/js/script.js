$(function() {
  //$('#map_canvas').width($(window).width());
  //$('#map_canvas').height($(window).height());
  var options = {
    center: new google.maps.LatLng(51.50812890, -0.1280050),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(
    document.getElementById("map_canvas"),
    options
  );

  // This is needed to set the zoom after fitbounds,
  google.maps.event.addListener(map, 'zoom_changed', function() {
    zoomChangeBoundsListener = 
      google.maps.event.addListener(map, 'bounds_changed', function(event) {
        if (this.getZoom() > config.minZoom && this.initialZoom == true) {
          // Change max/min zoom here
          this.setZoom(config.minZoom);
          this.initialZoom = false;
        }
        google.maps.event.removeListener(zoomChangeBoundsListener);
      });
  });
  map.initialZoom = true;

  var currentloc
    , coach
    , stop
    , view = new google.maps.LatLngBounds();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      setPosition(position);
      getStop(position, function(msg) {
        var pos = new google.maps.LatLng(
          msg.coords.latitude,
          msg.coords.longitude
        );
        if(stop) {
          stop.setPosition(pos);
        } else {
          stop = new google.maps.Marker({
            position: pos,
            map: map,
            animation: google.maps.Animation.Drop,
            title: 'Stop'
          });
        }
        view.extend(pos);
        map.fitBounds(view);

        getCoach(msg.coords, function(msg) {
          console.log(msg);
          var pos = new google.maps.LatLng(
            msg.coords.latitude,
            msg.coords.longitude
          );
          if(coach) {
            coach.setPosition(pos);
          } else {
            coach = new google.maps.Marker({
              position: pos,
              map: map,
              animation: google.maps.Animation.Drop,
              title: 'Coach'
            });
          }
          view.extend(pos);
          map.fitBounds(view);
        });
      });
    }, function(msg) {
      alert('error: '+msg);
    });
    //navigator.geolocation.watchPosition(setPosition);
  } else {
    alert('geolocation not supported');
    // if no geolocation then prompt to input manually
  }

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
    view.extend(current);
    map.fitBounds(view);
    if(currentloc) {
      currentloc.setPosition(current);
    } else {
      currentloc = new google.maps.Marker({
        position: current,
        map: map,
        animation: google.maps.Animation.DROP,
        title:"There you are!"
      });
    }
    google.maps.event.addListener(currentloc, 'click', toggleBounce);

    setAddress(current, function(address) {
      $('#address').text(address);
    });

    function toggleBounce() {
      if (currentloc.getAnimation() != null) {
        currentloc.setAnimation(null);
      } else {
        currentloc.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
          currentloc.setAnimation(null);
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
 * Get location of nearest stop
 */
function getStop(position, callback) {
  var url = config.serverUrl + '/findstop';
  $.ajax({
    dataType: 'jsonp',
    jsonp: 'callback',
    url: url,
    data: {
      position: position
    }
  }).done(function(msg) {
    if(typeof(callback) == 'function') {
      callback(msg);
    }
  });
}

/*
 * Get location of nearest coach
 */
function getCoach(position, callback) {
  var url = config.serverUrl + '/find';
  $.ajax({
    dataType: 'jsonp',
    jsonp: 'callback',
    url: url,
    data: {
      position: position
    }
  }).done(function(msg) {
    if(typeof(callback) == 'function') {
      callback(msg);
    }
  });
}
