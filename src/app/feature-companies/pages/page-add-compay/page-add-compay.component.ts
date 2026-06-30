import { Component, inject } from '@angular/core';

import { Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { CompanyFormData } from '../../../core/models/company.model';
import { FormCompanyComponent } from '../../components/form-company/form-company.component';

@Component({
  selector: 'app-page-add-compay',
  standalone: true,
  imports: [FormCompanyComponent],
  templateUrl: './page-add-compay.component.html',
  styleUrls: ['./page-add-compay.component.css']
})
export default class PageAddCompayComponent {
  private companyService = inject(CompanyService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  onSubmit(data: CompanyFormData): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.companyService.createCompany(data).subscribe({
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
}
