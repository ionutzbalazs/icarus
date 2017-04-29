ForecastService = function (apiKey) {
    var _url = String.format("https://api.solcast.com.au/pv_power/forecasts?capacity=1000&api_key={0}&format=json", apiKey);
    
    this.get = function (lat, long) {
        var requestUrl = _url + String.format("&longitude={0}&latitude={1}", long, lat);
        $.get(requestUrl,
              function(data) {
                  // do stuff
              });
    }
}