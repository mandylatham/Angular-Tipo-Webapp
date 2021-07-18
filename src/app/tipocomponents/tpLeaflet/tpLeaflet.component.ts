import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import * as turf from '@turf/turf';

declare var L: any;

import '../../../../node_modules/leaflet.fullscreen/Control.FullScreen.js';
import '../../../../g/plugins/leaflet-gps/dist/leaflet-gps.src.js';
import {PopupComponent} from './popup.component';
import {TipoHandleService} from '@app/framework/services';
import 'leaflet.markercluster.layersupport';

@Component({
  selector: 'tp-leaflet',
  templateUrl: './tpLeaflet.component.html',
  styleUrls: ['./tpLeaflet.component.scss']
})
export class TpLeafletComponent implements OnInit, OnChanges {
  @Input() map_heading = 'Customers and Bookings';
  @Input() allow_layer_select = true;
  @Input() show_maximise_button = true;
  @Input() full_width_and_height = true;
  @Input() geo_data_select = [
    'polygon',
    'rectangle',
    'circle'
  ];
  @Input() show_current_location_icon = true;
  @Input() layers = [];

  mapHeading = this.map_heading;
  allowLayerSelect = this.allow_layer_select;
  showMaximiseButton = this.show_maximise_button;
  fullWidthAndHeight = this.full_width_and_height;
  geoDataSelect = this.geo_data_select;
  showCurrentLocationIcon = this.show_current_location_icon;

  openStreetUrl = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'});
  icon = {
    size: [30, 30]
  };
  mapLayers = [];
  options = {
    layers: [
      this.openStreetUrl
    ],
    zoom: 4,
    center: L.latLng(46.879966, -121.726909),
    fullscreenControl: this.showMaximiseButton,
    fullscreenControlOptions: {
      position: 'topleft'
    },
    gpsControl: this.showCurrentLocationIcon
  };
  layersControl = {
    overlays: {}
  };
  layersControlOptions = {
    collapsed: false
  };
  drawOptions = {
    position: 'topleft',
    draw: {
      polygon: true,
      circle: true,
      rectangle: true,
      circlemarker: false,
      polyline: false,
      marker: false
    },
    edit: {
      edit: false
    }
  };
  leafletMap: any;
  selectedMarkers = [];
  enableSelectItems = false;
  mcgLayerSupportGroup = L.markerClusterGroup.layerSupport();

