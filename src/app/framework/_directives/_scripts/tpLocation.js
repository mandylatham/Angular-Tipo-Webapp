(function() {

    'use strict';

    var module = angular.module('tipo.framework');


    return module.directive('tpLocation', function(NgMap,
        metadataService) {
        return {
            scope: {
                locationAddress: "=",
                context: "=",
                fieldvalue: "=",
                showInMap: "=",
                fieldname: "@"
            },
            restrict: 'EA',
            replace: true,
            templateUrl: 'framework/_directives/_views/tp-location.tpl.html',
            link: function(scope, element, attrs, ctrl) {
                scope.fieldid = scope.fieldname.replace(/[^a-zA-Z0-9]/g, "") + Math.random();
                if (scope.showInMap === "true") {
                  scope.isMap = true;
                };
                scope.myGeolocation = metadataService.geoLocation;
                scope.locationAddress = scope.locationAddress || {};
                scope.fieldvalue = scope.fieldvalue || {};
                NgMap.getMap(scope.fieldid).then(function(map) {
                    scope.map = map;
                    scope.loadPlaceData();
                });
                var componentForm = {
                    street_number: 'short_name',
                    route: 'long_name',
                    neighborhood: 'long_name',
                    sublocality_level_1: 'long_name',
                    sublocality_level_2: 'long_name',
                    locality: 'long_name',
                    administrative_area_level_2: 'long_name',
                    administrative_area_level_1: 'long_name',
                    country: 'long_name',
                    postal_code: 'short_name'
                };

                scope.locateme = function(){
                  scope.selectLocation({latLng: {lat: scope.myGeolocation.latitude ,lng: scope.myGeolocation.longitude }})
                }

                scope.selectLocation = function(event) {
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({
                        'latLng': event.latLng
                    }, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                scope.fieldvalue = results[0];
                                scope.loadPlaceData();
                            }
                        }
                    });
                    console.log(event);
                }
                scope.loadPlaceData = function() {
                    if (scope.fieldvalue.geometry) {
                        scope.address = {};
                        scope.locationAddress = { lat: scope.fieldvalue.geometry.location.lat(), lon: scope.fieldvalue.geometry.location.lng() };
                        if (scope.isMap) {
                          scope.map.setCenter(scope.fieldvalue.geometry.location);
                        }
                        var latLng = new google.maps.LatLng(scope.locationAddress['lat'], scope.locationAddress['lon']);
                        scope.position = [scope.locationAddress['lat'], scope.locationAddress['lon']];
                        var marker = new google.maps.Marker({ position: latLng });
                        scope.context.format_address = scope.fieldvalue.formatted_address;
                        scope.context.place_name = scope.fieldvalue.name;
                        _.each(scope.fieldvalue.address_components, function(component) {
                            var addressType = component.types[0]
                            if (componentForm[addressType]) {
                                var val = component[componentForm[addressType]];
                                scope.address[addressType] = val;
                            };
                        });
                        scope.context.street_address = _.trim((scope.address.street_number || "") + " " + (scope.address.route || "") + " " + (scope.address.neighborhood || "") + " " + (scope.address.sublocality_level_1 || "") + " " + (scope.address.sublocality_level_2 || ""));
                        scope.context.suburb = scope.address.locality;
                        scope.context.province_region_district = scope.address.administrative_area_level_2;
                        scope.context.state_ = scope.address.administrative_area_level_1;
                        scope.context.country = scope.address.country;
                        scope.context._postalcode = _.toNumber(scope.address.postal_code);
                    }else if(scope.fieldvalue && scope.isMap && scope.map){
                      scope.map.setCenter(new google.maps.LatLng(scope.locationAddress.lat, scope.locationAddress.lon));
                      google.maps.event.trigger(scope.map, 'resize');
                    }
                }

                scope.loadPlaceData();

                var unbind = scope.$watch(function(){return metadataService.geoLocation},function(newvalue){
                  if (newvalue) {
                    unbind();
                    scope.myGeolocation = metadataService.geoLocation;
                  };
                })
            }
        };
    });

})();