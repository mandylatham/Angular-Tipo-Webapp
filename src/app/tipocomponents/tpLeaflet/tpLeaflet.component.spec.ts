import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpLeafletComponent } from './tpLeaflet.component';

describe('TpLeafletComponent', () => {
  let component: TpLeafletComponent;
  let fixture: ComponentFixture<TpLeafletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpLeafletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpLeafletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
