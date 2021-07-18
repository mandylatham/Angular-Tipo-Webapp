import { Component, OnDestroy, OnInit } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TipoManipulationService, TipoStateService, TipoHandleService } from '@app/framework/services';
import { Logger } from '@app/common';


const log = new Logger('LayoutComponent');

@Component({
  selector: 'tp-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  menuItems: any[];
  activeItem: String;
  perspectiveSubscription: any;
  isMobile: boolean;
  isTablet: boolean;
  isWeb: boolean;
  xsSidenav = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private titleService: Title,
    private media: ObservableMedia,
    private tipoManipulationService: TipoManipulationService,
    private tipoStateService: TipoStateService,
    private tipoHandleService: TipoHandleService,
  ) {
    this.tipoHandleService.setUserContext();
    breakpointObserver.observe([
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      console.log(result);
      this.isMobile = result.matches;
    });
    breakpointObserver.observe([
      Breakpoints.TabletPortrait
    ]).subscribe(result => {
      this.isTablet = result.matches;
    });
    breakpointObserver.observe([
      Breakpoints.WebPortrait
    ]).subscribe(result => {
      this.isWeb = result.matches;
    });
  }

  clientActions: any = {
    'ClearCache': function () {
      this.tipoHandleService.saveTipo('TipoSpecial.Cache.Remove', 'default', {})
                            .subscribe((response) => {
                              log.debug('Clear Cache', response);
                            });
    },
    'Logout': function () {
    },
    tipoHandleService: this.tipoHandleService
  };


  toggleSidenav() {
    if (!this.isMobile) {
      this.xsSidenav = !this.xsSidenav;
    }
  }

  loadMenuitems(data) {
    const menuItems = this.tipoManipulationService.prepareMenu(data);
    this.menuItems = menuItems;
    log.debug('menuItems', menuItems);
  }

  resolveMenuitem() {
    const url_tree = this.tipoStateService.getCurrentUrlTree();
    if (url_tree.root.children.primary.segments[0].path === 'dashboard') {
      this.tipoStateService.toMenuItem(this.menuItems[0]);
      this.activeItem = this.menuItems[0];
    }
  }

  navigateToItem(menuItem) {
    if (menuItem.type === 'Client') {
      if (this.clientActions[menuItem.id]) {
        this.clientActions[menuItem.id](menuItem);
      } else {
        // do nothing
      }
      return;
    }
    this.tipoStateService.toMenuItem(menuItem);
    this.activeItem = menuItem;
  }

  ngOnInit() {
    log.debug('Init Layout');
    // this.activatedRoute.data.subscribe((data) => {
    //   if (!this.menuItems) {
    //     this.loadMenuitems(data.menu);
    //     this.resolveMenuitem();
    //   }
    // })
    this.perspectiveSubscription = this.tipoStateService.perspectiveChanges.subscribe((data) => {
      log.debug('menu event trigger', data);
      const perspective = this.tipoStateService.getCurrentPerspective();
      const parts = perspective.split('.');
      const tipoName = parts[0];
      this.tipoHandleService.getTipo('TipoDefinition', tipoName, {})
        .subscribe(menuItems => {
          this.loadMenuitems(menuItems);
          this.tipoStateService.setperspectiveMetaData(menuItems);
          this.resolveMenuitem();
        });
    });

  }

  ngOnDestroy() {
    this.perspectiveSubscription.unsubscribe();
  }

  get s(): boolean {
    return this.media.isActive('xs') || this.media.isActive('sm');
  }

  get title(): string {
    return this.titleService.getTitle();
  }
}
