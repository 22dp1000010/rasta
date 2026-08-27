"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateRegistration } from "@/lib/domain/registration";

const plateToVehicle: Record<string, string> = {
  TS09XX4477: "veh-ts09xx4477",
  KA05XX1120: "veh-ka05xx1120",
  MH12XX8802: "veh-mh12xx8802",
};

export function LookupForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("Try formats like TS09XX4477, TS 09 XX 4477 or TS-09-XX-4477.");

  return (
    <form
      className="field-stack"
      onSubmit={(event) => {
        event.preventDefault();
        const result = validateRegistration(value);
        if (!result.ok) {
          setMessage(result.message);
          return;
        }
        const vehicleId = plateToVehicle[result.registration];
        if (!vehicleId) {
          setMessage("Use one of the fictional demo plates: TS09XX4477, KA05XX1120 or MH12XX8802.");
          return;
        }
        router.push(`/passport/${vehicleId}`);
      }}
    >
      <label htmlFor="registration">Vehicle registration</label>
      <input id="registration" value={value} onChange={(event) => setValue(event.target.value.toUpperCase())} placeholder="TS 09 XX 4477" />
      <p className={message.startsWith("Use one") ? "help error" : "help"}>{message}</p>
      <button className="button primary" type="submit">View passport</button>
    </form>
  );
}
