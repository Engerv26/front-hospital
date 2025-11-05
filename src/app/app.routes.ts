import { Routes } from '@angular/router';
import { Home } from './Pages/home/home';
import { Login } from './Pages/login/login';
import { DepartmentList } from './Pages/department-list/department-list';
import { PatientList } from './Pages/patient-list/patient-list';
import { UserList } from './Pages/user-list/user-list';
import { AuthGuard, LoginGuard } from './Services/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: Login,
    canActivate: [LoginGuard]  // Solo permite entrar si NO está autenticado
  },
  { 
    path: 'home', 
    component: Home,
    canActivate: [AuthGuard]   // Solo permite entrar si ESTÁ autenticado
  },
  { 
    path: 'patient', 
    component: PatientList,
    canActivate: [AuthGuard]
  },
  { 
    path: 'department', 
    component: DepartmentList,
    canActivate: [AuthGuard]
  },
  { 
    path: 'user', 
    component: UserList,
    canActivate: [AuthGuard]
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];
