import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { SocketService } from './shared/services/socket.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  constructor(
    private authService: AuthService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.authService
      .getCurrentUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (currentUser) => {
          this.authService.setCurrentUser(currentUser);
          this.socketService.setupSocketConnection(currentUser);
        },
        error: (err) => {
          console.log('err', err);
          this.authService.setCurrentUser(null);
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
