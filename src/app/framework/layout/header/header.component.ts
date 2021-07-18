import { Title } from '@angular/platform-browser';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';

import { AuthenticationService, MetadataService } from '@app/common';
import { TipoStateService, TipoHandleService, TipoManipulationService } from '@app/framework/services';

@Component({
  selector: 'tp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input()
  sidenav: MatSidenav;
  perspectives: any[];
  profileList: any;
  user_meta: any;

  currentPerspective = 'Home';
  constructor(
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private metadataService: MetadataService,
    private tipoStateService: TipoStateService,
    private tipoHandleService: TipoHandleService,
    private tipoManipulationService: TipoManipulationService
  ) {

    this.perspectives = [{
      name: 'Home',
      icon: 'home',
      disabled: false,
      param: 'Home'
    }, {
      name: 'Settings',
      icon: 'settings',
      disabled: false,
      param: 'Settings'
    }
    ];
    const userMeta = this.authenticationService.user_meta;
    const appMeta = this.metadataService.app_meta_data;

    if (((userMeta.application_owner_account === '2000000001' && appMeta['TipoApp'].application_owner_account === userMeta.account) &&
      (userMeta.account !== '2000000001' || userMeta.application === '1000000001')) || appMeta['TipoApp'].publish_app_as_sample_app) {
      this.perspectives.push({
        name: 'Develop',
        icon: 'build',
        disabled: false,
        param: 'TipoApp.' + appMeta['TipoApp'].application
      });
    }
  }

  ngOnInit() {
    this.tipoHandleService.getTipo('TipoDefinition', 'ProfilePerspective', {})
        .subscribe(menuItems => {
          const menuList = this.tipoManipulationService.prepareMenu(menuItems);
          this.profileList = menuList;
        });
        this.user_meta = this.authenticationService.user_meta;
        console.log(this.user_meta);
   }


  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  navigateToItem(menuItem) {
    this.tipoStateService.toMenuItem(menuItem);
  }

  routeTo(perspective) {
    this.currentPerspective = perspective.name;
    this.tipoStateService.navigateTo('/dashboard', { perspective: perspective.param });
  }

  get title(): string {
    return this.titleService.getTitle();
  }
}
