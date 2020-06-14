import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KzSelectComponent } from './select.component';

describe('KzSelectComponent', () => {
  let component: KzSelectComponent;
  let fixture: ComponentFixture<KzSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KzSelectComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KzSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
