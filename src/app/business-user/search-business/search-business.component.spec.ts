import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBusinessComponent } from './search-business.component';

describe('SearchBusinessComponent', () => {
  let component: SearchBusinessComponent;
  let fixture: ComponentFixture<SearchBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
