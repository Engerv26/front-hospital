import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

// Guard para proteger rutas que requieren autenticación
export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔒 AuthGuard - Verificando acceso...');

  if (authService.hasValidToken()) {
    console.log('✅ AuthGuard - Usuario autenticado, permitiendo acceso');
    return true;
  }

  console.log('❌ AuthGuard - Usuario no autenticado, redirigiendo a login');
  router.navigate(['/login']);
  return false;
};

// Guard para evitar que usuarios autenticados accedan al login
export const LoginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔓 LoginGuard - Verificando si ya está logueado...');

  if (authService.hasValidToken()) {
    console.log('✅ LoginGuard - Usuario ya autenticado, redirigiendo a home');
    router.navigate(['/home']);
    return false;
  }

  console.log('✅ LoginGuard - Usuario no autenticado, permitiendo acceso al login');
  return true;
};