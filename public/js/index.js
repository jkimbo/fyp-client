
$(function() {
  /*
   * Check if user has defined a favourite route
   */
  if($.cookie('route')) {
    // initialise map to that route
    $('#container').append(T['map'].r());
    Tracker.initMap();
  } else {
    // ask for route
    $('#container').append(T['route'].r());
    $('#routeform').submit(function() {
      console.log($('#routeform #routeval').val());
      var route = $('#routeform #routeval').val();
      $.cookie('route', route, { expires: 100 });
      $('#container').empty();
      $('#container').append(T['map'].r());
      Tracker.initMap();
      return false;
    });
  }
});
