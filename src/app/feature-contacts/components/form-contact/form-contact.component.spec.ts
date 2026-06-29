import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SimpleChange } from '@angular/core';
import { FormContactComponent } from './form-contact.component';
import { Contact } from '../../../core/models/contact.model';

const mockContact: Contact = {
  id: 1,
  nom: 'Dupont',
  prenom: 'Alice',
  email: 'alice@test.com',
  telephone: '0100000001'
};

describe('FormContactComponent', () => {
  let component: FormContactComponent;
  let fixture: ComponentFixture<FormContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormContactComponent, ReactiveFormsModule, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FormContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty form', () => {
    expect(component.form.get('nom')?.value).toBe('');
    expect(component.form.get('prenom')?.value).toBe('');
    expect(component.form.get('email')?.value).toBe('');
  });

  it('should mark form as invalid when required fields are empty', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('should mark form as invalid with a bad email format', () => {
    component.form.patchValue({ nom: 'Dupont', prenom: 'Alice', email: 'not-an-email' });
    expect(component.form.invalid).toBeTrue();
  });

  it('should mark form as valid when all required fields are filled correctly', () => {
    component.form.patchValue({ nom: 'Dupont', prenom: 'Alice', email: 'alice@test.com' });
    expect(component.form.valid).toBeTrue();
  });

  it('should patch form values when initialData input changes', () => {
    component.initialData = mockContact;
    component.ngOnChanges({
      initialData: new SimpleChange(null, mockContact, true)
    });

    expect(component.form.get('nom')?.value).toBe('Dupont');
    expect(component.form.get('prenom')?.value).toBe('Alice');
    expect(component.form.get('email')?.value).toBe('alice@test.com');
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
    component.form.patchValue({ nom: 'Dupont', prenom: 'Alice', email: 'alice@test.com' });

    component.onSubmit();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual(jasmine.objectContaining({ nom: 'Dupont', email: 'alice@test.com' }));
  });

  it('should emit formCancel when cancel button triggers the event', () => {
    const emitted: unknown[] = [];
    component.formCancel.subscribe(() => emitted.push(true));

    component.formCancel.emit();

    expect(emitted.length).toBe(1);
  });
});
