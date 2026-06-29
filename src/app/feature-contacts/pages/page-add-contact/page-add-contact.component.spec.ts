import { ComponentFixture, TestBed } from '@angular/core/testing';
import PageAddContactComponent from './page-add-contact.component';

describe('PageAddContactComponent', () => {
  let component: PageAddContactComponent;
  let fixture: ComponentFixture<PageAddContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageAddContactComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PageAddContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
