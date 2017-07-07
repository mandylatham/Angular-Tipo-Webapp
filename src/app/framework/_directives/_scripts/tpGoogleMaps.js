(function () {

  'use strict';

  var module = angular.module('tipo.framework');


  return module.directive('tpGoogleMaps', function (
    NgMap,
    tipoInstanceDataService) {
      return {
        scope: {
          mapjson: "=",
          root: "=",
          context: "="
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-google-maps.tpl.html',
        link: function(scope, element, attrs, ctrl){
          var dynMarkers = [];
          tipoInstanceDataService.xAndYAxisData(scope.mapjson).then(function(results){
            NgMap.getMap().then(function(map) {
               MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ = 'https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/m';
              for (var i=0; i<results.length; i++) {
                if (results[i][scope.mapjson[0].field_name]) {
                  var latLng = new google.maps.LatLng(results[i][scope.mapjson[0].field_name]['lat'], results[i][scope.mapjson[0].field_name]['lon']);
                  dynMarkers.push(new google.maps.Marker({position:latLng}));
                };
              }
              var markerClusterer = new MarkerClusterer(map, dynMarkers, {});
            });
          });
        }
      };
    }
  );

})();