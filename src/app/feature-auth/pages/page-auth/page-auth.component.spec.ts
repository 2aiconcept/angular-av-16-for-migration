import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PageAuthComponent } from './page-auth.component';
import { AuthService } from '../../../core/services/auth.service';
import { of, throwError } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PageAuthComponent', () => {
  let component: PageAuthComponent;
  let fixture: ComponentFixture<PageAuthComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'register']);

    await TestBed.configureTestingModule({
    imports: [PageAuthComponent,
        ReactiveFormsModule,
        RouterTestingModule],
    providers: [{ provide: AuthService, useValue: authServiceSpy }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(PageAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start in sign-in mode', () => {
    expect(component.isSignInMode).toBeTrue();
  });

  it('should switch to sign-up mode when switchMode is called', () => {
    component.switchMode();
    expect(component.isSignInMode).toBeFalse();
  });

  it('should reset forms and error message when switching mode', () => {
    component.errorMessage = 'Une erreur';
    component.signInForm.patchValue({ email: 'test@test.com', password: '123' });

    component.switchMode();

    expect(component.errorMessage).toBe('');
    expect(component.signInForm.get('email')?.value).toBeNull();
  });

  it('should not call login when sign-in form is invalid', () => {
    component.onSignIn();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should call login with form values on valid sign-in', () => {
    authServiceSpy.login.and.returnValue(of({ token: 'jwt', user: { id: 1, email: 'user@test.com', nom: 'Doe', prenom: 'John', role: 'user' } }));
    component.signInForm.patchValue({ email: 'user@test.com', password: 'password123' });

    component.onSignIn();

    expect(authServiceSpy.login).toHaveBeenCalledWith({ email: 'user@test.com', password: 'password123' });
  });

  it('should display error message on login failure', () => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Unauthorized')));
    component.signInForm.patchValue({ email: 'user@test.com', password: 'wrong' });

    component.onSignIn();

    expect(component.errorMessage).toBe('Email ou mot de passe incorrect.');
    expect(component.isLoading).toBeFalse();
  });
});
