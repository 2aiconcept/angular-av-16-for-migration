import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SimpleChange } from '@angular/core';
import { FormCompanyComponent } from './form-company.component';
import { Company } from '../../../core/models/company.model';

const mockEntreprise: Company = {
  id: 1,
  nom: 'Acme',
  secteur: 'Tech',
  adresse: '1 rue test',
  telephone: '0100000001'
};

describe('FormCompanyComponent', () => {
  let component: FormCompanyComponent;
  let fixture: ComponentFixture<FormCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCompanyComponent, ReactiveFormsModule, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty form', () => {
    expect(component.form.get('nom')?.value).toBe('');
    expect(component.form.get('secteur')?.value).toBe('');
  });

  it('should mark form as invalid when nom is empty', () => {
    component.form.patchValue({ nom: '' });
    expect(component.form.invalid).toBeTrue();
  });

  it('should mark form as valid when nom is filled', () => {
    component.form.patchValue({ nom: 'Acme' });
    expect(component.form.valid).toBeTrue();
  });

  it('should patch form values when initialData input changes', () => {
    component.initialData = mockEntreprise;
    component.ngOnChanges({
      initialData: new SimpleChange(null, mockEntreprise, true)
    });

    expect(component.form.get('nom')?.value).toBe('Acme');
    expect(component.form.get('secteur')?.value).toBe('Tech');
  });

  it('should not emit formSubmit when form is invalid', () => {
    const emitted: unknown[] = [];
    component.formSubmit.subscribe(v => emitted.push(v));

    component.onSubmit();

    expect(emitted.length).toBe(0);
  });

  it('should emit formSubmit with form values when form is valid', () => {
    const emitted: unknown[] = [];
    component.formSubmit.subscribe(v => emitted.push(v));
    component.form.patchValue({ nom: 'Acme', secteur: 'Tech' });

    component.onSubmit();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual(jasmine.objectContaining({ nom: 'Acme', secteur: 'Tech' }));
  });

  it('should emit formCancel when cancel is triggered', () => {
    const emitted: unknown[] = [];
    component.formCancel.subscribe(() => emitted.push(true));

    component.formCancel.emit();

    expect(emitted.length).toBe(1);
  });
});
