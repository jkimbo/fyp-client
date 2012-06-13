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
  $('#sidebar').append(T['controls'].r());

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
      var stop = new Stop(stop);
      stop.addMarker();
      Tracker.app.stops.add(stop);
    });

    var list = T['stoplist'].render({
      'stops': Tracker.app.stops.toJSON()
    });

    $('#controls #list').append(list)
    /*
     * Centre map on coach stop
     * Clear other coach stop markers
     * Add coach stop information to sidebar
     */
    .find('.coachstop').click(function() {
      var stop = Tracker.app.stops.get($(this).data('id'));
      Tracker.map.setCenter(
        stop.get('latitude'),
        stop.get('longitude')
      );
      // remove other stops
      $.each(Tracker.app.stops.without(stop), function(index, stop) {
        stop.marker.setMap(null);
        Tracker.map.markers = _.without(Tracker.map.markers, stop.marker);
      });
      $('#controls #stop').text(stop.get('description')); // TODO
      $('#controls #list').fadeOut(200).empty();
      Tracker.getInfo('/getcoaches', { stop: stop.get('id') }, function(result) {
        _.each(result.coaches, function(obj, index) {
          var coach = new Coach(obj);
          Tracker.app.coaches.add(coach);
        });
        var list = T['coachlist'].render({
          'coaches': Tracker.app.coaches.toJSON()
        });

        $('#controls #list').append(list)
        /*
         * Add coach information to sidebar
         * Show coach location on map
         * Show coach route on map
         * Give information about estimated time of arrival
         */
        .find('.coachlist').click(function() {
          var coach = Tracker.app.coaches.get($(this).data('id'));
          $('#controls #coach').text('Coach: '+coach.get('id'));
          $('#controls #list').fadeOut(200).empty(); // TODO
          // plot coach route and current location
          // TODO: colour route that coach has travelled in a lighter colour than the route it has yet to travel
          Tracker.map.drawPolyline({
            path: coach.get('route'),
            strokeColor: '#131540',
            strokeOpacity: 0.6,
            strokeWeight: 6
          });
          coach.set('marker', Tracker.map.addMarker({
            lat: coach.get('coords').latitude,
            lng: coach.get('coords').longitude,
            title: 'Coach location',
            icon: '/img/bus.png'
          }));
          Tracker.centerMap();
          return false;
        });
      });
      $('#controls #list').append(T['coachlist'].render()).fadeIn(200);
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
