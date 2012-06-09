
/*
 * Define routes
 */
var AppRouter = Backbone.Router.extend({
  routes: {
    '*page': 'index',
    '/test': 'test'
  },
  index: function(page) {
    $('#container').append(T['index'].r());
    Tracker.locationbox = $('#indexform #curlocation')
    .keypress(function(e) {
      if(e.which == 13) {
        console.log('enter');
      }
    });

    $('#index #togglelocation').click(function() {
      Tracker.locationbox.val('');
      if(Tracker.locationbox.data('location') && Tracker.locationbox.data('locationenabled')) {
        // clear determined location and allow user to input location manually
        Tracker.locationbox.data('location', false).removeAttr('disabled').focus();
      } else {
        // enable determined location
        Tracker.getLocation();
      }
      return false;
    });

    Tracker.getLocation(function(positon, location) {
      Tracker.setLocation(location.formatted_address);
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
  }
});

/*
 * Try and get the users current location
 */
Tracker.getLocation = function(callback) {
  GMaps.geolocate({
    success: function(position) {
      Tracker.locationbox.data('locationenabled', true);
      GMaps.geocode({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        callback: function(results, status) {
          if (status == 'OK') {
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
};

Tracker.setLocation = function(address) {
  Tracker.locationbox.val('');
  Tracker.locationbox.val(address).addClass('disabled').attr('disabled', 'true').data('location', true);
  $('#indexform .icon-loading').attr('class', 'icon-map-marker');
}

$(function() {
  // Initiate the router
  var app_router = new AppRouter();
  // Start Backbone history a neccesary step for bookmarkable URL's
  Backbone.history.start({pushState: true});

  $('#clearcookie').on('click', function() {
    $.cookie('route', null);
    location.reload(true);
    return false;
  });
});
