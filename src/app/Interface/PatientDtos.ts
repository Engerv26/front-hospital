export interface PatientRequestDto {
  firstName: string;
  lastName: string;
  identification: string;
  dateOfBirth: string;   // en .NET es DateTime → aquí lo mandamos como string ISO
  gender: string;
  address: string;
  phoneNumber: string;
  email: string;
  stateId: number;
}