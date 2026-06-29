import { ComponentFixture, TestBed } from '@angular/core/testing';
import PageEditContactComponent from './page-edit-contact.component';

describe('PageEditContactComponent', () => {
  let component: PageEditContactComponent;
  let fixture: ComponentFixture<PageEditContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageEditContactComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PageEditContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
