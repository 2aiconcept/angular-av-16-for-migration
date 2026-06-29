import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Company } from '../../../core/models/company.model';
import { CompanyService } from '../../services/company.service';
import { TableCompaniesComponent } from '../../components/table-companies/table-companies.component';

@Component({
  selector: 'app-page-list-companies',
  standalone: true,
  imports: [CommonModule, RouterLink, TableCompaniesComponent],
  templateUrl: './page-list-companies.component.html',
  styleUrls: ['./page-list-companies.component.css']
})
export default class PageListCompaniesComponent implements OnInit {
  companies$!: Observable<Company[]>;
  errorMessage = '';

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  onDelete(id: number): void {
    this.companyService.deleteCompany(id).subscribe({
      next: () => this.loadCompanies(),
      error: (err: Error) => this.errorMessage = err.message
    });
  }

  private loadCompanies(): void {
    this.errorMessage = '';
    this.companies$ = this.companyService.getCompanies();
  }
}
