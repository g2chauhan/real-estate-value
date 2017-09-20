// Put your zillow.com API key here
var zwsid = "X1-ZWz1b3nq4jxwcr_98wrk";
var completeAddress;
var geocoder;
var value;
var xml;
var infowindow = new google.maps.InfoWindow;
var zestValue;
var latlang;
var request = new XMLHttpRequest();

function initialize() {
	//initializing the map with zoom level 16 and centred as required in the project definition 
    geocoder = new google.maps.Geocoder();
    latlng = new google.maps.LatLng(32.75, -97.13);
    var mapOption = {
        zoom: 16,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("mapOutput"), mapOption);

    google.maps.event.addListener(map, 'click', function(event) { //click function for map
        reverseGeo(event.latLng); //send lat and long to reverse geocoding function

    });

}


function codeAddress(zestValue) {
    var address = completeAddress;
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.BOUNCE,
                position: results[0].geometry.location
            });
            infowindow.open(map, marker);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


function reverseGeo(location) {

    var lat = location.lat();
    var lng = location.lng();
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({
        'latLng': latlng
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                var marker = new google.maps.Marker({
                    position: location,
                    map: map,
                });

                infowindow.open(map, marker);
                var buffer = results[0].formatted_address;
                var bufferSplit = buffer.split(',');
                var address = bufferSplit[0];
                var city = bufferSplit[1];
                var statezip = bufferSplit[2];
                sendRequest2(address, city, statezip); //send address details to the zillow from sendRequest2 function

            } else {
                alert('No results found');
            }

        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
}



function xml_to_string(xml_node) {
    if (xml_node.xml)
        return xml_node.xml;
    var xml_serializer = new XMLSerializer();
    return xml_serializer.serializeToString(xml_node);
}

function displayResult1() {
    if (request.readyState == 4) {
        var xml = request.responseXML.documentElement;
        var value = xml.getElementsByTagName("result")[0].getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0];

        zestValue = xml_to_string(value);
        document.getElementById("textOutput").innerHTML += "Zestimate for '" + completeAddress + "': <strong>$" + zestValue + "</strong>" + "<br/><br/>";
        codeAddress(infowindow.setContent("Zestimate for " + completeAddress + ": " + zestValue));
    }
}


function displayResult2() {
    if (request.readyState == 4) {
        var xml = request.responseXML.documentElement;
        var value = xml.getElementsByTagName("result")[0].getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0]
        zestValue = xml_to_string(value);
        document.getElementById("textOutput").innerHTML += "Zestimate for '" + completeAddress + "': <strong>$" + zestValue + "</strong>" + "<br/><br/>";
        reverseGeo(infowindow.setContent("Zestimate for " + completeAddress + ": " + zestValue));
    }
}


function sendRequest2(address, city, statezip) {

    request.onreadystatechange = displayResult2;
    completeAddress = address + ", " + city + ", " + statezip;
    request.open("GET", encodeURI("proxy.php?zws-id=" + zwsid + "&address=" + address + "&citystatezip=" + city + "+" + statezip));
    request.withCredentials = "true";
    request.send(null);
}


function sendRequest1() {

    request.onreadystatechange = displayResult1;
    var address = document.getElementById("address").value;
    var city = document.getElementById("city").value;
    var statezip = document.getElementById("statezip").value;
    completeAddress = address + ", " + city + ", " + statezip;
    request.open("GET", encodeURI("proxy.php?zws-id=" + zwsid + "&address=" + address + "&citystatezip=" + city + "+" + statezip));
    request.withCredentials = "true";
    request.send(null);
}