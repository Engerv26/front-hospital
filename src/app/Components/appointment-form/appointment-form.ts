import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

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
    MatButtonModule
  ],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.scss',
})
export class AppointmentForm {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AppointmentForm>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    // Si viene una cita para editar, llenamos el formulario
    if (data?.appointment) {
      const ap = data.appointment;
      this.form.patchValue({
        patientId: ap.patientId,
        doctorId: ap.doctorId,
        appointmentDate: this.toDateTimeLocal(ap.appointmentDate),
        reason: ap.reason,
        notes: ap.notes,
        stateId: ap.stateId,
        departmenId: ap.departmenId
      });
    }
  }

  form = this.fb.group({
    patientId: [null, Validators.required],
    doctorId: [null, Validators.required],
    appointmentDate: ['', Validators.required],
    reason: ['', Validators.required],
    notes: [''],
    stateId: [1, Validators.required],
    departmenId: [null, Validators.required]
  });

  private toDateTimeLocal(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    // si viene '2025-11-03T09:30:00', lo dejamos en '2025-11-03T09:30'
    return dateStr.toString().slice(0, 16);
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
