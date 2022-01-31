import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarsiteComponent } from './navbarsite.component';

describe('NavbarsiteComponent', () => {
  let component: NavbarsiteComponent;
  let fixture: ComponentFixture<NavbarsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarsiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
