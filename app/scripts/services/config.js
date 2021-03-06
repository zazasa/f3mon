'use strict';

/**
 * @ngdoc service
 * @name f3monApp.config
 * @description
 * # config
 * Constant in the f3monApp.
 */


//NOTE: default page config in api/config.php
(function() {
    angular.module('f3monApp')



    .config(function($provide, paginationTemplateProvider) {
        //Template required by the dirpagination plugin
        paginationTemplateProvider.setPath('views/dirPagination.tpl.html');


//        $provide.constant('config', {
//            'defaultSubSystem': "cdaq",
//            'fastPollingDelay': 3000,
//            'slowPollingDelay': 5000,
//            'chartWaitingMsg': 'No monitoring information.',
//            'msChartMaxPoints': 60,
//            'defaultTimezone': 'Locale',
//        })

    })


    //TimeZone settings
    .constant('angularMomentConfig', {
        format: 'MMM D YYYY, HH:mm',
        preprocess: 'utc',
        //timezone: 'Europe/London' // e.g. 'Europe/London'
    })

    .service('colors', function() {
        var list = Highcharts.getOptions('colors').colors;
        //var list =  ['#FFB300','#803E75','#FF6800','#A6BDD7','#C10020','#CEA262','#817066','#007D34','#F6768E','#00538A','#FF7A5C','#53377A','#FF8E00','#B32851','#F4C800','#7F180D','#93AA00','#593315','#F13A13','#232C16',];
        var index = 0;

        this.get = function() {
            var i = index;
            if (index == (list.length - 1)) {
                index = 0
            } else {
                index += 1
            }
            return list[i];
        }

        this.reset = function() {
            index = 0;
        }
    })


    .constant('streamRatesChartConfig', {
        chart: {
            renderTo: 'srchart',
            zoomType: 'x',
            animation: {
                duration: 500,
                easing: 'linear'
            },
            events: {},
        },
        exporting: {
            enabled: false
        },
        legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
            //maxHeight: 50,

        },
        plotOptions: {
            series: {
                animation: {
                    duration: 500,
                    easing: 'linear'
                },
            },
            spline: {
                lineWidth: 3,
                marker: {
                    enabled: true,
                }
            },

            column: {
                groupPadding: 0.01,
                pointPadding: 0,
                borderWidth: 0.01,
                events: {
                    legendItemClick: function(event) {

                        var selectedName = this.name;
                        var hideAllOthers = event.browserEvent.ctrlKey;

                        if (hideAllOthers) {
                            var series = this.chart.series;
                            series.forEach(function(serie) {
                                if (['navigator', 'Navigator', 'minimerge', 'macromerge'].indexOf(serie.name) > -1) {
                                    return
                                } else if (serie.name == selectedName || serie.name == selectedName + "_complete") {
                                    serie.setVisible(true, false)

                                } else {
                                    serie.setVisible(!serie.visible, false)
                                }
                            })
                            this.chart.redraw();
                            return false;
                        } else {
                            var cSerie = this.chart.get(selectedName + "_complete");
                            cSerie.setVisible(!this.visible, false);
                        }



                    }

                }
            }
        },
        tooltip: {
            formatter: function(tooltip) {

                var percents={};

                var items = this.points || splat(this),
                    series = items[0].series,
                    s;

                // build the header
                s = ['<b> Ls: ' + items[0].key + '</b><br/>'];


                //get percents
                var totals = $.grep(items,function(item,index){
                    return item.series.name.indexOf('_complete')>0
                })

                totals.forEach(function(item){
                    var name = item.series.name;
                    var strIdx = name.indexOf('_complete');
                    percents[name.substr(0,strIdx)] = item.point.y;                  
                })

                //console.log(percents);

                // build the values
                items.forEach(function(item) {
                    var name = item.series.name;
                    if(name.indexOf('_complete')>0){return;}

                    series = item.series;
                    var formatString = (series.tooltipFormatter && series.tooltipFormatter(item)) ||
                        item.point.tooltipFormatter(series.tooltipOptions.pointFormat);

                    //add percentage
                    if ( $.inArray(name,['minimerge','macromerge']) == -1  ){
                        formatString = formatString.replace('<br/>','<i>  (' + percents[name] + '%)</i><br/>');    
                    }
                    
                    s.push(formatString);
                    
                });

                // footer
                s.push(tooltip.options.footerFormat || '');

                return s.join('');
            },
            enabled: true,
            followPointer: false,
            //crosshairs: [true, true], //not visible with the grid
            //shared: true,
            //position on the left or right side of the point only with shared:false
            positioner: function(labelWidth, labelHeight, point) {
                var tooltipX, tooltipY;
                if (point.plotX + labelWidth > this.chart.plotWidth) {
                    tooltipX = point.plotX + this.chart.plotLeft - labelWidth - 20;
                } else {
                    tooltipX = point.plotX + this.chart.plotLeft + 20;
                }
                //tooltipY = point.plotY + this.chart.plotTop - 20;
                tooltipY = this.chart.plotTop;
                return {
                    x: tooltipX,
                    y: tooltipY
                };
            }
        },
        navigator: {
            enabled: true,
            adaptToUpdatedData: false,
            series: {
                type: 'area',
                animation: {
                    duration: 500,
                },
                fillOpacity: 0.3,
            },
            height: 25,
            margin: 0,
            yAxis: {
                tickPixelInterval: 5,
                title: {
                    text: 'Totals'
                },
                labels: {
                    enabled: true,
                    formatter: function() {
                        //return numeral(this.value).format('0a')
                    }
                },
            },
            xAxis: {
                tickPixelInterval: 50,
                title: {
                    text: ''
                },
                labels: {
                    formatter: function() {
                        //console.log(this.value)
                        return this.value;
                    },
                    style: {
                        color: "black",
                        //fontWeight: "bold"
                    },
                },
                events: {
                    afterSetExtremes: function(event) {
                        console.log('navAfter')
                    },
                    setExtremes: function(event) {
                        console.log('navSet')
                    },

                }
            }
        },
        rangeSelector: {
            enabled: false,
        },
        navigation: {
            enabled: false,
        },
        scrollbar: {
            enabled: true,
            liveRedraw: false,
        },
        title: {
            text: ''
        },
        xAxis: [{
            //            labels: {
            //                formatter: function() {
            //                    return this.value;
            //                },
            //            },
            minPadding: 0,
            maxPadding: 0,
            //             startOnTick: true,
            gridLineWidth: 1,
            id: "ls",
            allowDecimals: false,
            title: {
                text: 'Ls'
            },
            //            categories: [],
            //            type: "category",
            //            tickmarkPlacement: 'on',
            minRange: 20,
            //tickInterval: 1,
            events: {}
        }],
        yAxis: [{
            title: {
                text: 'Events'
            },
            showLastLabel: true,
            minPadding: 0,
            maxPadding: 0,
            id: "rates",
            height: "74%",
            lineWidth: 1,
            offset: 0,
            opposite: false,
        }, {

            title: {
                text: 'Completeness %',
                align: 'middle',
                //margin: 30,
            },
            showLastLabel: true,
            minPadding: 0,
            maxPadding: 0,
            max: 100,
            min: 0,
            height: "74%",
            id: "percent",
            lineWidth: 1,
            offset: 0,
            opposite: true,
            labels: {
                //align: 'right',
            }
        }, {
            title: {
                text: 'miniMerge %',
            },
            showLastLabel: true,
            max: 100,
            min: 0,
            id: "minipercent",
            height: "10%",
            top: "78%",
            lineWidth: 1,
            offset: 0,
            opposite: false,
        }, {
            title: {
                text: 'macroMerge %',
                align: 'middle',
                margin: 30,
            },
            showLastLabel: true,
            minPadding: 0,
            maxPadding: 0,
            max: 100,
            min: 0,
            height: "10%",
            id: "macropercent",
            top: "90%",
            lineWidth: 1,
            offset: 0,
            opposite: true,
            labels: {
                align: 'center',

            }
        }],
    })

    .constant('drillDownChartConfig', {

        chart: {
            renderTo: 'ddchart',
            animation: {
                duration: 500,
                easing: 'linear'
            },
            marginRight: 50,
            events: {
                drilldown: function(event) {
                    //console.log('old dd2')
                },
                drillup: function(event) {
                    //console.log('old du2')
                }
            } //placeholder for drilldown function
        },
        plotOptions: {
            series: {
                minPointLength: 3
            }
        },
        tooltip: {
            //enabled: false,
            followPointer: true
        },
        legend: {
            enabled: false
        },


        title: {
            text: ''
        },
        xAxis: [{
            lineWidth: 0,
            gridLineWidth: 1,
            allowDecimals: false,
            title: {
                text: ''
            },
            tickmarkPlacement: 'on',
            type: "category"
        }],
        yAxis: [{
            title: {
                text: 'Completeness %'
            },
            max: 100,
            min: 0,
            //opposite : true,
            id: "percent",
            lineWidth: 1,
            offset: 0
        }],
        series: [{
            type: 'column',
            id: "drilldown",
            name: "drilldown",
            yAxis: "percent",
            minPointLength: 10,
        }],
        drilldown: {
            series: []
        }
    })

    .constant('microStatesChartConfig', {
        chart: {
            renderTo: 'mschart',
            animation: true, //animation for stacked area is not supported
            ignoreHiddenSeries: true,
            //height: 400,
            zoomType: 'xy',
        },

        plotOptions: {
            column: {
                pointRange: 5500,
                gapsize: 0,
                stacking: 'percent',
                groupPadding: 0,
                pointPadding: 0,
                borderWidth: 0,
                connectNulls: false,
                lineWidth: 0,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false,
                        }
                    }
                }
            },
            area: {
                gapsize: 1,
                stacking: 'percent',
                connectNulls: false,
                lineWidth: 0,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false,
                        }
                    }
                }
            },
        },
        //colors: Colors.colorList(),
        legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: 'top',
            //floating: true,
            borderRadius: 5,
            borderWidth: 1,
            itemDistance: 5,
            symbolRadius: 5,

               labelFormatter: function(){
                
                    var s = this.name;
                    var r = "";
                    var lastAppended = 0;
                    var lastSpace = -1;
                    for (var i = 0; i < s.length; i++) {
                        if (s.charAt(i) == ' ') lastSpace = i;
                        if (i - lastAppended > 50) {
                            if (lastSpace == -1) lastSpace = i;
                            r += s.substring(lastAppended, lastSpace);
                            lastAppended = lastSpace;
                            lastSpace = -1;
                            r += "<br>";
                        }
                    }
                    r += s.substring(lastAppended, s.length);
                    return r;
               }

        },
        xAxis: {
            ordinal: false,
            //categories:[],
            minPadding: 0,
            maxPadding: 0,
            //category: true,
            type: 'datetime',
            tickmarkPlacement: 'on',
            //title: {
            //    enabled: false
            //}
        },

        //handled by angular
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        yAxis: {
            title: {
                text: 'Percent'
            }
        },
        series: [],
    })


})();
