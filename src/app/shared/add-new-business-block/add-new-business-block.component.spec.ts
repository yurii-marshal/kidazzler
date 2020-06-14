import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewBusinessBlockComponent } from './add-new-business-block.component';

describe('AddNewBusinessBlockComponent', () => {
  let component: AddNewBusinessBlockComponent;
  let fixture: ComponentFixture<AddNewBusinessBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewBusinessBlockComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewBusinessBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
