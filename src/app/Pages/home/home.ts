import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

import { AppointmentService } from '../../Services/appointment';
import { Appointment } from '../../Interface/Appointment';
import { AppointmentDto } from '../../Interface/AppointmentDto';
import { AppointmentForm } from '../../Components/appointment-form/appointment-form';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
}

interface User {
  id: number;
  fullName: string;
}

interface State {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {

  private dialog = inject(MatDialog);
  private appointmentService = inject(AppointmentService);
  private cdr = inject(ChangeDetectorRef);

  // por ahora vacíos, luego los puedes llenar desde la API
  patients: Patient[] = [];
  doctors: User[] = [];
  states: State[] = [];
  departments: Department[] = [];

  appointments: Appointment[] = [];
  loading = false;

  ngOnInit(): void {
    console.log('Home ngOnInit -> cargando citas...');
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;

    this.appointmentService.getAll().subscribe({
      next: (data: Appointment[]) => {
        console.log('Citas recibidas desde la API:', data);

        this.appointments = (data || []).map(a => ({
          id: a.id,
          patientId: a.patientId,
          patient: a.patient ?? {
            id: a.patientId,
            firstName: '—',
            lastName: ''
          },
          doctorId: a.doctorId,
          doctor: a.doctor ?? {
            id: a.doctorId,
            fullName: '—'
          },
          appointmentDate: a.appointmentDate,
          reason: a.reason,
          notes: a.notes,
          stateId: a.stateId,
          state: a.state ?? { id: a.stateId, name: 'Programada' },
          departmenId: a.departmenId,
          department: a.department ?? { id: a.departmenId, name: '—' },
          schedules: a.schedules ?? []
        }));

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        this.loading = false;
        if (err instanceof HttpErrorResponse) {
          console.error('Error HTTP cargando citas:', err.status, err.message);
        } else {
          console.error('Error desconocido cargando citas:', err);
        }
      }
    });
  }

  // 🟢 Crear nueva cita
  openForm() {
    this.openAppointmentDialog(); // sin parámetro = crear
  }

  // 🟢 Editar cita existente
  editAppointment(appointment: Appointment) {
    this.openAppointmentDialog(appointment);
  }

  // 🧠 Función reutilizada para crear / editar
  private openAppointmentDialog(appointment?: Appointment) {
    const dialogRef = this.dialog.open(AppointmentForm, {
      width: '520px',
      disableClose: true,
      data: {
        patients: this.patients,
        doctors: this.doctors,
        states: this.states,
        departments: this.departments,
        appointment // puede venir undefined o con datos
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const onlyDate = (result.appointmentDate as string).split('T')[0];

      if (!appointment) {
        // 👉 CREAR
        const dto: AppointmentDto = {
          patientId: result.patientId,
          doctorId: result.doctorId,
          stateId: result.stateId,
          departmenId: result.departmenId,
          appointmentDate: onlyDate,
          reason: result.reason,
          notes: result.notes,
          schedulesIds: []
        };

        this.appointmentService.create(dto).subscribe({
          next: () => {
            this.loadAppointments(); // recargar lista
          },
          error: (err: unknown) => {
            if (err instanceof HttpErrorResponse) {
              console.error('Error HTTP creando cita:', err.status, err.message);
            } else {
              console.error('Error creando cita:', err);
            }
          }
        });
      } else {
        // 👉 EDITAR
        const updated: Appointment = {
          ...appointment,
          patientId: result.patientId,
          doctorId: result.doctorId,
          stateId: result.stateId,
          departmenId: result.departmenId,
          appointmentDate: onlyDate,
          reason: result.reason,
          notes: result.notes
        };

        this.appointmentService.update(appointment.id, updated).subscribe({
          next: () => {
            this.loadAppointments(); // recargamos todo para mantener sincronizado
          },
          error: (err: unknown) => {
            if (err instanceof HttpErrorResponse) {
              console.error('Error HTTP actualizando cita:', err.status, err.message);
            } else {
              console.error('Error actualizando cita:', err);
            }
          }
        });
      }
    });
  }

  // 🗑 Eliminar cita
  deleteAppointment(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta cita?')) return;

    this.appointmentService.delete(id).subscribe({
      next: () => {
        this.appointments = this.appointments.filter(a => a.id !== id);
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        if (err instanceof HttpErrorResponse) {
          console.error('Error HTTP eliminando cita:', err.status, err.message);
        } else {
          console.error('Error eliminando cita:', err);
        }
      }
    });
  }
}
