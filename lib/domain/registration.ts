export function normalizeRegistration(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function validateRegistration(value: string): { ok: true; registration: string } | { ok: false; message: string } {
  const registration = normalizeRegistration(value);
  if (!/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/.test(registration)) {
    return {
      ok: false,
      message: "Use a format like TS09XX4477, TS 09 XX 4477 or TS-09-XX-4477.",
    };
  }
  return { ok: true, registration };
}
