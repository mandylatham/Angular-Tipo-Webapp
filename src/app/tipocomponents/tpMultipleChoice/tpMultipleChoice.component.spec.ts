import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpMultipleChoiceComponent } from './tpMultipleChoice.component';

describe('tpMultipleChoiceComponent', () => {
  let component: TpMultipleChoiceComponent;
  let fixture: ComponentFixture<TpMultipleChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpMultipleChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpMultipleChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
