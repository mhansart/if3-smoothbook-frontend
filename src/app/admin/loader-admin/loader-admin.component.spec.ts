import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderAdminComponent } from './loader-admin.component';

describe('LoaderAdminComponent', () => {
  let component: LoaderAdminComponent;
  let fixture: ComponentFixture<LoaderAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
