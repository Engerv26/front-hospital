import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  loading = signal(false);
  error = signal('');

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    // 🔁 simulación de login (aquí luego llamas a tu API .NET)
    setTimeout(() => {
      this.loading.set(false);

      const user = this.form.value.username;
      const pass = this.form.value.password;

      // demo: cualquier usuario con cualquier pass entra
      if (user && pass) {
        // guardamos algo para que el app sepa que está logueado
        localStorage.setItem('auth', 'true');
        this.router.navigateByUrl('/home');
      } else {
        this.error.set('Credenciales inválidas');
      }
    }, 500);

} }
 