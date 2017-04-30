ArchiveService = function(apiKey){
    var _url = "https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=" + apiKey;
    
    this.get = function (lat, long, callback) {
        var requestUrl = _url + "&lat=" + lat + "&lon=" + long;
        $.get(requestUrl,
              function(data) {
                  var marker = computeMarker(data);
                  callback(marker);
              });
    }

    this.get2 = function (lat, long,title, callback) {
        var requestUrl = _url + "&lat=" + lat + "&lon=" + long;
        $.get(requestUrl,
              function(data) {
                  var marker = computeMarker(data);
                  callback(marker, title);
              });
    }

    function computeMarker(satelliteData) {
        return {
            lat: satelliteData.inputs.lat,
            long: satelliteData.inputs.lon,
            dni: {
                annual: computeEnergy(satelliteData.outputs.avg_dni.annual),
            },
            ghi: {
                annual: computeEnergy(satelliteData.outputs.avg_ghi.annual),
            },
            lat_tilt: {
                annual: computeEnergy(satelliteData.outputs.avg_lat_tilt.annual),
            }
        }
    }

    function computeEnergy(irradience) {
        return irradience * 0.17 * 0.75;
    }
}