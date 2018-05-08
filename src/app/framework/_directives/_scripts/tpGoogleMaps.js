(function() {

    'use strict';

    var module = angular.module('tipo.framework');


    return module.directive('tpGoogleMaps', function(
        NgMap,
        tipoInstanceDataService,
        metadataService,
        tipoRouter) {
        return {
            scope: {
                mapjson: "=",
                root: "=",
                context: "=",
                fieldname: "@",
                mode: "@",
                detailTemplate: "@",
                markerIcon: "@",
                markerIconSize: "@",
                markerPosition: "@",
                labelStyle: "@",
                labelCss: "@",
                customCss: "@",
                mapStyle: "@",
                inputZoom: "=",
                inputToSelect: "=",

            },
            restrict: 'EA',
            replace: true,
            templateUrl: 'framework/_directives/_views/tp-google-maps.tpl.html',
            compile: function compile() {
                return {

                    pre: function(scope, element, attrs, ctrl) {
                        // pre-link code here...
                        var unbind = scope.$watch(function() { return element.parent()[0].clientWidth; }, function(n, o) {
                            if (element.parent()[0].clientWidth > 0) {
                                var ndWrapper = element.find('ng-map')[0],
                                    ndParent = element.parent()[0],
                                    parentHeight = ndParent.clientHeight,
                                    height;
                                height = (parentHeight > 300 && parentHeight) || 300;
                                ndWrapper.style.height = height + 'px';
                                unbind();
                            }
                        });
                        scope.centerCoord = scope.centerCoord || {};
                        scope.fieldid = scope.fieldname.replace(/[^a-zA-Z0-9]/g, "") + Math.random();
                        var tipo_name = scope.mapjson.tipo_name || 'TipoDefinition';
                        scope.templatepath = "g/public/gen_temp/common/views/list.tpl.html." + metadataService.userMetadata.role + "___" + ((scope.mapjson.template_name !== '' && scope.mapjson.template_name) || tipo_name);
                        scope.detailtemplatepath = scope.detailTemplate || scope.templatepath;
                        var styles = [{
                                "elementType": "geometry",
                                "stylers": [{
                                    "color": "#ebe3cd"
                                }]
                            },
                            {
                                "elementType": "labels.text.fill",
                                "stylers": [{
                                    "color": "#523735"
                                }]
                            },
                            {
                                "elementType": "labels.text.stroke",
                                "stylers": [{
                                    "color": "#f5f1e6"
                                }]
                            },
                            {
                                "featureType": "administrative",
                                "elementType": "geometry.stroke",
                                "stylers": [{
                                    "color": "#c9b2a6"
                                }]
                            },
                            {
                                "featureType": "administrative.land_parcel",
                                "elementType": "geometry.stroke",
                                "stylers": [{
                                    "color": "#dcd2be"
                                }]
                            },
                            {
                                "featureType": "administrative.land_parcel",
                                "elementType": "labels.text.fill",
                                "stylers": [{
                                    "color": "#ae9e90"
                                }]
                            },
                            {
                                "featureType": "landscape.natural",
                                "elementType": "geometry",
                                "stylers": [{
                                    "color": "#dfd2ae"
                                }]
                            },
                            {
                                "featureType": "poi",
                                "elementType": "geometry",
                                "stylers": [{
                                    "color": "#dfd2ae"
                                }]
                            },
                            {
                                "featureType": "poi",
                                "elementType": "labels.text.fill",
                                "stylers": [{
                                    "color": "#93817c"
                                }]
                            },
                            {
                                "featureType": "poi.park",
                                "elementType": "geometry.fill",
                                "stylers": [{
                                    "color": "#a5b076"
                                }]
                            },
                            {
                                "featureType": "poi.park",
                                "elementType": "labels.text.fill",
                                "stylers": [{
                                    "color": "#447530"
                                }]
                            },
                            {
                                "featureType": "road",
                                "elementType": "geometry",
                                "stylers": [{
                                    "color": "#f5f1e6"
                                }]
                            },
                            {
                                "featureType": "road.arterial",
                                "elementType": "geometry",
                                "stylers": [{
                                    "color": "#fdfcf8"
                                }]
                            },
                            {
                                "featureType": "road.highway",
                                "elementType": "geometry",
                                "stylers": [{
                                    "color": "#f8c967"
                                }]
                            },
                            {
                                "featureType": "road.highway",
                                "elementType": "geometry.stroke",
                                "stylers": [{
                                    "color": "#e9bc62"
                                }]
                            },
                            {
                                "featureType": "road.highway.controlled_access",
                                "elementType": "geometry",
                                "stylers": [{
                                    "color": "#e98d58"
                                }]
                            },
                            {
                                "featureType": "road.highway.controlled_access",
                                "elementType": "geometry.stroke",
                                "stylers": [{
                                    "color": "#db8555"
                                }]
                            },
                            {
                                "featureType": "road.local",
                                "elementType": "labels.text.fill",
                                "stylers": [{
                                    "color": "#806b63"
                                }]
                            },
                            {
                                "featureType": "transit.line",
                                "elementType": "geometry",
                                "stylers": [{
                                    "color": "#dfd2ae"
                                }]
                            },
                            {
                                "featureType": "transit.line",
                                "elementType": "labels.text.fill",
                                "stylers": [{
                                    "color": "#8f7d77"
                                }]
                            },
                            {
                                "featureType": "transit.line",
                                "elementType": "labels.text.stroke",
                                "stylers": [{
                                    "color": "#ebe3cd"
                                }]
                            },
                            {
                                "featureType": "transit.station",
                                "elementType": "geometry",
                                "stylers": [{
                                    "color": "#dfd2ae"
                                }]
                            },
                            {
                                "featureType": "water",
                                "elementType": "geometry.fill",
                                "stylers": [{
                                    "color": "#b9d3c2"
                                }]
                            },
                            {
                                "featureType": "water",
                                "elementType": "labels.text.fill",
                                "stylers": [{
                                    "color": "#92998d"
                                }]
                            }
                        ];
                        scope.styles = (scope.mapStyle && JSON.parse(atob(scope.mapStyle))) || styles;
                    },

                    post: postLink
                };
            }
        };

        function postLink(scope, element, attrs, ctrl) {
            var dynMarkers = [];
            var mapjson = [scope.mapjson];
            scope.tipoRootController = {};
            scope.tipoRootController.infiniteItems = {
                getItemAtIndex: function(index) {
                    return this.tipos[index]
                },
                getLength: function() {
                    return this.tipos.length;
                }
            };
            scope.tipoRootController.activeTab = 'main';
            scope.tipoRootController.popup = true;
            scope.init = function() {
                NgMap.getMap(scope.fieldid, { timeout: 20000 }).then(function(map) {
                    scope.map = map;
                    MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ = 'https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/m';
                    var styles = [{
                        url: scope.markerIcon || 'place',
                        height: 53,
                        width: 53,
                        iconSize: scope.markerIconSize || 48,
                        backgroundPosition: scope.markerPosition || "3 -24",
                        customStyle: "md-primary " + scope.customCss || "",
                        labelStyle: scope.labelStyle || "background:white;border-radius:50%;top:-14px;left: 19px;width:16px;line-height:16px;text-align: center;",
                        labelCss: scope.labelCss,
                        anchorText: [-6, 18]
                    }, {
                        url: scope.markerIcon || 'place',
                        height: 53,
                        width: 53,
                        iconSize: scope.markerIconSize || 48,
                        backgroundPosition: scope.markerPosition || "3 -24",
                        customStyle: "md-primary md-reverse-theme " + scope.customCss || "",
                        labelStyle: scope.labelStyle || "background:white;border-radius:50%;top:-14px;left: 19px;width:16px;line-height:16px;text-align: center;",
                        labelCss: scope.labelCss,
                        anchorText: [-6, 18]
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
                        if (scope.tipoRootController.infiniteItems.tipos.length === 1 && !scope.tipoRootController.bulkedit) {
                            tipoRouter.toTipoView(scope.mapjson.tipo_name || 'TipoDefinition', tipo.tipo_id);
                        } else if (!scope.tipoRootController.bulkedit) {
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
                    scope.fitMarkers();
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
                    scope.$watch(function() { return scope.root.selectedall }, function() {
                        markerClusterer.repaint();
                    });
                    scope.changeMapcenter = function(centerCoord) {
                        if (centerCoord.geometry) {
                            if (scope.inputZoom) {
                                scope.map.setCenter(centerCoord.geometry.location);
                                scope.map.fitBounds(centerCoord.geometry.viewport);
                            };
                            if (scope.inputToSelect && scope.root.bulkedit) {
                                var markers = markerClusterer.getMarkers();
                                _.each(markers, function(each_marker) {
                                    var contain = centerCoord.geometry.viewport.contains(each_marker.getPosition());
                                    if (contain) {
                                        each_marker.data.selected = true;
                                    };
                                });
                                markerClusterer.repaint();
                            };
                        };
                    }
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