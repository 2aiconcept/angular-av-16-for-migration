import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEditCompanyComponent } from './page-edit-company.component';

describe('PageEditCompanyComponent', () => {
  let component: PageEditCompanyComponent;
  let fixture: ComponentFixture<PageEditCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PageEditCompanyComponent]
    });
    fixture = TestBed.createComponent(PageEditCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
