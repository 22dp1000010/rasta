export type DisputeGround =
  | "PLATE_MISREAD"
  | "NOT_DRIVING"
  | "WRONG_LOCATION_TIME"
  | "VEHICLE_SOLD"
  | "APPEARS_VALID"
  | "UNCLEAR";

export type Severity = "good" | "warn" | "bad";
export type DisputeOutcome = "pending" | "upheld" | "rejected";

export interface ComplianceItem {
  id: string;
  label: string;
  status: string;
  validUntil?: string;
  severity: Severity;
  renewedEarly: boolean;
}

export interface Challan {
  id: string;
  vehicleId: string;
  kind: string;
  violation: string;
  location: string;
  issuedAt: string;
  amount: number;
  status: "open" | "paid" | "disputed" | "resolved";
  groundHint: DisputeGround;
  cameraPlate: string;
  registeredPlate: string;
  actionDueAt: string;
  footageDueAt: string;
  sampleStoryEn: string;
  sampleStoryHi: string;
}

export interface Vehicle {
  id: string;
  registration: string;
  ownerName: string;
  modelClass: string;
  city: string;
  notes?: string;
  cleanMonths: number;
  compliance: ComplianceItem[];
  challans: Challan[];
  events: PassportEvent[];
}

export interface ClassificationResult {
  ground: DisputeGround;
  confidence: number;
  reasoning: string;
  evidenceNeeded: string[];
  clarifyingQuestion: string | null;
  provider: "model" | "rules";
}

export interface DraftBundle {
  grievanceLetter: string;
  recordRequest: string;
  provider: "model" | "rules";
}

export interface DisputeRecord {
  challanId: string;
  ground: DisputeGround;
  filedAt: string;
}

export interface PassportEvent {
  type: "clean_month" | "document_lapsed" | "challan_pending" | "violation_upheld" | "dispute_upheld";
  at: string;
}
