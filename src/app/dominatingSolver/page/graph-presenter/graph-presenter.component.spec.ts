import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphPresenterComponent } from './graph-presenter.component';

describe('GraphPresenterComponent', () => {
  let component: GraphPresenterComponent;
  let fixture: ComponentFixture<GraphPresenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphPresenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphPresenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
