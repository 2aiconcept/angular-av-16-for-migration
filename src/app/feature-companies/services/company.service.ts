import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Company, CompanyFormData } from '../../core/models/company.model';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/entreprises`;

  private readonly companiesSignal = signal<Company[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly isLoadingSignal = signal(false);

  readonly companies = this.companiesSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();

  load(): void {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    this.http.get<Company[]>(this.apiUrl).subscribe({
      next: (list) => {
        this.companiesSignal.set(list);
        this.isLoadingSignal.set(false);
      },
      error: () => {
        this.errorSignal.set('Impossible de charger les entreprises.');
        this.isLoadingSignal.set(false);
      },
    });
  }

  remove(id: number): void {
    this.errorSignal.set(null);
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () =>
        this.companiesSignal.update((list) =>
          list.filter((company) => company.id !== id)
        ),
      error: () =>
        this.errorSignal.set("Impossible de supprimer l'entreprise."),
    });
  }

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404)
          return throwError(() => new Error('Entreprise introuvable.'));
        return throwError(() =>
          new Error('Impossible de charger cette entreprise.')
        );
      })
    );
  }

  createCompany(data: CompanyFormData): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, data).pipe(
      catchError(() =>
        throwError(() => new Error('Impossible de créer cette entreprise.'))
      )
    );
  }

  updateCompany(id: number, data: CompanyFormData): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${id}`, data).pipe(
      catchError(() =>
        throwError(() =>
          new Error('Impossible de mettre à jour cette entreprise.')
        )
      )
    );
  }
}
