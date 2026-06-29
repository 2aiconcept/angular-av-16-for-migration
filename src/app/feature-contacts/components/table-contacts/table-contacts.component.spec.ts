import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TableContactsComponent } from './table-contacts.component';
import { Contact } from '../../../core/models/contact.model';

const mockContacts: Contact[] = [
  { id: 1, nom: 'Dupont', prenom: 'Alice', email: 'alice@test.com', telephone: '0100000001' },
  { id: 2, nom: 'Martin', prenom: 'Bob', email: 'bob@test.com', telephone: undefined }
];

describe('TableContactsComponent', () => {
  let component: TableContactsComponent;
  let fixture: ComponentFixture<TableContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableContactsComponent, CommonModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TableContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a row for each contact', () => {
    component.contacts = mockContacts;
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('should display "—" for missing telephone', () => {
    component.contacts = [mockContacts[1]];
    fixture.detectChanges();

    const cells = fixture.nativeElement.querySelectorAll('tbody td');
    expect(cells[3].textContent.trim()).toBe('—');
  });

  it('should display empty state row when contacts is empty', () => {
    component.contacts = [];
    fixture.detectChanges();

    const emptyRow = fixture.nativeElement.querySelector('tbody td[colspan="5"]');
    expect(emptyRow).toBeTruthy();
    expect(emptyRow.textContent.trim()).toBe('Aucun contact trouvé.');
  });

  it('should emit contactDelete with contact id when delete button is clicked', () => {
    component.contacts = mockContacts;
    fixture.detectChanges();

    const emittedIds: number[] = [];
    component.contactDelete.subscribe((id: number) => emittedIds.push(id));

    const deleteButtons = fixture.nativeElement.querySelectorAll('button');
    deleteButtons[0].click();

    expect(emittedIds).toEqual([1]);
  });
});
