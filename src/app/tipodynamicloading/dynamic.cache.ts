import {
  Injectable,
  Inject,
  NgZone,
  ModuleWithComponentFactories
} from '@angular/core';

@Injectable()
export class DynamicCache {

  private memoryCache = new Map<string, Promise<ModuleWithComponentFactories<any>>>();

  constructor(@Inject(NgZone) ngZone: NgZone) {
    /**
     * Notifies when code enters Angular Zone. This gets fired first on VM Turn.
     */
    ngZone.onUnstable.subscribe(() => this.memoryCache.clear());

    /**
     * Notifies when the last `onMicrotaskEmpty` has run and there are no more microtasks, which
     * implies we are about to relinquish VM turn.
     * This event gets called just once.
     */
    ngZone.onStable.subscribe(() => this.memoryCache.clear());
  }

  public set(key: string, value: Promise<ModuleWithComponentFactories<any>>) {
    this.memoryCache.set(key, value);
  }

  public get(key: string): Promise<ModuleWithComponentFactories<any>> {
    return this.memoryCache.get(key);
  }
}
