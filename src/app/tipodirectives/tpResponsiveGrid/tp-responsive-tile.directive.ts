import { Directive, Input, OnInit } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { MatGridTile } from '@angular/material';


export interface IResponsiveTileMap {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

@Directive({
  selector: '[tpResponsiveTile]'
})
export class TpResponsiveTileDirective implements OnInit {

  private colspanBySize: IResponsiveTileMap = { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 };
  private rowspanBySize: IResponsiveTileMap = { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 };

  public get colspan(): IResponsiveTileMap {
    return this.colspanBySize;
  }

  @Input('tpResponsiveColspan')
  public set colspan(map: IResponsiveTileMap) {
    if (map && ('object' === (typeof map))) {
      this.colspanBySize = map;
    }
  }

  public get rowspan(): IResponsiveTileMap {
    return this.rowspanBySize;
  }

  @Input('tpResponsiveRowspan')
  public set rowspan(map: IResponsiveTileMap) {
    if (map && ('object' === (typeof map))) {
      this.rowspanBySize = map;
    }
  }


  constructor(
    private tile: MatGridTile,
    private media: ObservableMedia
  ) {
    this.initializeColsCount();
  }

  ngOnInit() {
    this.initializeColsCount();

    this.media.asObservable()
      .subscribe((changes: MediaChange) => {
        this.tile.colspan = this.colspanBySize[changes.mqAlias];
        this.tile.rowspan = this.rowspanBySize[changes.mqAlias];
      }
      );
  }

  private initializeColsCount(): void {
    Object.keys(this.colspanBySize).some(
      (mqAlias: string): boolean => {
        const isActive = this.media.isActive(mqAlias);

        if (isActive) {
          this.tile.colspan = this.colspanBySize[mqAlias];
          this.tile.rowspan = this.rowspanBySize[mqAlias];
        }

        return isActive;
      });
  }
}
