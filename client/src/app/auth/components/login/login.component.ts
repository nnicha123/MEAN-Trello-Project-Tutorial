import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequestInterface } from '../../types/LoginRequest.interface';
import { CurrentUserInterface } from '../../types/currentUser.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { SocketService } from '../../../shared/services/socket.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnDestroy {
  form;
  errorMessage: string | null = null;
  unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private socketService: SocketService
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit() {
    this.authService
      .login(this.form.value as LoginRequestInterface)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (currentUser: CurrentUserInterface) => {
          this.authService.setToken(currentUser);
          this.socketService.setupSocketConnection(currentUser);
          this.authService.setCurrentUser(currentUser);
          this.errorMessage = null;
          this.router.navigateByUrl('/');
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error.emailOrPassword;
        },
      });
  }
}
