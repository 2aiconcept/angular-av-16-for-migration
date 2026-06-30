import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact, ContactFormData } from '../../../core/models/contact.model';

@Component({
  selector: 'app-form-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-contact.component.html'
})
export class FormContactComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() initialData: Contact | null = null;
  @Input() isLoading = false;
  @Output() formSubmit = new EventEmitter<ContactFormData>();
  @Output() formCancel = new EventEmitter<void>();

  form: FormGroup;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      entreprise_id: [null]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData'] && this.initialData) {
      this.form.patchValue(this.initialData);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.formSubmit.emit(this.form.getRawValue());
  }
}
