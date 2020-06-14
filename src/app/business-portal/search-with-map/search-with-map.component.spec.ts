import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchWithMapComponent } from './search-with-map.component';

describe('SearchWithMapComponent', () => {
  let component: SearchWithMapComponent;
  let fixture: ComponentFixture<SearchWithMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchWithMapComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchWithMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
