import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';   // 👈 para *ngIf, *ngFor
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './Services/auth';

@Component({
  selector: 'app-root',
  standalone: true,                               // 👈 importantísimo
  imports: [
    CommonModule,                                 // 👈 habilita *ngIf
    RouterModule,                                 // 👈 habilita routerLink, router-outlet
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']                       // 👈 plural y array
})
export class App {
  protected readonly title = signal('Sistema Hospitalario');

  constructor(protected authService: AuthService) {}

  // Getter para verificar si el usuario está autenticado
  get isLogin(): boolean {
    return this.authService.hasValidToken();
  }

  // Getter para obtener información del usuario
  get currentUser() {
    return this.authService.getCurrentUser();
  }

  logout() {
    console.log('🚪 Cerrando sesión...');
    this.authService.logout();
  }
}
