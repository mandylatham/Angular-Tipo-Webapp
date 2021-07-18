import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { isEmpty, isNumber, remove, toNumber } from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class TipoManipulationService {

  constructor() { }


  jsonToFormGroup(json) {
    const formGroup = Object.entries(json).reduce((a, [key, each]) => {
      if (Array.isArray(each) && each.length >= 0) {
        if (typeof each[0] === 'object') {
          a[key] = new FormArray([this.jsonToFormGroup(each[0])]);
          a[key].removeAt(0);
        } else {
          a[key] = new FormArray([]);
          if (each.length > 0 && each[0] !== '') {
            a[key].push(new FormControl(each[0]));
          }
        }
      } else if (typeof each === 'object') {
        a[key] = this.jsonToFormGroup(each);
      } else {
        if ( each !== '' && Number.isNaN(Number(each)) === false ) {
          each = toNumber(each);
        }
        a[key] = new FormControl(each);
      }
      return a;
    }, {});

    return new FormGroup(formGroup);
  }

  modifyTipoData(tipoData) {
    Object.entries(tipoData).forEach(([key, value]) => {
      if (!Array.isArray(value) && typeof value !== 'object') {
        if (isEmpty(value) && value !== false && value !== true && !isNumber(value)) {
          delete tipoData[key];
        } else {
          if (!value) {
            delete tipoData[key];
          }
        }
      }
      if (typeof value === 'object' && !Array.isArray(value)) {
        if (isEmpty(value)) {
          delete tipoData[key];
        } else {
          this.modifyTipoData(value);
        }
      }
      if (Array.isArray(value)) {
        if (value.length === 0) {
          delete tipoData[key];
        } else {
          remove(value, function (val) {
            return val._UI_STATUS === 'DELETED';
          });
          value.forEach((val) => {
            this.modifyTipoData(val);
          });
        }
      }
    });
    return tipoData;
  }

  prepareMenu(menuDefinition) {
    const menuItems = menuDefinition.tipo_menu.map((each) => {
      const menuItem: any = {};
      let type = each.type_ || each.navigate_to;
      if (type && !type.startsWith('http') && !type.startsWith('Client') && !type.startsWith('Tipo.') && !type.includes('.')) {
        type = `Tipo.${type}`;
      }
      menuItem.label = each.label;
      menuItem.icon = each.icon;
      menuItem.sequence = each.sequence;
      menuItem.ignore_singleton = each.ignore_singleton;
      if (each.navigate_to && !type.startsWith('Client')) {
        if (type.startsWith('/tipo')) {
          menuItem.location_to = each.navigate_to;
        } else {
          menuItem.navigate_to = each.navigate_to;
        }
      } else if (type) {
        const parts = type.split('.');
        const isTipo = parts[0] === 'Tipo';
        menuItem.type = parts[0];
        menuItem.id = parts[1];
        if (isTipo) {
          menuItem.tipo_name = parts[1];
          const typelabel = each.type__labels || each.type_;
          const types = typelabel.split(' - ');
          let tipo_type = each.tipo_type;
          if (tipo_type || types[1]) {
            tipo_type = tipo_type || types[1].split(',');
            tipo_type.forEach((each_type) => {
              if (each_type === 'abstract') {
                menuItem.abstract = true;
              }
              if (!menuItem.ignore_singleton && each_type.startsWith('singleton')) {
                menuItem.isSingleton = true;
              } else {
                menuItem.isSingleton = false;
              }
            });
          }
          // menuItem.perspective = perspective;
        }
      }
      menuItem.quickFilters = each.quick_filters;
      return menuItem;
    });

    return menuItems;
  }

}
