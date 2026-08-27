import type { Challan, ComplianceItem, DisputeOutcome, DisputeRecord, Vehicle } from "./types";

export interface VehicleRepository {
  findVehicle(registration: string): Promise<Vehicle | null>;
  listChallans(vehicleId: string): Promise<Challan[]>;
  getChallan(challanId: string): Promise<Challan | null>;
  listComplianceItems(vehicleId: string): Promise<ComplianceItem[]>;
  recordDisputeFiled(challanId: string, dispute: DisputeRecord): Promise<void>;
  resolveDispute(challanId: string, outcome: DisputeOutcome): Promise<void>;
}
