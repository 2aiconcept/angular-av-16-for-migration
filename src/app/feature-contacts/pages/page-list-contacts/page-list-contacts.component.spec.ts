import { ComponentFixture, TestBed } from '@angular/core/testing';
import PageListContactsComponent from './page-list-contacts.component';

describe('PageListContactsComponent', () => {
  let component: PageListContactsComponent;
  let fixture: ComponentFixture<PageListContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageListContactsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PageListContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
