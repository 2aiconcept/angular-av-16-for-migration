import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAddCompayComponent } from './page-add-compay.component';

describe('PageAddCompayComponent', () => {
  let component: PageAddCompayComponent;
  let fixture: ComponentFixture<PageAddCompayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PageAddCompayComponent]
    });
    fixture = TestBed.createComponent(PageAddCompayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
