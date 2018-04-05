(function() {

    'use strict';

    var module = angular.module('tipo.framework');


    return module.directive('tpD3', function(tipoInstanceDataService, $mdColors, $mdColorUtil) {
        return {
            scope: {
                chartType: "@",
                xaxis: "=",
                yaxis: "=",
                tipoName: "@",
                spiltChart: "=",
                height: "=",
                margin: "=",
                x_label: "=",
                y_label: "=",
                agrregation: "=",
                data: "=",
            },
            restrict: 'EA',
            template: '<div style="width: 100%" config="config" data="data"></div>',
            link: function(scope, element, attrs, ctrl) {
                var graph = (scope.yaxis.metric && { bucket_name: 'xAxis', metric_name: 'yAxis', bucket: scope.xaxis, metric: scope.yaxis }) || { metric_name: 'xAxis', bucket_name: 'yAxis', metric: scope.xaxis, bucket: scope.yaxis };
                var fieldName = graph.bucket.field_name;
                if (graph.bucket.aggregration_type === "Terms") {
                    var aggegration_type = "terms";
                    fieldName = fieldName + ".keyword";
                } else if (graph.bucket.aggregration_type === "Date Histogram") {
                    var aggegration_type = "date_histogram";
                } else if (graph.bucket.aggregration_type === "Range") {
                    var aggegration_type = "range";
                };
                var filter = {};
                var field_name = fieldName.replace(/\./g, "_");
                _.set(filter, "tipo_aggs." + field_name + "." + aggegration_type + ".field", fieldName);
                tipoInstanceDataService.aggegrationData(scope.tipoName, filter).then(function(results) {
                    console.log("results");
                    console.log(results);
                    var option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        legend: {
                            data: []
                        },
                        calculable: true,
                    };
                    _.each(results, function(result, index) {
                        var dataValues = _.get(result, field_name + ".buckets");
                        if (scope.chartType === "PieChart") {
                            option = getPieChartOption(dataValues, index, option)
                        } else {
                            if (scope.chartType === "BarChart") {
                                var chart_type = "bar";
                            } else if (scope.chartType === "LineChart") {
                                var chart_type = "line";
                            };
                            if (aggegration_type === "date_histogram") {
                                option = getTimeOption(dataValues, index, option, chart_type)
                            } else {
                                option = getxyAxisOption(dataValues, index, option, chart_type)
                            }
                        }
                    })
                    myChart.setOption(option);
                });
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

                // use configuration item and data specified to show chart
                var myChart = echarts.init(ndWrapper, 'essos');

                function getPieChartOption(dataValues, index, option) {
                    _.set(option, "series[" + index + "].type", "pie");
                    _.set(option, "series[" + index + "].data", []);
                    _.each(dataValues, function(each) {
                        option.series[index].data.push({ name: each.key, value: each.doc_count });
                    });
                    return option;
                }

                function getxyAxisOption(dataValues, index, option, chart_type) {
                    _.set(option, graph.bucket_name + "[" + index + "].type", "category");
                    _.set(option, graph.metric_name + "[" + index + "].type", "value");
                    _.set(option, graph.bucket_name + "[" + index + "].data", []);
                    _.set(option, "series[" + index + "].type", chart_type);
                    _.set(option, "series[" + index + "].data", []);
                    _.each(dataValues, function(each) {
                        option[graph.bucket_name][index].data.push(each.key);
                        option.series[index].data.push(each.doc_count);
                    });
                    return option;
                }

                function getTimeOption(dataValues, index, option, chart_type) {
                    _.set(option, "xAxis[" + index + "].type", "time");
                    _.set(option, "yAxis[" + index + "].type", "value");
                    _.set(option, "series[" + index + "].type", chart_type);
                    _.set(option, "series[" + index + "].data", []);
                    _.each(dataValues, function(each) {
                        var date_value = new Date(each.key_as_string);
                        option.series[index].data.push({
                            name: each.key_as_string,
                            value: [
                                [date_value.getFullYear(), date_value.getMonth() + 1, date_value.getDate()].join('/'), each.doc_count
                            ]
                        });
                    });
                    return option;
                }
            }
        };
    });

})();