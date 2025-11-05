import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';   // 👈 para *ngIf, *ngFor
import { RouterModule, RouterOutlet } from '@angular/router';

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

  isLogin: boolean = true; // cámbialo a false para probar

  login() {
    this.isLogin = true;
  }

  logout() {
    this.isLogin = false;
  }
}
