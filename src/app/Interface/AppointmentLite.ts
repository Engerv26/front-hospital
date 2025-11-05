import { State } from "./State";

export interface AppointmentLite {
  id: number;
  reason: string;
  state?: State;
}

