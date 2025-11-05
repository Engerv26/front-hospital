import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PatientForm } from '../../Components/patient-form/patient-form';
import { PatientService } from '../../Services/patient';
import { Patient } from '../../Interface/Patient';
import { PatientRequestDto } from '../../Interface/PatientDtos';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './patient-list.html',
  styleUrls: ['./patient-list.scss']
})
export class PatientList implements OnInit {

  patients: Patient[] = [];
  selectedPatient: Patient | null = null;

  constructor(
    private dialog: MatDialog,
    private patientService: PatientService,
    private cdr: ChangeDetectorRef          // 👈 inyectamos ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('PatientList ngOnInit -> cargando pacientes...');
    this.loadPatients();
  }

  // 🟢 Cargar pacientes desde la base de datos
  loadPatients() {
    this.patientService.getAll().subscribe({
      next: (data: Patient[]) => {
        console.log('Pacientes cargados desde API:', data);
        this.patients = data || [];

        // 👇 forzamos la actualización de la vista
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar pacientes:', err);
      }
    });
  }

  // 🟢 Seleccionar paciente para ver detalles
  selectPatient(p: Patient) {
    this.selectedPatient = p;
  }

  clearSelection() {
    this.selectedPatient = null;
  }

  // 🟢 Abrir formulario para crear paciente
  openForm() {
    const dialogRef = this.dialog.open(PatientForm, {
      width: '480px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      const dto: PatientRequestDto = {
        firstName: result.firstName,
        lastName: result.lastName,
        identification: result.identification,
        dateOfBirth: result.dateOfBirth instanceof Date
          ? result.dateOfBirth.toISOString()
          : result.dateOfBirth,
        gender: result.gender,
        address: result.address,
        phoneNumber: result.phoneNumber,
        email: result.email,
        stateId: 1 // activo por defecto
      };

      // 🔹 Crear paciente en la base de datos
      this.patientService.create(dto).subscribe({
        next: (created: Patient) => {
          // opción 1: solo agregar a la lista
          // this.patients.push(created);

          // opción 2 (más segura): recargar todo desde la BD
          this.loadPatients();

          // si usas opción 1, forzarías la vista así:
          // this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al crear paciente:', err);
        }
      });
    });
  }

  // 🟢 Eliminar paciente
  deletePatient(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este paciente?')) return;

    this.patientService.delete(id).subscribe({
      next: () => {
        this.patients = this.patients.filter(p => p.id !== id);
        this.cdr.detectChanges();   // 👈 mantenemos la tabla actualizada
      },
      error: (err) => {
        console.error('Error al eliminar paciente:', err);
      }
    });
  }
}
