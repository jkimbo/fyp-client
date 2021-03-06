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
  Tracker.getInfo('/stops', { position: Tracker.app.user.get('position') } , function(result) {
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
      Tracker.router.navigate('stop/'+$(this).data('id'));
      var stop = Tracker.app.stops.get($(this).data('id'));
      Tracker.map.setCenter(
        stop.get('lat'),
        stop.get('lng')
      );
      // remove other stops
      $.each(Tracker.app.stops.without(stop), function(index, stop) {
        stop.marker.setMap(null);
        Tracker.map.markers = _.without(Tracker.map.markers, stop.marker);
      });
      $('#controls #stop').text(stop.get('description')).show(); // TODO
      $('#controls #list').fadeOut(200).empty();

      Tracker.getInfo('/coaches', { stop: stop.get('id') }, function(result) {
        console.log(result);
        _.each(result.coaches, function(obj, index) {
          console.log(obj);
          obj.dur_hum = moment().add('seconds', obj.duration).fromNow();
          Tracker.app.coaches.add(new Coach(obj));
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
          //$('#controls #coach').html(T['coachinfo'].render(coach.toJSON()));
          //$('#controls #list').fadeOut(200).empty(); // TODO
          // plot coach route and current location
          // TODO: colour route that coach has travelled in a lighter colour than the route it has yet to travel
          Tracker.map.drawPolyline({
            path: coach.get('route').points,
            strokeColor: '#131540',
            strokeOpacity: 0.6,
            strokeWeight: 6
          });
          coach.set('marker', Tracker.map.addMarker({
            lat: coach.get('location').lat,
            lng: coach.get('location').lng,
            title: 'Coach location',
            icon: '/img/bus.png'
          }));
          Tracker.centerMap();

          // subscribe to coach channel
          coach.socket = io.connect('http://localhost:1337/coach-'+coach.get('id'));
          coach.socket.on('connect', function() {
            coach.socket.emit('set stop', stop.get('id'));
          });
          coach.socket.on('location', function(data) {
            // update coach location
            coach.get('marker').setPosition(new google.maps.LatLng(data.lat, data.lng));
            // update estimated time of arrival
            data.dur_hum = moment().add('seconds', data.duration).fromNow();
            $('#list #'+coach.get('id')+' #duration').text(data.dur_hum);
          });
          return false;
        });
      });
      $('#controls #list').append(T['coachlist'].render()).fadeIn(200);
      return false;
    });

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
