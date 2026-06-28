import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageListCompaniesComponent } from './page-list-companies.component';

describe('PageListCompaniesComponent', () => {
  let component: PageListCompaniesComponent;
  let fixture: ComponentFixture<PageListCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PageListCompaniesComponent]
    });
    fixture = TestBed.createComponent(PageListCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
