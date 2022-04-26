import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgLocalizationComponent } from './ng-localization.component';

describe('NgLocalizationComponent', () => {
  let component: NgLocalizationComponent;
  let fixture: ComponentFixture<NgLocalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgLocalizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgLocalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
