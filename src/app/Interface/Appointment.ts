export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  stateId: number;
  departmenId: number;
  appointmentDate: string;
  reason: string;
  notes: string;
  // opcionales porque vienen anidados del backend
  patient?: any;
  doctor?: any;
  state?: any;
  department?: any;
  schedules?: any[];
}