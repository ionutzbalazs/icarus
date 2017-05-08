var forecast = new ForecastService('II81jq-woKlvAbIi-LyjbTRRay67syxn');
var current = [];


/**
 * Format date in hh:mm format.
 * @returns {string}
 */
Date.prototype.hhmm = function() {
    var m = this.getMinutes();
    var h = this.getHours();
    return (h<9?0:'')+h+':'+(m<9?0:'')+m;
};

/**
 * Options for highchart
 */
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
var squaremeters = 32;

var powerArray = [];
var periodsArray = [];
var chart1 = new Highcharts.Chart('chart1',options);
// Consumers default value
var consumers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var currentCity = '';


function getChartData(data){

    var dayToShow = 1;
    currentCity = data[0].city;
    switchDay(dayToShow);
    var weekdays = [];
    var defaultclass= "";
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for(var k = 1; k<data.length; k++){
        var dayName = "";
        if(k==1){
            dayName = "Today";
            defaultclass = 'is-active';
        }else{
            var da = new Date(data[k].date);
            dayName = days[da.getDay()];
            defaultclass = '';
        }
        $("#weekdaysbtn").append($('<p class="date-btn '+defaultclass+'" id="'+k+'" >'+dayName+'</p>').fadeIn('slow'));

        weekdays.push({
            name: dayName,
            order: k
        });
    }

    $(".date-btn").on('click',function () {

        var a = $('.date-btn');
        for (var w = 0; w < a.length; w++) {
            a[w].classList.remove('is-active')
        }
        this.classList.add('is-active');
        switchDay(this.id);
    });


    //Append city name in navbar
    $("#navcity").text(currentCity);

    $('#chartrange').on('change',function () {
        squaremeters = this.value;
        switchDay(dayToShow);
        $('#sqaremeters').text(squaremeters);
    });
    $('#sqaremeters').text(squaremeters);

    /**
     * @param d which is the day number from array
     * 0 < d < 6
     */
    function switchDay(d){
        powerArray = [];
        periodsArray = [];
        current = data[d];
        initData(current);
    }


    /**
     * Generate arrays with power and time periods
     * @param d
     */
    function initData(d){
        for(var i = 0; i< d.forecasts.length; i++){
            if(d.forecasts[i].endPeriod.getHours()>5 && d.forecasts[i].endPeriod.getHours()<=19 ){
                powerArray.push(parseFloat((d.forecasts[i].pv_estimate).toFixed( 2 ))*32);
                periodsArray.push((new Date(d.forecasts[i].endPeriod)).hhmm());
            }
        }
        chart1.series[0].setData(powerArray);
        chart1.xAxis[0].setCategories(periodsArray);
        chart1.series[1].setData(consumers);
        setInterval(function() {
            $("#chart1").highcharts().reflow();
        }, 1);
    }
}
$(document).ready(function() {

    $('#backtomap').on('click',function () {

        $("#map, #legend").show();
        $('#secondSection').hide();

    });


    // Draggable configuration
    $(".draggable" ).draggable({
        containment: 'document',
        helper: 'clone',
        cursor: 'move',
        refreshPositions: true,
        zIndex:10000,
        appendTo: "body"
    });

    $(".droppable").droppable({
        accept: '.draggable',
        hoverClass: "ui-state-active",
        tolerance: 'pointer',
        drop: function (ev, ui) {
            var addedWatts = parseInt($(ui.draggable).attr("watts"));
            var position = parseInt($(this).attr("position"));
            consumers[position*2] += addedWatts;
            consumers[position*2+1] += addedWatts;
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
