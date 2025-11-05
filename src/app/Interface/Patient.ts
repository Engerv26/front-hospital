
import { AppointmentLite } from "./AppointmentLite";
import { State } from "./State";

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  identification: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phoneNumber: string;
  email: string;
  stateId: number;
  state?: State;
  appointments?: AppointmentLite[];
}
