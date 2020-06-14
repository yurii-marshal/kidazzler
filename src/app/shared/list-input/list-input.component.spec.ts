import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KzListInputComponent } from './list-input.component';

describe('KzListInputComponent', () => {
  let component: KzListInputComponent;
  let fixture: ComponentFixture<KzListInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KzListInputComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KzListInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
