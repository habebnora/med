export interface Medication {
  id: string;
  name: string;
  dosage: string;
  timesPerDay: number;
  firstDoseTime: string;
}

export interface TreatmentPlan {
  id: string;
  name: string;
  startDate: string;
  durationDays: number;
  medications: Medication[];
}

export interface Dose {
  id: string;
  planId: string;
  planName: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  time: string;
  date: string;
  taken: boolean;
}
