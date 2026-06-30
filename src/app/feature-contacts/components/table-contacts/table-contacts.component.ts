import { Component, Input, Output, EventEmitter } from '@angular/core';

import { RouterLink } from '@angular/router';
import { Contact } from '../../../core/models/contact.model';

@Component({
  selector: 'app-table-contacts',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './table-contacts.component.html'
})
export class TableContactsComponent {
  @Input() contacts: Contact[] = [];
  @Output() contactDelete = new EventEmitter<number>();
}
