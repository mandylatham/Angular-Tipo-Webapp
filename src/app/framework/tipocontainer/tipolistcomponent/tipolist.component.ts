import {Component, Input, OnInit, Injector} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {TipoHandleService} from '@app/framework/services';

@Component({
  selector: 'tp-list',
  templateUrl: './tipolist.component.html',
  styleUrls: ['./tipolist.component.scss']
})
export class TipoListComponent implements OnInit {
  @Input()
  sidenav: MatSidenav;
  perspectives: any[];
  tipo_name: string;
  layers = [
    {
      'tipo_name': 'Customer',
      'layer_title': 'Our Customers',
      'icon': './assets/user.svg',
      'filter': true,
      'selected': true,
      'geo_location_field': 'cust_address.street_address_location',
      'popup_template': '<div><h1>Welcome</h1>Customer</div>'
    }, {
      'tipo_name': 'Booking',
      'layer_title': 'Bookings',
      'icon': './assets/rent-a-car.svg',
      'filter': true,
      'selected': false,
      'geo_location_field': 'place.street_address_location',
      'popup_template': '<div>Bookings</div>'
    }
  ];
  geo_data_select = [
    'polygon',
    'rectangle',
    'circle'
  ];

  constructor(
    route: ActivatedRoute,
    private tipo_handle: TipoHandleService,
    _injector: Injector
  ) {
    this.tipo_name = route.snapshot.params.tipo_name;
  }

  ngOnInit() {
  }

  goto() {
    this.tipo_handle.routeTo(`/tipo/${this.tipo_name}/new`);
  }
}
