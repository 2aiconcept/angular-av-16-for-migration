import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Contact, ContactFormData } from '../../core/models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/contacts`;

  private readonly contactsSignal = signal<Contact[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly isLoadingSignal = signal(false);

  readonly contacts = this.contactsSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();

  load(): void {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    this.http.get<Contact[]>(this.apiUrl).subscribe({
      next: (list) => {
        this.contactsSignal.set(list);
        this.isLoadingSignal.set(false);
      },
      error: () => {
        this.errorSignal.set('Impossible de charger les contacts.');
        this.isLoadingSignal.set(false);
      },
    });
  }

  remove(id: number): void {
    this.errorSignal.set(null);
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () =>
        this.contactsSignal.update((list) =>
          list.filter((contact) => contact.id !== id)
        ),
      error: () =>
        this.errorSignal.set('Impossible de supprimer le contact.'),
    });
  }

  getContactById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404)
          return throwError(() => new Error('Contact introuvable.'));
        return throwError(() =>
          new Error('Impossible de charger ce contact.')
        );
      })
    );
  }

  createContact(data: ContactFormData): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, data).pipe(
      catchError(() =>
        throwError(() => new Error('Impossible de créer ce contact.'))
      )
    );
  }

  updateContact(id: number, data: ContactFormData): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, data).pipe(
      catchError(() =>
        throwError(() =>
          new Error('Impossible de mettre à jour ce contact.')
        )
      )
    );
  }
}
