import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { RouterLink } from '@angular/router';
import { Contact } from '../../../core/models/contact.model';

@Component({
  selector: 'app-table-contacts',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './table-contacts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableContactsComponent {
  contacts = input<Contact[]>([]);
  contactDelete = output<number>();
}
