import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpBooleanButtonsComponent } from './tpBooleanButtons.component';

describe('tpBooleanButtons', () => {
  let component: TpBooleanButtonsComponent;
  let fixture: ComponentFixture<TpBooleanButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpBooleanButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpBooleanButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
