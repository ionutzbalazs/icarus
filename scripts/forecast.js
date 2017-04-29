$(document).ready(function() {

    Date.prototype.hhmm = function() {
        var m = this.getMinutes();
        var h = this.getHours();
        return (h<9?0:'')+h+':'+(m<9?0:'')+m;
    };

    function getChartData(){
        var powerArray = [];
        var daysArray = [];
        var forecasts = null;
        var day = '';
        var currentDay = '';



        $.getJSON("/fakedata/fakechart.json", function(json) {
            forecasts = json.forecasts;
            day = new Date(forecasts[0].period_end);
            currentDay = (day.getMonth() + 1) + '/' + day.getDate() + '/' +  day.getFullYear();
            for(var i = 0; i< forecasts.length; i++){
                powerArray.push(parseFloat((forecasts[i].pv_estimate).toFixed( 2 )));
                daysArray.push((new Date(forecasts[i].period_end)).hhmm());
            }

            Highcharts.chart('container', {
                chart: {
                    type: 'areaspline'
                },
                title: {
                    text: 'Power managment for day ' +currentDay
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
                xAxis: {
                    categories: daysArray
                },
                yAxis: {
                    title: {
                        text: 'Power (kW/h)'
                    }
                },
                tooltip: {
                    shared: true,
                    valueSuffix: ' W'
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
                    name: "generated",
                    data: powerArray
                }]
            });


        });
    }
    getChartData();

});
