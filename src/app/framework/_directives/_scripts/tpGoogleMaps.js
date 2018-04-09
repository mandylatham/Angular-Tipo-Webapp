(function() {

    'use strict';

    var module = angular.module('tipo.framework');


    return module.directive('tpGoogleMaps', function(
        NgMap,
        tipoInstanceDataService) {
        return {
            scope: {
                mapjson: "=",
                root: "=",
                context: "=",
                fieldname: "@"
            },
            restrict: 'EA',
            replace: true,
            templateUrl: 'framework/_directives/_views/tp-google-maps.tpl.html',
            link: function(scope, element, attrs, ctrl) {
                scope.fieldid = scope.fieldname.replace(/[^a-zA-Z0-9]/g, "") + Math.random();
                scope.mapStyle = [{
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#f5f5f5"
                        }]
                    },
                    {
                        "elementType": "labels.icon",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    },
                    {
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#616161"
                        }]
                    },
                    {
                        "elementType": "labels.text.stroke",
                        "stylers": [{
                            "color": "#f5f5f5"
                        }]
                    },
                    {
                        "featureType": "administrative.land_parcel",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#bdbdbd"
                        }]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#eeeeee"
                        }]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#757575"
                        }]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#e5e5e5"
                        }]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#9e9e9e"
                        }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#ffffff"
                        }]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#757575"
                        }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#dadada"
                        }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#616161"
                        }]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#9e9e9e"
                        }]
                    },
                    {
                        "featureType": "transit.line",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#e5e5e5"
                        }]
                    },
                    {
                        "featureType": "transit.station",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#eeeeee"
                        }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#c9c9c9"
                        }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#9e9e9e"
                        }]
                    }
                ]
                var dynMarkers = [];
                var mapjson = [scope.mapjson];
                tipoInstanceDataService.xAndYAxisData(mapjson).then(function(results) {
                    NgMap.getMap(scope.fieldid).then(function(map) {
                      map.styles = scope.mapStyle;
                        MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ = 'https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/m';
                        for (var i = 0; i < results.length; i++) {
                            if (results[i][mapjson[0].field_name]) {
                                var latLng = new google.maps.LatLng(results[i][mapjson[0].field_name]['lat'], results[i][mapjson[0].field_name]['lon']);
                                var marker = new google.maps.Marker({ position: latLng, data: results[i] });
                                google.maps.event.addListener(marker, 'click', function(event) {
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
                                    scope.tipoRootController = {};
                                    scope.tipoRootController.hasTipos = true;
                                    scope.tipoRootController.hideActions = true;
                                    scope.tipoRootController.infiniteItems = {};
                                    scope.tipoRootController.infiniteItems.tipos = [marker.data];
                                    scope.map.showInfoWindow('myInfoWindow', this);
                                });
                                dynMarkers.push(marker);
                            };
                        }
                        var markerClusterer = new MarkerClusterer(map, dynMarkers, {});
                    });
                });
            }
        };
    });

})();