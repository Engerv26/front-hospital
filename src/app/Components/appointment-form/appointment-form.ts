import { Component, Inject, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { UserService, User, Department } from '../../Services/user';
import { PatientService } from '../../Services/patient';
import { Patient } from '../../Interface/Patient';
import { AppointmentService } from '../../Services/appointment';

// Interfaz para Schedule basada en la respuesta real
export interface Schedule {
  id: number;
  time: string;  // Formato "HH:MM" como "00:00", "00:30", etc.
}

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.scss',
})
export class AppointmentForm implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AppointmentForm>);
  private userService = inject(UserService);
  private patientService = inject(PatientService);
  private appointmentService = inject(AppointmentService);
  private cdr = inject(ChangeDetectorRef);

  // Listas para los selects
  patients: Patient[] = [];
  doctors: User[] = [];
  departments: Department[] = [];
  schedules: Schedule[] = [];
  states = [
    { id: 1, name: 'Activo' },
    { id: 2, name: 'Inactivo' }
  ];

  // Control de carga
  isLoading = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.loadData();

    // Si viene una cita para editar, llenamos el formulario después de cargar los datos
    if (this.data?.appointment) {
      const ap = this.data.appointment;
      this.form.patchValue({
        patientId: ap.patientId,
        doctorId: ap.doctorId,
        appointmentDate: this.toDateOnly(ap.appointmentDate),
        reason: ap.reason,
        notes: ap.notes,
        stateId: ap.stateId,
        departmenId: ap.departmenId,
        schedulesIds: ap.schedulesIds || []
      });
    }
  }

  form = this.fb.group({
    patientId: [null, Validators.required],
    doctorId: [null, Validators.required],
    appointmentDate: [null as Date | null, Validators.required],
    reason: ['', Validators.required],
    notes: [''],
    stateId: [1, Validators.required],
    departmenId: [null, Validators.required],
    schedulesIds: [[], Validators.required]  // Array de IDs de schedules
  });

  // 🔄 Cargar todos los datos necesarios para los selects
  loadData(): void {
    console.log('🔄 Cargando datos para formulario de citas...');
    console.log('🔄 isLoading inicial =', this.isLoading);
    this.isLoading = true;

    let completedRequests = 0;
    const totalRequests = 4;  // Ahora son 4 requests: pacientes, usuarios, departamentos y schedules

    const checkCompletion = () => {
      completedRequests++;
      console.log(`✅ Request completado ${completedRequests}/${totalRequests}`);
      if (completedRequests === totalRequests) {
        console.log('✅ Todos los datos cargados');
        // Usar setTimeout para evitar ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
          console.log('✅ UI actualizada, isLoading =', this.isLoading);
        });
      }
    };

    // Cargar pacientes
    console.log('🚀 Iniciando carga de pacientes...');
    this.patientService.getAll().subscribe({
      next: (patients) => {
        console.log('✅ Pacientes cargados:', patients);
        // Manejar respuesta (puede ser array o objeto único)
        if (Array.isArray(patients)) {
          this.patients = patients;
        } else if (patients && typeof patients === 'object') {
          this.patients = [patients];
        } else {
          this.patients = [];
        }
        console.log('✅ Pacientes procesados:', this.patients.length);
        checkCompletion();
      },
      error: (err) => {
        console.error('❌ Error al cargar pacientes:', err);
        this.patients = [];
        checkCompletion();
      }
    });

    // Cargar todos los usuarios y filtrar doctores (userTypeId = 2)
    console.log('🚀 Iniciando carga de usuarios...');
    this.userService.getAll().subscribe({
      next: (users) => {
        console.log('✅ Usuarios cargados:', users);
        // Manejar respuesta (puede ser array o objeto único)
        let allUsers: User[] = [];
        if (Array.isArray(users)) {
          allUsers = users;
        } else if (users && typeof users === 'object') {
          allUsers = [users];
        }

        // Filtrar solo doctores (userTypeId = 2)
        this.doctors = allUsers.filter(user => user.userTypeId === 2);
        console.log('✅ Doctores filtrados:', this.doctors.length);
        checkCompletion();
      },
      error: (err) => {
        console.error('❌ Error al cargar usuarios/doctores:', err);
        this.doctors = [];
        checkCompletion();
      }
    });

    // Cargar departamentos
    console.log('🚀 Iniciando carga de departamentos...');
    this.userService.getAllDepartments().subscribe({
      next: (departments) => {
        console.log('✅ Departamentos cargados:', departments);
        // Manejar respuesta (puede ser array o objeto único)
        if (Array.isArray(departments)) {
          this.departments = departments;
        } else if (departments && typeof departments === 'object') {
          this.departments = [departments];
        } else {
          this.departments = [];
        }
        console.log('✅ Departamentos procesados:', this.departments.length);
        checkCompletion();
      },
      error: (err) => {
        console.error('❌ Error al cargar departamentos:', err);
        this.departments = [];
        checkCompletion();
      }
    });

    // Cargar schedules
    console.log('🚀 Iniciando carga de schedules...');
    this.appointmentService.getAllSchedules().subscribe({
      next: (schedules) => {
        console.log('✅ Schedules cargados:', schedules);
        // Manejar respuesta (puede ser array o objeto único)
        if (Array.isArray(schedules)) {
          this.schedules = schedules;
        } else if (schedules && typeof schedules === 'object') {
          this.schedules = [schedules];
        } else {
          this.schedules = [];
        }
        console.log('✅ Schedules procesados:', this.schedules.length);
        checkCompletion();
      },
      error: (err) => {
        console.error('❌ Error al cargar schedules:', err);
        this.schedules = [];
        checkCompletion();
      }
    });
  }

  private toDateOnly(dateStr: string | null | undefined): Date | null {
    if (!dateStr) return null;
    try {
      return new Date(dateStr);
    } catch (error) {
      console.error('Error al convertir fecha:', error);
      return null;
    }
  }



  save() {
    if (this.form.valid) {
      const formData = this.form.value;
      
      // Formatear la fecha para el backend (YYYY-MM-DD)
      let formattedDate = '';
      if (formData.appointmentDate) {
        const date = formData.appointmentDate as Date;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
      }
      
      // Formatear los datos según el JSON requerido por el backend
      const appointmentData = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        stateId: formData.stateId,
        departmenId: formData.departmenId,
        appointmentDate: formattedDate,
        reason: formData.reason,
        notes: formData.notes,
        schedulesIds: formData.schedulesIds || []
      };

      console.log('📤 Datos de cita a enviar:', appointmentData);
      this.dialogRef.close(appointmentData);
    } else {
      this.form.markAllAsTouched();
      console.log('❌ Formulario inválido:', this.form.errors);
    }
  }

  close() {
    this.dialogRef.close();
  }

}
