(function() {

    'use strict';

    var module = angular.module('tipo.framework');


    return module.directive('tpGoogleMaps', function(
        NgMap,
        tipoInstanceDataService,
        metadataService,
        $http,
        $templateCache) {
        return {
            scope: {
                mapjson: "=",
                root: "=",
                context: "=",
                fieldname: "@",
                mode: "@"
            },
            restrict: 'EA',
            replace: true,
            templateUrl: 'framework/_directives/_views/tp-google-maps.tpl.html',
            compile: function compile() {
                return {

                    pre: function(scope, element, attrs, ctrl) {
                        // pre-link code here...
                        var tipo_name = scope.mapjson.tipo_name || 'TipoDefinition'
                        scope.templatepath = "g/public/gen_temp/common/views/list.tpl.html." + metadataService.userMetadata.role + "___" + tipo_name;
                    },

                    post: postLink
                };
            }
        };

        function postLink(scope, element, attrs, ctrl) {
            scope.fieldid = scope.fieldname.replace(/[^a-zA-Z0-9]/g, "") + Math.random();
            var dynMarkers = [];
            var mapjson = [scope.mapjson];
            scope.tipoRootController = {};
            scope.init = function() {
                NgMap.getMap(scope.fieldname, { timeout: 20000 }).then(function(map) {
                    map.styles = scope.mapStyle;
                    scope.map = map;
                    MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ = 'https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/m';
                    var styles = [{
                        url: 'place',
                        height: 53,
                        width: 53,
                        backgroundPosition: "10 -10",
                        customStyle: "md-primary",
                        anchorText: [-6, 18]
                    }, {
                        url: 'place',
                        height: 53,
                        width: 53,
                        backgroundPosition: "10 -10",
                        anchorText: [-6, 18],
                        customStyle: "md-primary md-reverse-theme"
                    }];
                    for (var i = 0; i < scope.results.length; i++) {
                        var result = scope.results[i];
                        var geoloc = _.get(result, mapjson[0].field_name);
                        if (geoloc) {
                            var latLng = new google.maps.LatLng(geoloc['lat'], geoloc['lon']);
                            scope.results[i].position_google_maps = latLng;
                            var marker = new google.maps.Marker({ position: latLng, data: scope.results[i] });
                            google.maps.event.addListener(marker, 'click', (function(event) {
                                return function() {
                                    // Reference to the DIV which receives the contents of the infowindow using jQuery
                                    var iwOuter = $('.gm-style-iw');

                                    /* The DIV we want to change is above the .gm-style-iw DIV.
                                     * So, we use jQuery and create a iwBackground variable,
                                     * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
                                     */
                                    var iwBackground = iwOuter.prev();

                                    // Remove the background shadow DIV
                                    iwBackground.children(':nth-child(2)').css({ 'display': 'none' });

                                    // Remove the white background DIV
                                    iwBackground.children(':nth-child(4)').css({ 'display': 'none' });
                                    scope.tipoRootController.hasTipos = true;
                                    scope.tipoRootController.hideActions = true;
                                    scope.tipoRootController.infiniteItems = {};
                                    // var data = this.getData();
                                    scope.tipoRootController.infiniteItems.tipos = [this.data];
                                    scope.map.showInfoWindow('myInfoWindow', this);
                                }
                            })(marker));
                            dynMarkers.push(marker);
                        };
                    }

                    function customCalculator(markers, numStyles) {
                        var index = 0;
                        var count = markers.length;
                        var dv = count;
                        if (_.find(markers, function(o) { return o.data.selected; })) {
                            return {
                                text: count,
                                index: numStyles
                            };
                        } else {
                            while (dv !== 0) {
                                dv = parseInt(dv / 10, 10);
                                index++;
                            }

                            index = Math.min(index, numStyles - 1);
                            return {
                                text: count,
                                index: index
                            };
                        }
                    }
                    // var markerClusterer = new MarkerClusterer(scope.map, dynMarkers, { zoomOnClick: false });
                    var markerClusterer = new MarkerClusterer(scope.map, dynMarkers, { zoomOnClick: false, styles: styles, minimumClusterSize: 1 });
                    markerClusterer.setCalculator(customCalculator);
                    scope.tipoRootController.selectTipo = function(tipo, event, tipos) {
                        if (!scope.tipoRootController.bulkedit) {
                            scope.tipoRootController.infiniteItems.tipos = [tipo];
                            scope.map.setZoom(16);
                            scope.map.panTo(tipo.position_google_maps);
                            scope.map.showInfoWindow('myInfoWindow', tipo.position_google_maps);
                            event.stopPropagation();
                        } else {
                            tipo.selected = !tipo.selected;
                            markerClusterer.repaint();
                            event.stopPropagation();
                        }
                    }
                    scope.fitMarkers = function() {
                        markerClusterer.fitMapToMarkers();
                    }
                    scope.drawingManager = new google.maps.drawing.DrawingManager({
                        drawingControlOptions: {
                            position: google.maps.ControlPosition.TOP_CENTER,
                            drawingModes: ['rectangle', 'polygon']
                        },
                        rectangleOptions: {
                            fillOpacity: 0.15,
                            strokeWeight: 0.9,
                            clickable: false,
                            // visible: false,
                            zIndex: 1
                        },
                        polygonOptions: {
                            fillOpacity: 0.15,
                            strokeWeight: 0.9,
                            clickable: false,
                            // visible: false,
                            zIndex: 1
                        },
                    });
                    scope.drawingManager.setMap(scope.map);
                    scope.$watch(function() { return scope.root.bulkedit }, function() {
                        if (scope.root.bulkedit) {
                            scope.drawingManager.setOptions({ drawingControl: true });
                            scope.tipoRootController.bulkedit = true;
                        } else {
                            scope.drawingManager.setOptions({ drawingControl: false });
                            scope.tipoRootController.bulkedit = false;
                        }
                    });
                    google.maps.event.addListener(scope.drawingManager, 'rectanglecomplete', function(rectangle) {
                        var bounds = rectangle.getBounds();
                        var markers = markerClusterer.getMarkers();
                        var clusters = markerClusterer.clusters_;
                        _.each(markers, function(each_marker) {
                            var contain = bounds.contains(each_marker.getPosition());
                            if (contain) {
                                each_marker.data.selected = true;
                            };
                        });
                        rectangle.setMap(null);
                        markerClusterer.repaint();
                    });
                    google.maps.event.addListener(scope.drawingManager, 'polygoncomplete', function(rectangle) {
                        // var bounds = rectangle.getBounds();
                        var markers = markerClusterer.getMarkers();
                        var clusters = markerClusterer.clusters_;
                        _.each(markers, function(each_marker) {
                            var latlong = each_marker.getPosition();
                            if (google.maps.geometry.poly.containsLocation(latlong, rectangle)) {
                                each_marker.data.selected = true;
                            };
                        });
                        rectangle.setMap(null);
                        markerClusterer.repaint();
                    });
                    google.maps.event.addListener(markerClusterer, 'clusterclick', function(cluster) {
                        // your code here
                        var center = cluster.getCenter();
                        var markers = cluster.getMarkers();
                        var zoom = scope.map.getZoom();
                        var size = cluster.getSize();
                        // if (zoom === 22 && size >= 2) {
                        var iwOuter = $('.gm-style-iw');

                        /* The DIV we want to change is above the .gm-style-iw DIV.
                         * So, we use jQuery and create a iwBackground variable,
                         * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
                         */
                        var iwBackground = iwOuter.prev();

                        // Remove the background shadow DIV
                        // iwBackground.children(':nth-child(2)').css({ 'display': 'none' });

                        // // Remove the white background DIV
                        // iwBackground.children(':nth-child(4)').css({ 'display': 'none' });
                        scope.tipoRootController.hasTipos = true;
                        scope.tipoRootController.hideActions = true;
                        scope.tipoRootController.infiniteItems = {};
                        // var data = this.getData();
                        var makerdata = _.map(markers, 'data');
                        scope.tipoRootController.infiniteItems.tipos = makerdata;
                        scope.map.showInfoWindow('myInfoWindow', center);
                        // };
                    });
                }, function(map) {
                    scope.init();
                });
            }
            if (scope.mode !== 'list') {
                tipoInstanceDataService.xAndYAxisData(mapjson).then(function(results) {
                    scope.results = results;
                    scope.init();
                });
            } else {
                scope.results = scope.root.infiniteItems.tipos;
                scope.init();
            }
        }
    });

})();