import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { UserService, UserType, Department, User } from '../../Services/user';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UserForm>);
  private userService = inject(UserService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: User | null) {
    if (data) {
      // estamos editando → precargamos el formulario
      this.form.patchValue({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: '', // vacía, el usuario puede cambiarla o no
        phoneNumber: data.phoneNumber,
        stateId: data.stateId,
        userTypeId: data.userTypeId,
        departmenId: data.departmenId
      });
    }
  }

  // estados aún fijos (no tienes endpoint de State)
  states = [
    { id: 1, name: 'Activo' },
    { id: 2, name: 'Inactivo' }
  ];

  userTypes: UserType[] = [];
  departments: Department[] = [];

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    // 👇 ya NO es requerido, así puedes editar sin cambiar la contraseña
    password: [''],
    phoneNumber: [''],
    stateId: [1, Validators.required],
    userTypeId: [1, Validators.required],
    departmenId: [1, Validators.required],
  });

  ngOnInit(): void {
    this.loadUserTypes();
    this.loadDepartments();
  }

  private loadUserTypes(): void {
    this.userService.getAllUserTypes().subscribe({
      next: (types) => {
        this.userTypes = types || [];
      },
      error: (err) => {
        console.error('Error al cargar tipos de usuario:', err);
      }
    });
  }

  private loadDepartments(): void {
    this.userService.getAllDepartments().subscribe({
      next: (deps) => {
        this.departments = deps || [];
      },
      error: (err) => {
        console.error('Error al cargar departamentos:', err);
      }
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
