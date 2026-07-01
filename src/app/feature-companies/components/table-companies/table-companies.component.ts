import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { Company } from '../../../core/models/company.model';

@Component({
  selector: 'app-table-companies',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './table-companies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCompaniesComponent {
  companies = input<Company[]>([]);
  companyDelete = output<number>();

  effect() {
    console.log('effect', this.companies());
  }

  ngOnChanges() {
    console.log('ng on changes', this.companies());
  }
}
