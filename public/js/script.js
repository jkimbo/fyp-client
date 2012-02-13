$(function() {
    $('#map_canvas').width($(window).width());
    $('#map_canvas').height($(window).height());
    var options = {
        center: new google.maps.LatLng(51.50812890, -0.1280050),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(
            document.getElementById("map_canvas"),
            options
    );

    var position;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var current = new google.maps.LatLng(
                position.coords.latitude, 
                position.coords.longitude);
            map.setCenter(current);
            var position = new google.maps.Marker({
                position: current,
                map: map,
                animation: google.maps.Animation.DROP,
                title:"There you are!"
            });
            google.maps.event.addListener(position, 'click', toggleBounce);
            function toggleBounce() {
                if (position.getAnimation() != null) {
                    position.setAnimation(null);
                } else {
                    position.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function() {
                        position.setAnimation(null);
                    }, 1000);
                }
            }
        }, function(msg) {
            alert('error: '+msg);
        });
    } else {
          alert('geolocation not supported');
    }

    $(window).resize(function() {
        $('#map_canvas').width($(window).width());
        $('#map_canvas').height($(window).height());
    });
});

