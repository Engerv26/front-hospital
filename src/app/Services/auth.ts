import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_CONFIG } from './config';

// Interfaces para el login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface DecodedToken {
  exp: number;
  iat: number;
  email?: string;
  userId?: string;
  userType?: string;
  // Agrega más campos según tu token JWT
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private readonly baseUrl = `${API_CONFIG.BASE_URL}/AuthControllers`;
  private readonly TOKEN_KEY = 'hospital_jwt_token';
  
  // Subject para manejar el estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // 🌐 Verificar si estamos en el navegador (no en SSR)
  private get isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  constructor() {
    // Verificar token al inicializar solo si estamos en el navegador
    if (this.isBrowser) {
      const isValid = this.hasValidToken();
      this.isAuthenticatedSubject.next(isValid);
      this.checkTokenValidity();
    }
  }

  // 🔑 Login del usuario
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            this.setToken(response.token);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  // 🚪 Logout del usuario
  logout(): void {
    this.removeToken();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  // 💾 Guardar token en localStorage
  private setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  // 🔍 Obtener token del localStorage
  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // 🗑️ Remover token del localStorage
  private removeToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  // ✅ Verificar si hay un token válido
  hasValidToken(): boolean {
    // En SSR, no hay tokens válidos
    if (!this.isBrowser) {
      return false;
    }

    const token = this.getToken();
    if (!token) return false;

 return true;
  }

  // 🔓 Decodificar token JWT
  private decodeToken(token: string): DecodedToken {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  // 🕐 Verificar validez del token actual
  private checkTokenValidity(): void {
    if (!this.hasValidToken()) {
      this.removeToken();
      this.isAuthenticatedSubject.next(false);
    }
  }

  // 👤 Obtener información del usuario desde el token
  getCurrentUser(): DecodedToken | null {
    // En SSR, no hay usuario actual
    if (!this.isBrowser) {
      return null;
    }

    const token = this.getToken();
    if (!token || !this.hasValidToken()) return null;

    try {
      return this.decodeToken(token);
    } catch (error) {
      return null;
    }
  }

  // 🔄 Verificar si está autenticado (método síncrono)
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }
}