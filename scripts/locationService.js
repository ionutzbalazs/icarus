LocationService = function(){
    this.get = function (callback) {
        var requestUrl = './scripts/locations.js';
        $.ajax({
            type: 'GET',
            url: requestUrl,
            success: function(data) {           
                  callback(data)
              }
        });
    }
   }