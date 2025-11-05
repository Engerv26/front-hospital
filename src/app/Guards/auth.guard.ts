import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../Services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean | UrlTree {
    console.log('🛡️ AuthGuard: Verificando autenticación...');
    
    if (this.authService.isAuthenticated()) {
      console.log('✅ Usuario autenticado, permitiendo acceso');
      return true;
    }

    console.log('❌ Usuario no autenticado, redirigiendo a login');
    return this.router.createUrlTree(['/login']);
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean | UrlTree {
    console.log('🛡️ LoginGuard: Verificando si debe acceder a login...');
    
    if (!this.authService.isAuthenticated()) {
      console.log('✅ Usuario no autenticado, permitiendo acceso a login');
      return true;
    }

    console.log('❌ Usuario ya autenticado, redirigiendo a home');
    return this.router.createUrlTree(['/home']);
  }
}