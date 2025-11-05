import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './department-form.html',
  styleUrl: './department-form.scss',
})
export class DepartmentForm {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<DepartmentForm>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (data?.department) {
      // si estamos editando, rellenamos el form
      this.form.patchValue({
        name: data.department.name
      });
    }
  }

  form = this.fb.group({
    name: ['', Validators.required]
  });

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
