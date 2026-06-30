import { Component, OnInit, inject } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { Company, CompanyFormData } from '../../../core/models/company.model';
import { FormCompanyComponent } from '../../components/form-company/form-company.component';

@Component({
  selector: 'app-page-edit-company',
  standalone: true,
  imports: [FormCompanyComponent],
  templateUrl: './page-edit-company.component.html',
  styleUrls: ['./page-edit-company.component.css']
})
export default class PageEditCompanyComponent implements OnInit {
  private companyService = inject(CompanyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  company: Company | null = null;
  isLoading = false;
  errorMessage = '';

  private companyId!: number;

  ngOnInit(): void {
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCompany();
  }

  onSubmit(data: CompanyFormData): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.companyService.updateCompany(this.companyId, data).subscribe({
      next: () => this.router.navigate(['/companies']),
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/companies']);
  }

  private loadCompany(): void {
    this.companyService.getCompanyById(this.companyId).subscribe({
      next: (company) => this.company = company,
      error: (err: Error) => this.errorMessage = err.message
    });
  }
}
