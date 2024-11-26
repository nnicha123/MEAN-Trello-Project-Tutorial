import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterRequestInterface } from '../../types/registerRequest.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  form;
  errorMessage: string | null = null;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    console.log('Submit', this.form.value);
    this.authService
      .register(this.form.value as RegisterRequestInterface)
      .subscribe({
        next: (currentUser) => {
          console.log(currentUser);
          this.authService.setToken(currentUser);
          this.authService.setCurrentUser(currentUser);
          this.errorMessage = null;
          this.router.navigateByUrl('/');
        },
        error: (err: HttpErrorResponse) => {
          console.log(err.error);
          this.errorMessage = err.error.join(', ');
        },
      });
  }
}
