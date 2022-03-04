import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DominatingSolverHomeComponent } from './dominating-solver-home.component';

describe('DominatingSolverHomeComponent', () => {
  let component: DominatingSolverHomeComponent;
  let fixture: ComponentFixture<DominatingSolverHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DominatingSolverHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DominatingSolverHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
