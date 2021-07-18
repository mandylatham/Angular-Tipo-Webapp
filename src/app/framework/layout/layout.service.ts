import { Routes, Route } from '@angular/router';

import { AuthenticationGuard } from '@app/common';
import { LayoutComponent } from './layout.component';
import { MenuResolver } from './menu-resolver.service';


/**
 * Provides helper methods to create routes.
 */
export class Layout {
  /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return The new route using shell as the base.
   */
  static childRoutes(routes: Routes): Route {
    return {
      path: '',
      component: LayoutComponent,
      children: routes,
      canActivate: [AuthenticationGuard],
      data: { reuse: true },
      // resolve: {menu: MenuResolver}
    };
  }
}
