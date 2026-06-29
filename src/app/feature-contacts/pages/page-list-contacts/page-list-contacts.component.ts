import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from '../../../core/models/contact.model';
import { ContactService } from '../../services/contact.service';
import { TableContactsComponent } from '../../components/table-contacts/table-contacts.component';

@Component({
  selector: 'app-page-list-contacts',
  standalone: true,
  imports: [CommonModule, RouterLink, TableContactsComponent],
  templateUrl: './page-list-contacts.component.html',
  styleUrls: ['./page-list-contacts.component.css']
})
export default class PageListContactsComponent implements OnInit {
  contacts$!: Observable<Contact[]>;
  errorMessage = '';

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  onDelete(id: number): void {
    this.contactService.deleteContact(id).subscribe({
      next: () => this.loadContacts(),
      error: (err: Error) => this.errorMessage = err.message
    });
  }

  private loadContacts(): void {
    this.errorMessage = '';
    this.contacts$ = this.contactService.getContacts();
  }
}
