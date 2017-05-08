function MapView(){
    this.getContent = function(title, generatedPower, profit) {
            var content = '<div id="iw-container">' +
                '<div class="iw-title">' + title + ' - 12 cents/kwh</h4>' + 
                '</div>' +
                '<div class="iw-content">' +
                '<div class="iw-subTitle">Choose a type of pannel</div>' +
                '<div class="card"><img id="fixed-collector" src="./public/images/fixed-collector-active.svg"/></div>' +
                '<div class="card"><img id="east-west-collector" src="./public/images/east-west-collector.svg"/></div>' +
                '<div class="card"><img id="2-axis-collector" src="./public/images/2-axis-collector.svg"/></div>' +
                '<div class="iw-subTitle" style="	display: inline-flex;">Select total surface of pannels:  <small id="rangevalue">32</small> Sq m</div>' +
                '<input type="range" min="1" max="64" value=32" step="1" onchange="rangevalue.value=value" />' +
                '</div>' +
                '<div id="details"><button class="btn btn-info" id="detailBtn">Get More Details</button></div>' +
                '<div>'+
                '<div class="iw-title footer">Generated power -  <h4 id="generatedPower">' + generatedPower + '</h4><h4>kwh</h4>' +                 
                '</div>' +
                '<div class="iw-title pricetag" style="    width: 80px;"><h4>$</h4><h4 id="price">' + profit + '</h4>' +
                '</div>' +
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