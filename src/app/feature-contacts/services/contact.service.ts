import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Contact, ContactFormData } from '../../core/models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/contacts`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) return of([]);
        return throwError(() => new Error('Impossible de charger les contacts.'));
      })
    );
  }

  getContactById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/contacts/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) return throwError(() => new Error('Contact introuvable.'));
        return throwError(() => new Error('Impossible de charger ce contact.'));
      })
    );
  }

  createContact(data: ContactFormData): Observable<Contact> {
    return this.http.post<Contact>(`${this.apiUrl}/contacts`, data).pipe(
      catchError(() => throwError(() => new Error('Impossible de créer ce contact.')))
    );
  }

  updateContact(id: number, data: ContactFormData): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/contacts/${id}`, data).pipe(
      catchError(() => throwError(() => new Error('Impossible de mettre à jour ce contact.')))
    );
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/contacts/${id}`).pipe(
      catchError(() => throwError(() => new Error('Impossible de supprimer ce contact.')))
    );
  }
}
