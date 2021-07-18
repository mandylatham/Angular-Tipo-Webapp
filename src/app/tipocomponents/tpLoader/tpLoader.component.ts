import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tp-loader',
  templateUrl: './tpLoader.component.html',
  styleUrls: ['./tpLoader.component.scss']
})
export class TpLoaderComponent implements OnInit {
  @Input()
  isLoading = false;
  @Input()
  size = 1;
  @Input()
  message: string;
  @Input()
  spinnerColor = 'white';

  constructor() { }

  ngOnInit() { }
}
