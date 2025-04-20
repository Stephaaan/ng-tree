import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgTreeLibComponent } from './treeview.component';

describe('NgTreeLibComponent', () => {
  let component: NgTreeLibComponent;
  let fixture: ComponentFixture<NgTreeLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgTreeLibComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgTreeLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
