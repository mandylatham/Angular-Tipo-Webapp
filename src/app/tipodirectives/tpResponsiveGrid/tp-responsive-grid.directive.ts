import { Directive, Input, OnInit } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { MatGridList } from '@angular/material';


export interface IResponsiveGridMap {
  xs?: string | number;
  sm?: string | number;
  md?: string | number;
  lg?: string | number;
  xl?: string | number;
}

@Directive({
  selector: '[tpResponsiveGrid]'
})
export class TpResponsiveGridDirective implements OnInit {
  private colsBySize: IResponsiveGridMap = { xs: 2, sm: 2, md: 4, lg: 6, xl: 8 };
  private gutterBySize: IResponsiveGridMap = { xs: '2px', sm: '2px', md: '2px', lg: '2px', xl: '2px' };
  private rowHeightBySize: IResponsiveGridMap = { xs: '20px', sm: '20px', md: '20px', lg: '20px', xl: '20px' };

  public get cols(): IResponsiveGridMap {
    return this.colsBySize;
  }

  @Input('tpResponsiveCols')
  public set cols(map: IResponsiveGridMap) {
    if (map && ('object' === (typeof map))) {
      this.colsBySize = map;
    }
  }

  public get rowHeight(): IResponsiveGridMap {
    return this.rowHeightBySize;
  }

  @Input('tpResponsiveRowHeight')
  public set rowHeight(map: IResponsiveGridMap) {
    if (map && ('object' === (typeof map))) {
      this.rowHeightBySize = map;
    }
  }

  public get gutterSize(): IResponsiveGridMap {
    return this.rowHeightBySize;
  }

  @Input('tpResponsiveGutterSize')
  public set gutterSize(map: IResponsiveGridMap) {
    if (map && ('object' === (typeof map))) {
      this.gutterBySize = map;
    }
  }

  constructor(
    private grid: MatGridList,
    private media: ObservableMedia
  ) {
    this.initializeColsCount();
  }

  ngOnInit() {
    this.initializeColsCount();

    this.media.asObservable()
      .subscribe((changes: MediaChange) => {
        this.grid.cols = this.colsBySize[changes.mqAlias];
        this.grid.rowHeight = this.rowHeightBySize[changes.mqAlias];
        this.grid.gutterSize = this.gutterBySize[changes.mqAlias];
      }
      );
  }

  private initializeColsCount(): void {
    Object.keys(this.colsBySize).some(
      (mqAlias: string): boolean => {
        const isActive = this.media.isActive(mqAlias);

        if (isActive) {
          this.grid.cols = this.colsBySize[mqAlias];
          this.grid.rowHeight = this.rowHeightBySize[mqAlias];
          this.grid.gutterSize = this.gutterBySize[mqAlias];
        }

        return isActive;
      });
  }

}
