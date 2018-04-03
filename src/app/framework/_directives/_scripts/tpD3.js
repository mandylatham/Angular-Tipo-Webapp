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
                // if (scope.agrregation === "count") {
                scope.datatest = [{ tipo_name: "TipoDefinition", field_name: "created_date", type: "line", field_type: "date_time" }];
                tipoInstanceDataService.aggegrationData(scope.data).then(function(results) {
                    console.log("results");
                    console.log(results);
                    var option = {
                        color: ['#003366', '#006699', '#4cabce', '#e5323e'],
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
                        var each_data = scope.data[index];
                        var dataValues = _.get(result, each_data.field_name.replace(/\./g, "_") + ".buckets");
                        if (each_data.chart_type === "Pie") {
                            option = getPieChartOption(each_data, dataValues, index, option)
                        } else if (each_data.field_type === "date_time") {
                            option = getTimeOption(each_data, dataValues, index, option)
                        } else {
                            option = getxyAxisOption(each_data, dataValues, index, option)
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

                function getPieChartOption(each_data, dataValues, index, option) {
                    _.set(option, "series[" + index + "].type", _.toLower(each_data.chart_type));
                    _.set(option, "series[" + index + "].data", []);
                    _.each(dataValues, function(each) {
                        option.series[index].data.push({ name: each.key, value: each.doc_count });
                    });
                    return option;
                }

                function getxyAxisOption(each_data, dataValues, index, option) {
                    _.set(option, "xAxis[" + index + "].type", "category");
                    _.set(option, "yAxis[" + index + "].type", "value");
                    _.set(option, "series[" + index + "].type", _.toLower(each_data.chart_type));
                    _.set(option, "xAxis[" + index + "].data", []);
                    _.set(option, "series[" + index + "].data", []);
                    _.each(dataValues, function(each) {
                        option.xAxis[index].data.push(each.key);
                        option.series[index].data.push(each.doc_count);
                    });
                    return option;
                }

                function getTimeOption(each_data, dataValues, index, option) {
                    _.set(option, "xAxis[" + index + "].type", "time");
                    _.set(option, "yAxis[" + index + "].type", "value");
                    _.set(option, "series[" + index + "].type", _.toLower(each_data.chart_type));
                    _.set(option, "series[" + index + "].data", []);
                    _.each(dataValues, function(each) {
                        var date_value = new Date(each.key_as_string);
                        option.series[index].data.push({ name: each.key_as_string, value: [ [date_value.getFullYear(), date_value.getMonth() + 1, date_value.getDate()].join('/'), each.doc_count] });
                    });
                    return option;
                }
            }
        };
    });

})();