$(function() {
    $('#map_canvas').width($(window).width());
    $('#map_canvas').height($(window).height());
    var options = {
      center: new google.maps.LatLng(-34.397, 150.644),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(
            document.getElementById("map_canvas"),
            options
    );
});
