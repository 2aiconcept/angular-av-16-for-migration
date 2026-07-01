import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
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
  private companyService = inject(CompanyService);

  companies = this.companyService.companies;
  isLoading = this.companyService.isLoading;
  errorMessage = this.companyService.error;

  ngOnInit(): void {
    this.companyService.load();
  }

  onDelete(id: number): void {
    this.companyService.remove(id);
  }
}
