import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
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
  private contactService = inject(ContactService);

  contacts = this.contactService.contacts;
  isLoading = this.contactService.isLoading;
  errorMessage = this.contactService.error;

  ngOnInit(): void {
    this.contactService.load();
  }

  onDelete(id: number): void {
    this.contactService.remove(id);
  }
}
