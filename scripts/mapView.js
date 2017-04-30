function MapView(){
    this.getContent = function(title, generatedPower, profit) {
            var content = '<div id="iw-container">' +
                '<div class="iw-title">' + title + ' -  <h4 id="generatedPower">' + generatedPower + '</h4><h4>kwh = </h4>' + 
                '<h4 id="price">' + profit + '</h4><h4>$</h4>'+
                '</div>' +
                '<div class="iw-content">' +
                '<div class="iw-subTitle">Chosse a type of pannel</div>' +
                '<div id="imgs"><img id="fixed-collector" src="./public/images/fixed-collector-active.svg"/>' +
                '<img id="east-west-collector" src="./public/images/east-west-collector.svg"/>' +
                '<img id="2-axis-collector" src="./public/images/2-axis-collector.svg"/></div>' +
                '<div class="iw-subTitle">Select total surface of pannels:  <output id="rangevalue">32</output> Sq m</div>' +
                '<input type="range" min="1" max="64" value=32" step="1" onchange="rangevalue.value=value" />' +
                '<div class="iw-subTitle">Average price: 12 cents/kwh</div>' +
                '</div>' +
                '<div id="details"><button class="btn btn-info" id="detailBtn">Get More Details</button></div>' +
                '</div>';
            return content;
        }

         this.getCircle = function(kw) {
            return {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: generateColor(kw),
                fillOpacity: .5,
                scale: 30,
                strokeColor: 'white',
                strokeWeight: .5
            };
        }

        function generateColor(radiationValue) {
            var min = $("#min").text();
            var max = $("#max").text();
            var percent = 255 - Math.floor(parseInt((radiationValue - min) * 100) / (max - min) * 2.55);
            var g = percent.toString(16) < 16 ? "00" : percent.toString(16);
            var r = "ff"
            var b = "00";
            return "#" + r + g + b;
        }
}