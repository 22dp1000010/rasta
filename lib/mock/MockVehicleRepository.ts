import type { Challan, ComplianceItem, DisputeOutcome, DisputeRecord, Vehicle } from "@/lib/domain/types";
import type { VehicleRepository } from "@/lib/domain/repository";
import { normalizeRegistration } from "@/lib/domain/registration";
import { vehicles } from "./seed";

const latency = Number(process.env.MOCK_LATENCY_MS ?? 250);

export class MockVehicleRepository implements VehicleRepository {
  async findVehicle(registration: string): Promise<Vehicle | null> {
    await wait();
    const normalized = normalizeRegistration(registration);
    return vehicles.find((vehicle) => vehicle.registration === normalized) ?? null;
  }

  async listChallans(vehicleId: string): Promise<Challan[]> {
    await wait();
    return vehicles.find((vehicle) => vehicle.id === vehicleId)?.challans ?? [];
  }

  async getChallan(challanId: string): Promise<Challan | null> {
    await wait();
    return vehicles.flatMap((vehicle) => vehicle.challans).find((challan) => challan.id === challanId) ?? null;
  }

  async listComplianceItems(vehicleId: string): Promise<ComplianceItem[]> {
    await wait();
    return vehicles.find((vehicle) => vehicle.id === vehicleId)?.compliance ?? [];
  }

  async recordDisputeFiled(_challanId: string, _dispute: DisputeRecord): Promise<void> {
    await wait();
  }

  async resolveDispute(_challanId: string, _outcome: DisputeOutcome): Promise<void> {
    await wait();
  }
}

export const mockRepository = new MockVehicleRepository();

function wait(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.min(400, Math.max(150, latency))));
}
