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
                  var marker = new google.maps.Marker({position:latLng,data:results[i]});
                  google.maps.event.addListener(marker, 'click', function (event) {
                        // Reference to the DIV which receives the contents of the infowindow using jQuery
                     var iwOuter = $('.gm-style-iw');
                     console.log(marker);

                     /* The DIV we want to change is above the .gm-style-iw DIV.
                      * So, we use jQuery and create a iwBackground variable,
                      * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
                      */
                     var iwBackground = iwOuter.prev();

                     // Remove the background shadow DIV
                     iwBackground.children(':nth-child(2)').css({'display' : 'none'});

                     // Remove the white background DIV
                     iwBackground.children(':nth-child(4)').css({'display' : 'none'});
                    scope.tipoRootController= {};
                    scope.tipoRootController.hasTipos = true;
                    scope.tipoRootController.hideActions = true;
                    scope.tipoRootController.tipos = [marker.data];
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
    }
  );

})();