/*
 * Google maps rendering and functionality
 */
window.Tracker = window.Tracker || {};

/*
 * Initialise map
 */
Tracker.initMap = function() {
  $('#container').append(T['map'].r());
  /*
   * Initialise Google maps
   */
  Tracker.map = new GMaps({
    div: '#map_canvas',
    lat: 51.49843,
    lng: -0.17423
  });

  // add controls
  $('#container').append(T['controls'].r());

  // Add marker
  Tracker.curlocation = Tracker.map.addMarker({
    lat: Tracker.app.user.get('position').coords.latitude,
    lng: Tracker.app.user.get('position').coords.longitude,
    title: 'You are here!',
    icon: 'img/current.png',
    infoWindow: {
      content: '<p>'+Tracker.app.user.get('position_address')[0].formatted_address+'</p>'
    }
  });

  // find nearest stop
  Tracker.getInfo('/findstop', { position: Tracker.app.user.get('position') } , function(result) {
    _.each(result.stops, function(stop, index) {
      var stop = new Stop({
        id: stop.id,
        latitude: stop.coords.latitude,
        longitude: stop.coords.longitude,
        description: stop.description
      });
      stop.addMarker();
      Tracker.app.stops.add(stop);
    });

    var list = T['stoplist'].render({
      'stops': Tracker.app.stops.toJSON()
    });
    $('#controls #list').append(list)
    .find('.coachstop').click(function() {
      var stop = Tracker.app.stops.get($(this).data('id'));
      Tracker.map.setCenter(
        stop.get('latitude'),
        stop.get('longitude')
      );
      return false;
    });

    /*
    $('#controls #stop').empty().html('Your nearest stop is: ').append(link);

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

    */
    // center map on markers
    Tracker.centerMap();
  });

  // Re-centre map on window resize
  $(window).resize(function() {
    Tracker.centerMap();
  });
}

/*
 * Center map on markers
 */
Tracker.centerMap = function() {
    Tracker.map.fitZoom();
    // wait till fitBounds has finished then zoom out one level to make sure all markers are available
    /*
    var zoomChangeBoundsListener =
      google.maps.event.addListenerOnce(Tracker.map.map, 'bounds_changed', function(event) {
        if (Tracker.map.map.getZoom()){
          Tracker.map.zoomOut(1); // bit of a hack but makes sure all markers are visible
        }
      });
    setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 2000); // clear event listener in case it is not called
    */
}
