import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Contact } from '../../../core/models/contact.model';
import { ContactService } from '../../services/contact.service';
import { TableContactsComponent } from '../../components/table-contacts/table-contacts.component';

@Component({
  selector: 'app-page-list-contacts',
  standalone: true,
  imports: [RouterLink, TableContactsComponent],
  templateUrl: './page-list-contacts.component.html',
  styleUrls: ['./page-list-contacts.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageListContactsComponent implements OnInit {
  contacts = signal<Contact[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  private contactService = inject(ContactService);

  ngOnInit(): void {
    this.loadContacts();
  }

  onDelete(id: number): void {
    this.contactService.deleteContact(id).subscribe({
      next: () => this.loadContacts(),
      error: (err: Error) => this.errorMessage.set(err.message),
    });
  }

  private loadContacts(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.contactService.getContacts().subscribe({
      next: (list) => {
        this.contacts.set(list);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      },
    });
  }
}
