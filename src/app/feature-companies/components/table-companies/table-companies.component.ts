import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnInit
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { Company } from '../../../core/models/company.model';

@Component({
  selector: 'app-table-companies',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './table-companies.component.html',
})
export class TableCompaniesComponent implements OnChanges, OnInit {
  @Input() companies: Company[] = [];
  @Output() companyDelete = new EventEmitter<number>();

  ngOnChanges() {
    console.log('ng on changes calldes');
    console.log(this.companies);
  }

  ngOnInit() {
    console.log('ng on init calldes');
    console.log(this.companies);
  }
}
