import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { UserService, User, UserRequestDto } from '../../Services/user';
import { UserForm } from '../../Components/user-form/user-form';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.scss']
})
export class UserList implements OnInit {

  users: User[] = [];
  isLoading = false;

  constructor(
    private dialog: MatDialog,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    console.log('UserList ngOnInit -> cargando usuarios...');
    this.loadUsers();
  }

  // 🟢 Cargar usuarios desde la base de datos
  loadUsers() {
    this.isLoading = true;

    this.userService.getAll().subscribe({
      next: (data: any) => {
        console.log('Respuesta cruda de API (user):', data);

        // Aseguramos que SIEMPRE sea un array, por si .NET envía algo raro
        if (Array.isArray(data)) {
          this.users = data;
        } else if (Array.isArray(data?.$values)) {
          this.users = data.$values;          // típico de listas .NET
        } else if (Array.isArray(data?.data)) {
          this.users = data.data;             // típico { data:[], total:X }
        } else {
          console.warn('Formato de respuesta no reconocido, dejando users = []');
          this.users = [];
        }

        console.log('this.users normalizado:', this.users);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.isLoading = false;
      }
    });
  }

  openForm(user?: User) {
    const dialogRef = this.dialog.open(UserForm, {
      width: '520px',
      disableClose: true,
      data: user ?? null
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      if (!user) {
        // CREAR
        const dto: UserRequestDto = {
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          password: result.password,
          phoneNumber: result.phoneNumber,
          stateId: result.stateId,
          userTypeId: result.userTypeId,
          departmenId: result.departmenId
        };

        this.userService.create(dto).subscribe({
          next: () => {
            this.loadUsers();   // recargar tabla
          },
          error: (err) => console.error('Error al crear usuario:', err)
        });
      } else {
        // EDITAR
        const updated: User = {
          ...user,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          password: result.password || user.password,
          phoneNumber: result.phoneNumber,
          stateId: result.stateId,
          userTypeId: result.userTypeId,
          departmenId: result.departmenId
        };

        this.userService.update(user.id, updated).subscribe({
          next: () => {
            this.loadUsers();
          },
          error: (err) => console.error('Error al actualizar usuario:', err)
        });
      }
    });
  }

  deleteUser(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    this.userService.delete(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
      },
      error: (err) => console.error('Error al eliminar usuario:', err)
    });
  }
}
