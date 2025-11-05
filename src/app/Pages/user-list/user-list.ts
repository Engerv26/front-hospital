import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('UserList ngOnInit -> cargando usuarios...');
    this.loadUsers();
  }

  // 🟢 Cargar usuarios desde la base de datos
  loadUsers(): void {
    this.isLoading = true;
    console.log('🟢 Iniciando carga de usuarios...');

    this.userService.getAll().subscribe({
      next: (data: any) => {
        console.log('📦 Respuesta cruda de API:', data);
        console.log('📦 Tipo de respuesta:', typeof data);
        console.log('📦 Es array?:', Array.isArray(data));
        
        // Manejo flexible de la respuesta
        let users: User[] = [];
        if (Array.isArray(data)) {
          users = data;
        } else if (data && Array.isArray(data.$values)) {
          users = data.$values;
        } else if (data && Array.isArray(data.data)) {
          users = data.data;
        } else if (data && typeof data === 'object') {
          // Si es un objeto único, lo convertimos en array
          users = [data];
        }
        console.log('✅ aqui llego');
        console.log('✅ Usuarios procesados:', users);
        console.log('✅ Total usuarios:', users.length);
        
        this.users = users;
        
        // Usamos setTimeout para evitar ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('❌ Error al cargar usuarios:', err);
        this.users = [];
        
        // Usamos setTimeout para evitar ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  // 🔄 Forzar recarga de datos (limpia caché)
  forceReloadUsers() {
    console.log('🔄 Forzando recarga de usuarios...');
    this.loadUsers();
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
          next: (created: User) => {
            console.log('Usuario creado:', created);
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
            console.log('Usuario actualizado');
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
