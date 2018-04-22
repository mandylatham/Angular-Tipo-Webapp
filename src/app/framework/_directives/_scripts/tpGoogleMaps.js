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
                var dynMarkers = [];
                var mapjson = [scope.mapjson];
                tipoInstanceDataService.xAndYAxisData(mapjson).then(function(results) {
                    scope.results = results;
                    scope.tipoRootController = {};
                    scope.tipoRootController.selectTipo = function(tipo, event, tipos) {
                        scope.tipoRootController.infiniteItems.tipos = [tipo];
                        scope.map.setZoom(16);
                        scope.map.panTo(tipo.position_google_maps);
                        scope.map.showInfoWindow('myInfoWindow', tipo.position_google_maps);
                        event.stopPropagation();
                    }
                    scope.init = function() {
                        NgMap.getMap(scope.fieldname, { timeout: 20000 }).then(function(map) {
                            map.styles = scope.mapStyle;
                            scope.map = map;
                            MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ = 'https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/m';
                            for (var i = 0; i < results.length; i++) {
                                var result = results[i];
                                var geoloc = _.get(result, mapjson[0].field_name);
                                if (geoloc) {
                                    var latLng = new google.maps.LatLng(geoloc['lat'], geoloc['lon']);
                                    results[i].position_google_maps = latLng;
                                    var marker = new google.maps.Marker({ position: latLng, data: results[i] });
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
                                            scope.tipoRootController = {};
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
                            var markerClusterer = new MarkerClusterer(map, dynMarkers, { zoomOnClick: false });
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
                    scope.init();
                });
            }
        };
    });

})();