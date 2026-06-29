import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Company } from '../../../core/models/company.model';

@Component({
  selector: 'app-table-companies',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './table-companies.component.html'
})
export class TableCompaniesComponent {
  @Input() companies: Company[] = [];
  @Output() companyDelete = new EventEmitter<number>();
}
