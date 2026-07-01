import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
} from '@angular/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Contact, ContactFormData } from '../../../core/models/contact.model';

@Component({
  selector: 'app-form-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormContactComponent {
  private fb = inject(FormBuilder);

  initialData = input<Contact | null>(null);
  isLoading = input<boolean>(false);
  formSubmit = output<ContactFormData>();
  formCancel = output<void>();

  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: [''],
    entreprise_id: [null as number | null],
  });

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) this.form.patchValue(data);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.formSubmit.emit(this.form.getRawValue() as unknown as ContactFormData);
  }
}
