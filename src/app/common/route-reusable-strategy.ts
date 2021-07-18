import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

/**
 * A route strategy allowing for explicit route reuse.
 * Used as a workaround for https://github.com/angular/angular/issues/18374
 * To reuse a given route, add `data: { reuse: true }` to the route definition.
 */
export class RouteReusableStrategy extends RouteReuseStrategy {
  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  public store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle | null): void { }

  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }

  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    let reuse = false;
    if (future.routeConfig && (future.routeConfig.component.name === 'TipoListComponent' ||
        future.routeConfig.component.name === 'TipoInstanceComponent')) {
      reuse = ( future.routeConfig === curr.routeConfig &&
                future.paramMap === curr.paramMap &&
                future.queryParamMap === curr.queryParamMap);
    } else {
      reuse = future.routeConfig === curr.routeConfig || future.data.reuse;
    }
    // const reuse = (future.routeConfig === curr.routeConfig &&
    //   future.paramMap === curr.paramMap &&
    //   future.queryParamMap === curr.queryParamMap) ||
    //   future.data.reuse;
    return reuse;
  }
}
