import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth';

interface LoginRequest {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loading = signal(false);
  error = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const loginData: LoginRequest = {
      email: this.form.value.email!,
      password: this.form.value.password!
    };

    console.log('🚀 Intentando login con:', { email: loginData.email });

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso');
        this.loading.set(false);
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        console.error('❌ Error en login:', error);
        this.loading.set(false);
        
        // Manejar diferentes tipos de errores
        if (error.status === 401 || error.status === 400) {
          this.error.set('Credenciales incorrectas');
        } else if (error.status === 0) {
          this.error.set('No se puede conectar al servidor');
        } else {
          this.error.set('Error al iniciar sesión. Intenta nuevamente.');
        }
      }
    });
  }
}
 