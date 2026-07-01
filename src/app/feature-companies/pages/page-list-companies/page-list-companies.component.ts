import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Company } from '../../../core/models/company.model';
import { CompanyService } from '../../services/company.service';
import { TableCompaniesComponent } from '../../components/table-companies/table-companies.component';

@Component({
  selector: 'app-page-list-companies',
  standalone: true,
  imports: [RouterLink, TableCompaniesComponent],
  templateUrl: './page-list-companies.component.html',
  styleUrls: ['./page-list-companies.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageListCompaniesComponent implements OnInit {
  companies = signal<Company[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  private companyService = inject(CompanyService);

  ngOnInit(): void {
    this.loadCompanies();
  }

  onDelete(id: number): void {
    this.companyService.deleteCompany(id).subscribe({
      next: () => this.loadCompanies(),
      error: (err: Error) => this.errorMessage.set(err.message),
    });
  }

  private loadCompanies(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.companyService.getCompanies().subscribe({
      next: (list) => {
        this.companies.set(list);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      },
    });
  }
}
