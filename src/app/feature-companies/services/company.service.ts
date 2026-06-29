import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Company, CompanyFormData } from '../../core/models/company.model';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/entreprises`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) return of([]);
        return throwError(() => new Error('Impossible de charger les entreprises.'));
      })
    );
  }

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/entreprises/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) return throwError(() => new Error('Entreprise introuvable.'));
        return throwError(() => new Error('Impossible de charger cette entreprise.'));
      })
    );
  }

  createCompany(data: CompanyFormData): Observable<Company> {
    return this.http.post<Company>(`${this.apiUrl}/entreprises`, data).pipe(
      catchError(() => throwError(() => new Error('Impossible de créer cette entreprise.')))
    );
  }

  updateCompany(id: number, data: CompanyFormData): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/entreprises/${id}`, data).pipe(
      catchError(() => throwError(() => new Error('Impossible de mettre à jour cette entreprise.')))
    );
  }

  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/entreprises/${id}`).pipe(
      catchError(() => throwError(() => new Error('Impossible de supprimer cette entreprise.')))
    );
  }
}
