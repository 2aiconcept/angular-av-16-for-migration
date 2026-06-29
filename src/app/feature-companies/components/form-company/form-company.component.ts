import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company, CompanyFormData } from '../../../core/models/company.model';

@Component({
  selector: 'app-form-company',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-company.component.html'
})
export class FormCompanyComponent implements OnChanges {
  @Input() initialData: Company | null = null;
  @Input() isLoading = false;
  @Output() formSubmit = new EventEmitter<CompanyFormData>();
  @Output() formCancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      secteur: [''],
      adresse: [''],
      telephone: ['']
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
