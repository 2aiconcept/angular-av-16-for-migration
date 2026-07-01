import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Router } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { ContactFormData } from '../../../core/models/contact.model';
import { FormContactComponent } from '../../components/form-contact/form-contact.component';

@Component({
  selector: 'app-page-add-contact',
  standalone: true,
  imports: [FormContactComponent],
  templateUrl: './page-add-contact.component.html',
  styleUrls: ['./page-add-contact.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageAddContactComponent {
  private contactService = inject(ContactService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  onSubmit(data: ContactFormData): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.contactService.createContact(data).subscribe({
      next: () => this.router.navigate(['/contacts']),
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/contacts']);
  }
}
