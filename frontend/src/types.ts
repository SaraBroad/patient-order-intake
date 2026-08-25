export interface Order {
  id: number;
  patient_first_name: string;
  patient_last_name: string;
  patient_date_of_birth: string;
  source_filename: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderUpdatePayload {
  patient_first_name?: string;
  patient_last_name?: string;
  patient_date_of_birth?: string;
}

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface Feedback {
  variant: "success" | "error";
  message: string;
}
