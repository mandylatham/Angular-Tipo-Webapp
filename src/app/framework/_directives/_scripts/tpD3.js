(function() {

    'use strict';

    var module = angular.module('tipo.framework');


    return module.directive('tpD3', function(tipoInstanceDataService) {
        return {
            scope: {
                chart_type: "=",
                height: "=",
                margin: "=",
                x_label: "=",
                y_label: "=",
                agrregation: "=",
                data: "=",
            },
            restrict: 'EA',
            template: '<div config="config" data="data"></div>',
            link: function(scope, element, attrs, ctrl) {
                scope.options = {};
                scope.options.chart = { type: scope.chart_type };
                // element[0].offsetHeight = 500px;
                // if (scope.agrregation === "count") {
                //   tipoInstanceDataService.aggegrationData(scope.data).then(function(results){
                //     console.log(results);
                //   });
                // }
                // specify chart configuration item and data
                var ndWrapper = element.find('div')[0],
                    ndParent = element.parent()[0],
                    parentWidth = ndParent.clientWidth,
                    parentHeight = ndParent.clientHeight,
                    width, height, chart;
                var chartEvent = {};

                function getSizes(config) {
                    width = config.width || parseInt(attrs.width) || parentWidth || 320;
                    height = config.height || parseInt(attrs.height) || parentHeight || 240;
                    ndWrapper.style.width = width + 'px';
                    ndWrapper.style.height = height + 'px';
                }
                getSizes({});
                var option = {
                   color: ['#003366', '#006699', '#4cabce', '#e5323e'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['Forest', 'Steppe', 'Desert', 'Wetland']
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
            axisTick: {show: false},
            data: ['2012', '2013', '2014', '2015', '2016']
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: 'Forest',
            type: 'bar',
            barGap: 0,
            data: [320, 332, 301, 334, 390]
        },
        {
            name: 'Steppe',
            type: 'bar',
            data: [220, 182, 191, 234, 290]
        },
        {
            name: 'Desert',
            type: 'bar',
            data: [150, 232, 201, 154, 190]
        },
        {
            name: 'Wetland',
            type: 'bar',
            data: [98, 77, 101, 99, 40]
        }
    ]
                };

                // use configuration item and data specified to show chart
                var myChart = echarts.init(ndWrapper);
                myChart.setOption(option);
                var pageload = {
                    name: 'page.load',
                    datapoints: [
                        { x: 2001, y: 1012 },
                        { x: 2002, y: 1023 },
                        { x: 2003, y: 1045 },
                        { x: 2004, y: 1062 },
                        { x: 2005, y: 1032 },
                        { x: 2006, y: 1040 },
                        { x: 2007, y: 1023 },
                        { x: 2008, y: 1090 },
                        { x: 2009, y: 1012 },
                        { x: 2010, y: 1012 },
                    ]
                };

                var firstPaint = {
                    name: 'page.firstPaint',
                    datapoints: [
                        { x: 2001, y: 22 },
                        { x: 2002, y: 13 },
                        { x: 2003, y: 35 },
                        { x: 2004, y: 52 },
                        { x: 2005, y: 32 },
                        { x: 2006, y: 40 },
                        { x: 2007, y: 63 },
                        { x: 2008, y: 80 },
                        { x: 2009, y: 20 },
                        { x: 2010, y: 25 },
                    ]
                };

                scope.config = {
                    title: 'Line Chart',
                    subtitle: 'Line Chart Subtitle',
                    showXAxis: true,
                    showYAxis: true,
                    showLegend: true,
                    stack: false,
                };

                scope.datatest = [pageload];
                scope.multiple = [pageload, firstPaint];
            }
        };
    });

})();