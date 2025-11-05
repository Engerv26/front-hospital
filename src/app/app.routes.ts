import { Routes } from '@angular/router';
import { Home } from './Pages/home/home';
import { Login } from './Pages/login/login';
import { DepartmentList } from './Pages/department-list/department-list';
import { PatientList } from './Pages/patient-list/patient-list';
import { UserList } from './Pages/user-list/user-list';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'home', component: Home },
  { path: 'patient', component: PatientList },   // ✅ ahora sí es un componente
  { path: 'login', component: Login },
  { path: 'department', component: DepartmentList },
  { path: 'user', component: UserList },         // mejor en minúscula
  { path: '**', redirectTo: '/home' }
];
