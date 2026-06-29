import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-page-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './page-auth.component.html',
  styleUrls: ['./page-auth.component.css']
})
export default class PageAuthComponent {
  isSignInMode = true;
  isLoading = false;
  errorMessage = '';

  signInForm: FormGroup;
  signUpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.signUpForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  switchMode(): void {
    this.isSignInMode = !this.isSignInMode;
    this.errorMessage = '';
    this.signInForm.reset();
    this.signUpForm.reset();
  }

  onSignIn(): void {
    if (this.signInForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.signInForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/companies']),
      error: () => {
        this.errorMessage = 'Email ou mot de passe incorrect.';
        this.isLoading = false;
      }
    });
  }

  onSignUp(): void {
    if (this.signUpForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.signUpForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/companies']),
      error: () => {
        this.errorMessage = 'Une erreur est survenue lors de la création du compte.';
        this.isLoading = false;
      }
    });
  }
}
