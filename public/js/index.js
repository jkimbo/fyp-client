/*
 * Define routes
 */
var AppRouter = Backbone.Router.extend({
  routes: {
    'route/:id': 'route',
    'coach/:id': 'coach',
    'stop/:id': 'stop',
    '*page': 'index',
    'test': 'test'
  },
  index: function(page) {
    $('#container').append(T['index'].r());
    Tracker.mapbackground = new GMaps({
      div: '#mapbackground',
      lat: 51.49843,
      lng: -0.17423
    });
    Tracker.locationbox = $('#indexform #curlocation')
    .keypress(function(e) {
      if(e.which == 13) {
        console.log('enter');
      }
    });

    $('#index #findstops').click(function() {
      $('#container').empty();
      Tracker.initMap();
      return false;
    });

    $('#index #togglelocation').click(function() {
      Tracker.locationbox.val('');
      if(Tracker.locationbox.data('location') && Tracker.locationbox.data('locationenabled')) {
        // clear determined location and allow user to input location manually
        Tracker.locationbox.data('location', false).removeAttr('disabled').focus();
      } else {
        // enable determined location
        Tracker.app.getLocation();
      }
      return false;
    });

    Tracker.app.user.getLocation(function(position, location) {
      Tracker.setLocation(location.formatted_address);
      // Add marker
      Tracker.curlocation = Tracker.mapbackground.addMarker({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        title: 'You are here!',
        icon: 'img/current.png',
        infoWindow: {
          content: '<p>'+location.formatted_address+'</p>'
        }
      });
      Tracker.mapbackground.setCenter(position.coords.latitude, position.coords.longitude);
    });

    /*
     * Check if user has defined a favourite route
     */
    if($.cookie('route')) {
      // initialise map to that route
      $('#container').append(T['map'].r());
      Tracker.initMap();
    } else {
      // ask for route
      $('#routeform').submit(function() {
        var route = $('#routeform #routeval').val();
        $.cookie('route', route, { expires: 100 });
        $('#routeform').fadeOut(400, function() {
          $('#container').empty();
          $('#container').append(T['map'].r()).hide();
          $('#container').fadeIn(300);
          Tracker.initMap();
        });
        return false;
      });
    }
  },
  test: function() {
    console.log('test');
  },
  stop: function(id) {
    console.log('stop', id);
  }
});

Tracker.setLocation = function(address) {
  Tracker.locationbox.val('');
  Tracker.locationbox.val(address).addClass('disabled').attr('disabled', 'true').data('location', true);
  $('#indexform .icon-loading').attr('class', 'icon-map-marker');
}

$(function() {
  Tracker.app = new App;
  // Initiate the router
  Tracker.router = new AppRouter();
  // Start Backbone history a neccesary step for bookmarkable URL's
  Backbone.history.start({pushState: true});

  $('#clearcookie').on('click', function() {
    $.cookie('route', null);
    location.reload(true);
    return false;
  });

  var socket = io.connect('http://localhost:1337/coach-101');
  socket.on('message', function(data) {
    console.log(data);
  });
  socket.on('location', function(data) {
    console.log(data);
  });
});
