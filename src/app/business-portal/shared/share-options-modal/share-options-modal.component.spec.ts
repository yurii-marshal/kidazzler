import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareOptionsModalComponent } from './share-options-modal.component';

describe('ShareOptionsModalComponent', () => {
  let component: ShareOptionsModalComponent;
  let fixture: ComponentFixture<ShareOptionsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShareOptionsModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
