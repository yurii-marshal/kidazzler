import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckYourEmailComponent } from './check-your-email.component';

describe('CheckYourEmailComponent', () => {
  let component: CheckYourEmailComponent;
  let fixture: ComponentFixture<CheckYourEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckYourEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckYourEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
