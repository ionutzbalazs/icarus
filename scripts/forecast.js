var forecast = new ForecastService('II81jq-woKlvAbIi-LyjbTRRay67syxn');
var current = [];

Date.prototype.hhmm = function() {
    var m = this.getMinutes();
    var h = this.getHours();
    return (h<9?0:'')+h+':'+(m<9?0:'')+m;
};


var options = {
    chart: {
        type: 'areaspline',
        events: {
            load: function () {
            }
        }
    },
    title: {
        text: 'Power management  '
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
            text: 'Power W'
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
        name : "Generated",
        color: '#fdfe02'
    }, {
        name: "Consumed",
        color: "#607d8b"
    }]
};

$(".divs div").each(function(e) {
    if (e != 0)
        $(this).hide();
});

$("#next").click(function(){
    if ($(".divs div:visible").next().length != 0)
        $(".divs div:visible").next().show().prev().hide();
    else {
        $(".divs div:visible").hide();
        $(".divs div:first").show();
    }
    return false;
});

$("#prev").click(function(){
    if ($(".divs div:visible").prev().length != 0)
        $(".divs div:visible").prev().show().next().hide();
    else {
        $(".divs div:visible").hide();
        $(".divs div:last").show();
    }
    return false;
});

var powerArray = [];
var periodsArray = [];

var chart1 = new Highcharts.Chart('container',options);
var consumers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


$(document).ready(function() {



    forecast.get(40.705, -74.258, getChartData);
    function getChartData(data){
        $("#next").click(function(){

           switchDay(2);
        });


        initData(data[1]);
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

                if(d.forecasts[i].endPeriod.getHours()>5 && d.forecasts[i].endPeriod.getHours()<=19 ){
                        powerArray.push(parseFloat((d.forecasts[i].pv_estimate).toFixed( 2 ))*32);
                        periodsArray.push((new Date(d.forecasts[i].endPeriod)).hhmm());
                }
                console.log(d.forecasts[i].endPeriod);
            }
            chart1.series[0].setData(powerArray);
            chart1.xAxis[0].setCategories(periodsArray);
            chart1.series[1].setData(consumers);
        }
    }


    $(".draggable" ).draggable({
        cursor: "move",
        revert: "invalid",
        helper: "clone",
        refreshPositions: true
    });

    $(".droppable").droppable({
        accept: '.draggable',
        hoverClass: "ui-state-active",
        drop: function (ev, ui) {
            var addedWatts = parseInt($(ui.draggable).attr("watts"));
            var position = parseInt($(this).attr("position"));
            consumers[position*2] += addedWatts;
            consumers[position*2+1] += addedWatts;
            console.log(consumers);
            chart1.series[0].setData(powerArray);
            chart1.xAxis[0].setCategories(periodsArray);
            chart1.series[1].update(consumers);
            if ($(ui.draggable).hasClass('new')) {
                $('.new').draggable({
                    revert: true
                });
            } else {
                $(this).append($(ui.draggable).clone().draggable({
                    helper: "original"
                }).addClass('new'));
            }
        }
        // out: function (event, ui) {
        //         var addedWatts = parseInt($(ui.draggable).attr("watts"));
        //         var position = parseInt($(this).attr("position"));
        //         consumers[position*2+1] -= addedWatts;
        //         consumers[position*2+1] -= addedWatts;
        //         console.log(consumers);
        //         chart1.series[0].setData(powerArray);
        //         chart1.xAxis[0].setCategories(periodsArray);
        //         chart1.series[1].update(consumers);
        //         $(ui.draggable).fadeOut(1000, function () {
        //             $(this).remove();
        //         });
        //
        // }
    });



});
