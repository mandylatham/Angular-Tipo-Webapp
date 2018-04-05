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
                splitChart: "=",
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
                scope.field_label = {};
                var filter = {};
                _.set(filter, "tipo_aggs", getElasticQuery(graph.bucket, {}, "bucket"));
                if (!_.isEmpty(scope.splitChart.field_name)) {
                    _.set(filter, "tipo_aggs." + _.get(scope.field_label, "bucket") + ".aggs", getElasticQuery(scope.splitChart, {}, "splitChart"));
                };
                tipoInstanceDataService.aggegrationData(scope.tipoName, filter).then(function(results) {
                    console.log("results");
                    console.log(results);
                    var option = {
                        color: [
                            $mdColorUtil.rgbaToHex($mdColors.getThemeColor('accent-900')),
                            $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-900')),
                            $mdColorUtil.rgbaToHex($mdColors.getThemeColor('accent-A200')),
                            $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-A200')),
                            $mdColorUtil.rgbaToHex($mdColors.getThemeColor('accent-400')),
                            $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-400')),
                            $mdColorUtil.rgbaToHex($mdColors.getThemeColor('accent-200')),
                            $mdColorUtil.rgbaToHex($mdColors.getThemeColor('primary-200')),
                        ],
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
                        var dataValues = _.get(result, _.get(scope.field_label, "bucket") + ".buckets");
                        if (scope.chartType === "PieChart") {
                            option = getPieChartOption(dataValues, index, option)
                        } else {
                            if (scope.chartType === "BarChart") {
                                var chart_type = "bar";
                            } else if (scope.chartType === "LineChart") {
                                var chart_type = "line";
                            };
                            var aggegration_type = scope.aggegration_type["splitChart"] || scope.aggegration_type["bucket"]
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
                var myChart = echarts.init(ndWrapper);


                function getElasticQuery(bucket, aggs, type) {
                    var field_label = bucket.field_name.replace(/\./g, "_");
                    _.set(scope.field_label, type, field_label);
                    if (bucket.aggregration_type === "Terms") {
                        _.set(scope, "aggegration_type." + type, "terms");
                        bucket.field_name = bucket.field_name;
                        _.set(aggs, field_label + "." + scope.aggegration_type[type] + ".field", bucket.field_name);
                    } else if (bucket.aggregration_type === "Date Histogram") {
                        _.set(scope, "aggegration_type." + type, "date_histogram");
                        _.set(aggs, field_label + "." + scope.aggegration_type[type] + ".field", bucket.field_name);
                        _.set(aggs, field_label + "." + scope.aggegration_type[type] + ".interval", bucket.interval);
                    } else if (bucket.aggregration_type === "Range") {
                        _.set(scope, "aggegration_type." + type, "range");
                        _.set(aggs, field_label + "." + scope.aggegration_type[type] + ".field", bucket.field_name);
                    };
                    return aggs;
                }

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
                    _.set(option, "series[" + index + "].type", chart_type);
                    _.set(option, "series[" + index + "].data", []);
                    _.each(dataValues, function(each) {
                        if (!_.isEmpty(scope.splitChart.field_name)) {
                            option.legend.data.push(each.key);
                            _.set(option, "series[" + index + "].name", each.key);
                            var splitChartValues = _.get(each, _.get(scope.field_label, "splitChart") + ".buckets", index);
                            _.each(splitChartValues, function(each_value) {
                                option = getSeriesData(option, each, index);
                            })
                        } else {
                            option = getSeriesData(option, each, index);
                        }
                    });
                    return option;
                }

                function getSeriesData(option, each, index) {
                    if (graph.bucket_name === "xAxis") {
                        option.series[index].data.push({
                            value: [each.key_as_string || each.key, each.doc_count]
                        });
                    } else {
                        option.series[index].data.push({
                            value: [each.doc_count, each.key_as_string || each.key]
                        });
                    }
                    return option;
                }

                function getTimeOption(dataValues, index, option, chart_type) {
                    _.set(option, graph.bucket_name + "[" + index + "].type", "time");
                    _.set(option, graph.metric_name + "[" + index + "].type", "value");
                    _.set(option, "series[" + index + "].type", chart_type);
                    _.set(option, "series[" + index + "].data", []);
                    _.each(dataValues, function(each) {
                        var date_value = new Date(each.key_as_string);
                        if (!_.isEmpty(scope.splitChart.field_name)) {
                            option.legend.data.push(each.key);
                            var splitChartValues = _.get(each, _.get(scope.field_label, "splitChart") + ".buckets", index);
                            _.each(splitChartValues, function(each_value,index) {
                                _.set(option, "series[" + index + "].data", []);
                                _.set(option, "series[" + index + "].type", chart_type);
                                _.set(option, "series[" + index + "].name", each.key);
                                option = getTimeSeriesData(option, each_value, index);
                            })
                        } else {
                            option = getTimeSeriesData(option, each, index);
                        }
                    });
                    return option;
                }

                function getTimeSeriesData(option, each, index) {
                    var date_value = new Date(each.key_as_string);
                    if (graph.bucket_name === "xAxis") {
                        option.series[index].data.push({
                            name: each.key_as_string,
                            value: [
                                [date_value.getFullYear(), date_value.getMonth() + 1, date_value.getDate()].join('/'), each.doc_count
                            ]
                        });
                    } else {
                        option.series[index].data.push({
                            name: each.key_as_string,
                            value: [
                                each.doc_count, [date_value.getFullYear(), date_value.getMonth() + 1, date_value.getDate()].join('/')
                            ]
                        });
                    }
                    return option;
                }
            }
        };
    });

})();