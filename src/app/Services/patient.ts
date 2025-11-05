import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State } from './user';
import { Patient } from '../Interface/Patient';
import { PatientRequestDto } from '../Interface/PatientDtos';
import { API_CONFIG } from './config';

// ====== Interfaces alineadas con tu backend ======


@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private http = inject(HttpClient);

  // URL base usando la configuración global
  private readonly baseUrl = `${API_CONFIG.BASE_URL}/patients`;

  // GET: api/patients
  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.baseUrl);
  }

  // GET: api/patients/5
  getById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/${id}`);
  }

  // POST: api/patients
  // tu API recibe el DTO, no la entidad completa
  create(dto: PatientRequestDto): Observable<Patient> {
    return this.http.post<Patient>(this.baseUrl, dto);
  }

  // PUT: api/patients/5
  // tu API espera el modelo completo Patient
  update(id: number, patient: Patient): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, patient);
  }

  // DELETE: api/patients/5
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