  constructor(private zone: NgZone,
              private injector: Injector,
              private tipoHandle: TipoHandleService,
              private applicationRef: ApplicationRef,
              private componentFactoryResolver: ComponentFactoryResolver) {
    const PopupElement = createCustomElement(PopupComponent, {injector});
    customElements.define('popup-element', PopupElement);

    L.Polygon.include({
      contains: function (latLng) {
        return turf.inside(new L.Marker(latLng).toGeoJSON(), this.toGeoJSON());
      }
    });

    L.Rectangle.include({
      contains: function (latLng) {
        return this.getBounds().contains(latLng);
      }
    });

    L.Circle.include({
      contains: function (latLng) {
        return this.getLatLng().distanceTo(latLng) < this.getRadius();
      }
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const currentMapHeading: SimpleChange = changes.map_heading;
    const currentAllowLayerSelect: SimpleChange = changes.allow_layer_select;
    const currentShowMaximiseButton: SimpleChange = changes.show_maximise_button;
    const currentFullWidthAndHeight: SimpleChange = changes.full_width_and_height;
    const currentGeoDataSelect: SimpleChange = changes.geo_data_select;
    const currentShowCurrentLocationIcon: SimpleChange = changes.show_current_location_icon;
    const currentLayers: SimpleChange = changes.layers;

    this.zone.run(() => {
      if (currentMapHeading && currentMapHeading.currentValue) {
        this.mapHeading = currentMapHeading.currentValue;
      }
      if (currentAllowLayerSelect && currentAllowLayerSelect.currentValue !== undefined) {
        this.allowLayerSelect =
          !(currentAllowLayerSelect.currentValue === false || currentAllowLayerSelect.currentValue === 0);
      }
      if (currentShowMaximiseButton && currentShowMaximiseButton.currentValue !== undefined) {
        this.showMaximiseButton = !(currentShowMaximiseButton.currentValue === false || currentShowMaximiseButton.currentValue === 0);
        this.options.fullscreenControl = this.showMaximiseButton;
      }
      if (currentFullWidthAndHeight && currentFullWidthAndHeight.currentValue !== undefined) {
        this.fullWidthAndHeight = !(currentFullWidthAndHeight.currentValue === false || currentFullWidthAndHeight.currentValue === 0);
      }
      if (currentGeoDataSelect && currentGeoDataSelect.currentValue !== undefined) {
        this.geoDataSelect = currentGeoDataSelect.currentValue;
        this.manipulateDrawOption();
      }
      if (currentShowCurrentLocationIcon && currentShowCurrentLocationIcon.currentValue !== undefined) {
        this.showCurrentLocationIcon =
          !(currentShowCurrentLocationIcon.currentValue === false || currentShowCurrentLocationIcon.currentValue === 0);
        this.options.gpsControl = this.showCurrentLocationIcon;
      }
      if (currentLayers && currentLayers.currentValue) {
        this.mapLayers = [];
        this.options.layers = [this.openStreetUrl];
        for (let i = 0; i < currentLayers.currentValue.length; i++) {
          const obj = currentLayers.currentValue[i];

          const queryParams = {
            'geo_json_field': obj.geo_location_field,
            'per_page': '200',
          };

          this.tipoHandle.getTipos(obj.tipo_name, queryParams).subscribe((response) => {
            currentLayers.currentValue[i].geo_line_field = response;
            this.markLayer(currentLayers.currentValue[i]);
            if ((currentLayers.currentValue.length - 1) === i) {
              this.viewAllMarkers();
            }
          }, (error) => {
            if ((currentLayers.currentValue.length - 1) === i) {
              this.viewAllMarkers();
            }
          });
        }
      }
    });
  }

  markLayer(data: any) {
    const that = this;
    const polylineCords = [];
    const geoLayer = L.geoJSON(data.geo_line_field, {
      pointToLayer: function (feature, latlng) {
        polylineCords.push([latlng.lat, latlng.lng]);
        const m = L.marker([latlng.lat, latlng.lng], {
          icon: L.icon({
            iconUrl: data.icon,
            iconSize: that.icon.size
          })
        });
        const popup = L.popup({keepInView: true});
        const popupEl = document.createElement('popup-component');
        const factory = that.componentFactoryResolver.resolveComponentFactory(PopupComponent);
        const popupComponentRef = factory.create(that.injector, [], popupEl);
        that.applicationRef.attachView(popupComponentRef.hostView);
        popupComponentRef.instance.data = feature.properties;
        popup.setContent(popupEl);
        m.bindPopup(popup);
        return m;
      }
    });
    // const polyline = L.polyline(polylineCords, {color: 'blue'});
    const layerGroup = L.layerGroup([geoLayer]);
    if (data.selected) {
      this.mapLayers.push(layerGroup);
    }
    this.layersControl.overlays[data.tipo_name] = layerGroup;
    this.mcgLayerSupportGroup.checkIn([layerGroup]);
  }

  manipulateDrawOption() {
    this.drawOptions.draw.circle = this.geoDataSelect.indexOf('circle') !== -1;
    this.drawOptions.draw.polygon = this.geoDataSelect.indexOf('polygon') !== -1;
    this.drawOptions.draw.rectangle = this.geoDataSelect.indexOf('rectangle') !== -1;
  }

  onMapReady(map) {
    let drawnLayer;
    this.leafletMap = map;
    this.mcgLayerSupportGroup.addTo(this.leafletMap);
    const that = this;

    map.on(L.Draw.Event.CREATED, function (e) {
      drawnLayer = e;
      that.selectedMarkers = [];
      that.zone.run(() => {
        that.enableSelectItems = true;
      });
      map.eachLayer(function (marker) {
        if (marker._latlng && marker._popupHandlersAdded) {
          if (e.layer.contains(marker.getLatLng())) {
            that.selectedMarkers.push(marker);
          }
        }
      });
    });

    map.on('draw:deleted', function (e) {
      const arrayOfKeys = Object.keys(e.layers._layers);
      if (arrayOfKeys.length) {
        that.zone.run(() => {
          that.enableSelectItems = false;
        });
      }
    });

    map.on('draw:drawstart', function () {
      if (drawnLayer) {
        map.removeLayer(drawnLayer.layer);
      }
    });

    map.on('overlayadd overlayremove', function () {
      that.viewAllMarkers();
    });

    map.on('locationfound', function (e) {
      map.setView([e.latlng.lat, e.latlng.lng], 15);
      /*const bounds = new L.LatLngBounds();
      map.eachLayer(function (layer) {
        if (layer instanceof L.FeatureGroup) {
          bounds.extend(layer.getBounds());
        }
      });
      bounds.extend(e.bounds);
      if (bounds.isValid()) {
        map.fitBounds(bounds, {padding: [100, 100]});
      }*/
    });

    this.mcgLayerSupportGroup.on('clusterclick', function (e) {
      that.zone.run(() => {
        const childMarkers = [];
        const child = e.layer.getAllChildMarkers();

        for (let i = 0; i < child.length; i++) {
          childMarkers.push(child[i].feature.properties);
        }

        const cPopupEl = document.createElement('popup-component');
        const cFactory = that.componentFactoryResolver.resolveComponentFactory(PopupComponent);
        const cPopupComponentRef = cFactory.create(that.injector, [], cPopupEl);
        that.applicationRef.attachView(cPopupComponentRef.hostView);
        cPopupComponentRef.instance.data = childMarkers;
        L.popup({minWidth: 300, keepInView: true})
          .setLatLng(e.layer.getLatLng())
          .setContent(cPopupEl)
          .openOn(map);
      });
    });
  }

  getSelectedItems() {
    console.log(this.selectedMarkers);
  }

  viewAllMarkers() {
    const bounds = new L.LatLngBounds();
    this.leafletMap.eachLayer(function (layer) {
      if (layer instanceof L.FeatureGroup) {
        bounds.extend(layer.getBounds());
      }
    });
    if (bounds.isValid()) {
      this.leafletMap.fitBounds(bounds, {padding: [100, 100]});
    }
  }
}
