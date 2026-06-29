import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { Contact, ContactFormData } from '../../../core/models/contact.model';
import { FormContactComponent } from '../../components/form-contact/form-contact.component';

@Component({
  selector: 'app-page-edit-contact',
  standalone: true,
  imports: [CommonModule, FormContactComponent],
  templateUrl: './page-edit-contact.component.html',
  styleUrls: ['./page-edit-contact.component.css']
})
export default class PageEditContactComponent implements OnInit {
  contact: Contact | null = null;
  isLoading = false;
  errorMessage = '';

  private contactId!: number;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.contactId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadContact();
  }

  onSubmit(data: ContactFormData): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.contactService.updateContact(this.contactId, data).subscribe({
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

  private loadContact(): void {
    this.contactService.getContactById(this.contactId).subscribe({
      next: (contact) => this.contact = contact,
      error: (err: Error) => this.errorMessage = err.message
    });
  }
}
