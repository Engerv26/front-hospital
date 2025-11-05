import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { DepartmentForm } from '../../Components/department-form/department-form';
import { UserService, Department } from '../../Services/user';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './department-list.html',
  styleUrls: ['./department-list.scss'],
})
export class DepartmentList implements OnInit {

  departments: Department[] = [];

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('DepartmentList ngOnInit -> cargando departamentos...');
    this.loadDepartments();
  }

  // 🟢 Cargar todos los departamentos desde la API
  loadDepartments(): void {
    this.userService.getAllDepartments().subscribe({
      next: (data: Department[]) => {
        console.log('Departamentos cargados desde API:', data);
        this.departments = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar departamentos:', err);
      }
    });
  }

  // 🟢 Crear nuevo departamento
  openForm() {
    this.openDepartmentDialog(); // sin parámetro = crear
  }

  // 🟢 Editar departamento existente
  editDepartment(department: Department) {
    this.openDepartmentDialog(department);
  }

  // 🧠 Función genérica para crear / editar
  private openDepartmentDialog(department?: Department) {
    const dialogRef = this.dialog.open(DepartmentForm, {
      width: '400px',
      disableClose: true,
      data: {
        department // puede venir undefined o con datos
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      if (!department) {
        // 👉 CREAR
        const newDepartment: Department = {
          id: 0,              // lo asigna el backend
          name: result.name
        };

        this.userService.createDepartment(newDepartment).subscribe({
          next: (created: Department) => {
            // recargamos para mantenernos sincronizados
            this.loadDepartments();
          },
          error: (err) => {
            console.error('Error al crear departamento:', err);
          }
        });
      } else {
        // 👉 ACTUALIZAR
        const updated: Department = {
          ...department,
          name: result.name
        };

        this.userService.updateDepartment(department.id, updated).subscribe({
          next: () => {
            // recargamos la lista para ver el cambio
            this.loadDepartments();
          },
          error: (err) => {
            console.error('Error al actualizar departamento:', err);
          }
        });
      }
    });
  }
}
