function MapController() {
    var archive = new ArchiveService('68DoUmZ4rMTTjBuzmx6sGqnLLxVVyTIQ7BGQeOBI');
    var forecast = new ForecastService('II81jq-woKlvAbIi-LyjbTRRay67syxn');

    var mapView = new MapView();
    var map;
    var generatedPower;
    var price = 12;

    this.initMap = function () {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 5,
            center: new google.maps.LatLng(40, -97),
            mapTypeId: 'terrain'
        });
        var legend = document.getElementById('legend');
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
        var infowindow = new google.maps.InfoWindow({});
        map.addListener('click', function () {
            createMarkers(locationPoints);
        });

        function createMarkers(result) {
            for (var i = 0; i < 2; i++) {
                if (result[i].population > 10000) {
                    archive.get2(result[i].latitude, result[i].longitude, result[i].city, callback)
                }
            }
        }

        function callback(result, title) {
            generatedPower = result.dni.annual;
            var latLng = new google.maps.LatLng(result.lat, result.long);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: title,
                label: result.dni.annual.toFixed(2).toString(),
                panelType: 0,
                icon: mapView.getCircle(result.dni.annual),
                animation: google.maps.Animation.DROP,
            });
            marker.addListener("click", function (event) {
                infowindow.setContent(mapView.getContent(this.title, result.ghi.annual.toFixed(2), result.ghi.annual.toFixed(2) * price))
                infowindow.open(map, this);
                generatedPower = result.ghi.annual.toFixed(2);
                setPannel(result);
                changeEnergyValue();
                detailsButtonEvent(result.lat, result.long, this.title);
            });
        }
        // $('#secondSection').hide();

        function detailsButtonEvent(lat, long, city) {
            $(".btn-info").on("click", function () {
                // var generatedPower = $("#generatedPower").text();
                forecast.get(lat, long, city, getChartData);
                $("#map, #legend").hide();
                $('#secondSection').show();
            })
        }
        function setPannel(result) {
            $("img").on("click", function (event) {
                setInactive();
                changeGeneratedPower(this.id, result);
                changeEnergyValue();
                var path = $(this).attr('src');
                $(this).attr('src', path.substring(0, path.length - 4) + "-active.svg");
            });

            $('input').on('mouseup', function (event) {
                changeEnergyValue();
            })
        }

        function setInactive() {
            var path = "./public/images/";
            $("#fixed-collector").attr('src', path + "fixed-collector.svg");

            $("#east-west-collector").attr('src', path + "east-west-collector.svg");

            $("#2-axis-collector").attr('src', path + "2-axis-collector.svg");
        }

        function changeEnergyValue() {
            var sqareMeters = $('#rangevalue').val();
            $("#generatedPower").text((sqareMeters * generatedPower).toFixed(2));
            var gPower = $("#generatedPower").text()
            $("#price").text((gPower * 0.12).toFixed(2));
        }

        function changeGeneratedPower(image, result) {
            if (image == 'fixed-collector') {
                generatedPower = result.ghi.annual.toFixed(2);
                $("#price").text(result.ghi.annual.toFixed(2) * 0.12);
            }
            else if (image == 'east-west-collector') {
                generatedPower = result.lat_tilt.annual.toFixed(2);
                $("#price").text(result.lat_tilt.annual.toFixed(2) * 0.12);
            }
            else {
                generatedPower = result.dni.annual.toFixed(2);
                $("#price").text(result.dni.annual.toFixed(2) * 0.12);
            }

        }
    }
}