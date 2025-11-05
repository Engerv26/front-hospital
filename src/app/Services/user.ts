import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ====== Interfaces alineadas con tu backend ======

// DTO que tu API recibe en POST
export interface UserRequestDto {
  id?: number;                // el API lo genera, opcional aquí
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  stateId: number;
  userTypeId: number;
  departmenId: number;
}

// Entidades de navegación
export interface State {
  id: number;
  name: string;
}

export interface UserType {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  stateId: number;
  state?: State;
  userTypeId: number;
  userType?: UserType;
  departmenId: number;
  department?: Department;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  // cámbiala por el puerto real de tu API
  private readonly baseUrl = 'https://localhost:7031/api/user';

  // ========== USERS ==========

  // GET: api/user
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  // GET: api/user/5
  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  // POST: api/user
  create(dto: UserRequestDto): Observable<User> {
    return this.http.post<User>(this.baseUrl, dto);
  }

  // PUT: api/user/5
  update(id: number, user: User): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, user);
  }

  // DELETE: api/user/5
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ========== USERTYPES ==========

  // GET: api/user/UserType
  getAllUserTypes(): Observable<UserType[]> {
    return this.http.get<UserType[]>(`${this.baseUrl}/UserType`);
  }

  // ========== DEPARTMENTS ==========

  // GET: api/user/Departmen  (ojo: sin "t", tal como está en el controller)
  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/Departmen`);
  }

  // GET: api/user/Department/5
  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}/Department/${id}`);
  }

  // POST: api/user/Department
  createDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(`${this.baseUrl}/Department`, department);
  }

  // PUT: api/user/Department/5
  updateDepartment(id: number, department: Department): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Department/${id}`, department);
  }

  // DELETE: api/user/Department/5
  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Department/${id}`);
  }
}
