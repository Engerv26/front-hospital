import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  console.log('🔌 HTTP Interceptor - Procesando solicitud:', req.url);

  // Si no hay token válido, continúa sin modificar
  if (!authService.hasValidToken()) {
    console.log('⚠️ HTTP Interceptor - No hay token válido');
    return next(req);
  }

  // Obtiene el token
  const token = authService.getToken();
  if (!token) {
    console.log('⚠️ HTTP Interceptor - No se pudo obtener el token');
    return next(req);
  }

  // Clona la solicitud y añade el header Authorization
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log('🔐 HTTP Interceptor - Token añadido a la solicitud');
  return next(authReq);
};