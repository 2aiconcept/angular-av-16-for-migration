import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { TableCompaniesComponent } from './table-companies.component';
import { Company } from '../../../core/models/company.model';

const mockCompanies: Company[] = [
  { id: 1, nom: 'Acme', secteur: 'Tech', adresse: '1 rue test', telephone: '0100000001' },
  { id: 2, nom: 'Globex', secteur: undefined, adresse: undefined, telephone: undefined }
];

describe('TableCompaniesComponent', () => {
  let component: TableCompaniesComponent;
  let fixture: ComponentFixture<TableCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCompaniesComponent, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TableCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a row for each company', () => {
    component.companies = mockCompanies;
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('should display "—" for missing optional fields', () => {
    component.companies = [mockCompanies[1]];
    fixture.detectChanges();

    const cells = fixture.nativeElement.querySelectorAll('tbody td');
    expect(cells[1].textContent.trim()).toBe('—');
  });

  it('should display empty state row when companies is empty', () => {
    component.companies = [];
    fixture.detectChanges();

    const emptyRow = fixture.nativeElement.querySelector('tbody td[colspan="5"]');
    expect(emptyRow).toBeTruthy();
    expect(emptyRow.textContent.trim()).toBe('Aucune entreprise trouvée.');
  });

  it('should emit companyDelete with company id when delete button is clicked', () => {
    component.companies = mockCompanies;
    fixture.detectChanges();

    const emittedIds: number[] = [];
    component.companyDelete.subscribe((id: number) => emittedIds.push(id));

    const deleteButtons = fixture.nativeElement.querySelectorAll('button');
    deleteButtons[0].click();

    expect(emittedIds).toEqual([1]);
  });
});
