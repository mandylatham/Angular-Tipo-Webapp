(function () {

  'use strict';

  var module = angular.module('tipo.framework');


  return module.directive('tpLocation', function () {
      return {
        scope: {
          location: "=",
          formattedAddress: "=",
          context: "="
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-location.tpl.html',
        link: function(scope, element, attrs, ctrl){
          scope.place = {};
          if (!scope.location) {
            scope.location = {};
          }else{
            scope.place =  scope.formattedAddress;
          }
          var componentForm = {
            street_number: 'short_name',
            route: 'long_name',
            neighborhood: 'long_name',
            sublocality_level_1: 'long_name',
            locality: 'long_name',
            administrative_area_level_2: 'long_name',
            administrative_area_level_1: 'long_name',
            country: 'long_name',
            postal_code: 'short_name'
          };
          scope.loadPlaceData = function(){
            if (scope.place.geometry) {
              scope.address = {};
              scope.location.underscore_location = {lat: scope.place.geometry.location.lat(), lon: scope.place.geometry.location.lng()};
              scope.formattedAddress = scope.place.formatted_address;
              _.each(scope.place.address_components,function(component){
                var addressType = component.types[0]
                if (componentForm[addressType]) {
                  var val = component[componentForm[addressType]];
                  scope.address[addressType] = val;
                };
              });
              scope.context.street_address = _.trim((scope.address.street_number || "") + " " + (scope.address.route || "")) ;
              scope.context.address_line_1 = _.trim((scope.address.neighborhood || "")+ " " + (scope.address.sublocality_level_1 || ""));
              scope.context.suburb = scope.address.locality;
              scope.context.state_region = scope.address.administrative_area_level_2;
              scope.context.state_ = scope.address.administrative_area_level_1;
              scope.context.country = scope.address.country;
              scope.context.postal_code = scope.address.postal_code;
            };
          }
        }
      };
    }
  );

})();