import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Company, CompanyFormData } from '../../../core/models/company.model';

@Component({
  selector: 'app-form-company',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-company.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCompanyComponent {
  private fb = inject(FormBuilder);

  initialData = input<Company | null>(null);
  isLoading = input<boolean>(false);
  formSubmit = output<CompanyFormData>();
  formCancel = output<void>();

  form = this.fb.group({
    nom: ['', Validators.required],
    secteur: [''],
    adresse: [''],
    telephone: [''],
  });

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) this.form.patchValue(data);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.formSubmit.emit(this.form.getRawValue() as unknown as CompanyFormData);
  }
}
