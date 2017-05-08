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


google.maps.event.addListener(infowindow, 'domready', function() {

   // Reference to the DIV which receives the contents of the infowindow using jQuery
   var iwOuter = $('.gm-style-iw');

   /* The DIV we want to change is above the .gm-style-iw DIV.
    * So, we use jQuery and create a iwBackground variable,
    * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
    */
   var iwBackground = iwOuter.prev();

   // Remove the background shadow DIV
   iwBackground.children(':nth-child(2)').css({'display' : 'none'});

   // Remove the white background DIV
   iwBackground.children(':nth-child(4)').css({'display' : 'none'});

   // Moves the infowindow 115px to the right.
iwOuter.parent().parent().css({left: '15px'});

// Moves the shadow of the arrow 76px to the left margin 
iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 176px !important;'});

// Moves the arrow 76px to the left margin 
iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 176px !important;'});

var iwCloseBtn = iwOuter.next();

// Apply the desired effect to the close button
iwCloseBtn.css({
  opacity: '1', // by default the close button has an opacity of 0.7
  right: '38px', top: '3px', // button repositioning
  border: '7px solid #48b5e9', // increasing button border and new color
  'border-radius': '13px', // circular effect
  'box-shadow': '0 0 5px #3990B9' // 3D effect to highlight the button
  });

// The API automatically applies 0.7 opacity to the button after the mouseout event.
// This function reverses this event to the desired value.
iwCloseBtn.mouseout(function(){
  $(this).css({opacity: '1'});
});

});

        function createMarkers(result) {
            for (var i = 0; i < 2 ; i++) {
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
        $('#secondSection').hide();

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

            $('input').on('change', function (event) {
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