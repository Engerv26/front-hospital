export interface AppointmentDto {
  patientId: number;
  doctorId: number;
  stateId: number;
  departmenId: number;
  appointmentDate: string;      // en .NET es DateOnly, aquí lo mandamos string ISO
  reason: string;
  notes: string;
  schedulesIds: number[];
}