import { Component, OnInit, Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';

@Component({
  selector: 'tp-snack-bar',
  templateUrl: './tp-snack-bar.component.html',
  styleUrls: ['./tp-snack-bar.component.css']
})
export class TpSnackBarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
