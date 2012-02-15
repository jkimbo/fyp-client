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

    var currentloc;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, function(msg) {
            alert('error: '+msg);
        });
        navigator.geolocation.watchPosition(setPosition);
    } else {
          alert('geolocation not supported');
    }

    $(window).resize(function() {
        $('#map_canvas').width($(window).width());
        $('#map_canvas').height($(window).height());
    });

    function setPosition(position) {
        /*
         * Set current marker
         */
        var current = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude);
        map.setCenter(current);
        map.setZoom(16);
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
