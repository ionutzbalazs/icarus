var forecast = new ForecastService('II81jq-woKlvAbIi-LyjbTRRay67syxn');
var current = [];

Date.prototype.hhmm = function() {
    var m = this.getMinutes();
    var h = this.getHours();
    return (h<9?0:'')+h+':'+(m<9?0:'')+m;
};


var options = {
    chart: {
        type: 'areaspline'
    },
    title: {
        text: 'Power managment for day '
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 150,
        y: 100,
        floating: true,
        borderWidth: 1,
        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#ccc'
    },
    yAxis: {
        title: {
            text: 'Power W/m^2'
        }
    },
    tooltip: {
        shared: true,
        valueSuffix: ' W/m^2'
    },
    credits: {
        enabled: true
    },
    plotOptions: {
        areaspline: {
            fillOpacity: 0.5
        },
        showInNavigator: true
    },
    series: [{
        name : "Generated"
    },
        {
            name: 'Consumers'
        }]

};

var chart1 = new Highcharts.Chart('container',options);

var consumerData = [23,45,65,33,0,0,0,34,0,23,12];

$(document).ready(function() {
    forecast.get(40.705, -74.258, getChartData);
    function getChartData(data){

        var powerArray = [];
        var day = '';
        var currentDay = '';
        var periodsArray = [];

        initData(data[0]);
        function switchDay(d){
            powerArray = [];
            periodsArray = [];
            current = data[d];
            initData(current);
        }
        $('.dayBtn').on('click', function(e) {
            console.log($(this).val());
            switchDay($(this).val());
        });

        function initData(d){
            console.log(d);
            for(var i = 0; i< d.forecasts.length; i++){
                if(d.forecasts[i].pv_estimate!=0){
                    if(new Date(d.forecasts[i].endPeriod).getHours()>5 && new Date(d.forecasts[i].endPeriod).getHours()<21){
                        powerArray.push(parseFloat((d.forecasts[i].pv_estimate).toFixed( 2 )));
                        periodsArray.push((new Date(d.forecasts[i].endPeriod)).hhmm());
                    }
                }
            }
            chart1.series[0].setData(powerArray);
            chart1.xAxis[0].setCategories(periodsArray)
            chart1.series[1].setData(consumerData);


        }
    }

});
