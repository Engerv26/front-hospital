import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../Interface/Appointment';
import { AppointmentDto } from '../Interface/AppointmentDto';

// -------------------------
// Interfaces según tu backend
// -------------------------


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private http = inject(HttpClient);

  // 👇 URL base como variable global dentro del service
  // cambia el puerto por el de tu API
  private readonly baseUrl = 'https://localhost:7031/api/appointments';

  // GET: api/appointments
  getAll(): Observable<Appointment[]> {
    var r= this.http.get<Appointment[]>(this.baseUrl);
    console.log (r);
    return r;
  }

  // GET: api/appointments/5
  getById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.baseUrl}/${id}`);
  }

  // POST: api/appointments
  // aquí usamos el DTO que usa tu controlador (AppointmentDtos)
  create(dto: AppointmentDto): Observable<Appointment> {
    return this.http.post<Appointment>(this.baseUrl, dto);
  }

  // PUT: api/appointments/5
  // tu API espera el modelo completo (Appointment), no el DTO
  update(id: number, appointment: Appointment): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, appointment);
  }

  // DELETE: api/appointments/5
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
