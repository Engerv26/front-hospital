import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-patient-form',
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
  templateUrl: './patient-form.html',
  styleUrls: ['./patient-form.scss'],
})
export class PatientForm {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PatientForm>);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    identification: ['', Validators.required],
    gender: ['Masculino', Validators.required],
    dateOfBirth: [null, Validators.required], // 👈 importante: tipo Date
    address: [''],
    phoneNumber: [''],
    email: ['', Validators.email],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    // data puede ser:
    // - undefined (crear)
    // - un objeto paciente (editar)
    if (data) {
      const patch: any = { ...data };

      // si dateOfBirth viene como string del backend, conviértelo a Date
      if (patch.dateOfBirth && typeof patch.dateOfBirth === 'string') {
        patch.dateOfBirth = new Date(patch.dateOfBirth);
      }

      this.form.patchValue(patch);
    }
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
