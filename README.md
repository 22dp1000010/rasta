# Rasta

Rasta is a citizen-first prototype for the Build What Moves India challenge. It helps a vehicle owner understand a fictional e-challan, classify the likely dispute ground, see deadline clocks, prepare editable paperwork and simulate the result.

## Live Demo

[https://rasta-jade.vercel.app/]

## Run

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verify

```powershell
npm run verify
```

## Demo vehicles

| Vehicle | What it demonstrates |
| --- | --- |
| `TS09XX4477` | Plate misread, deadline clocks, draft and streak restore |
| `KA05XX1120` | Sold vehicle with transfer not completed |
| `MH12XX8802` | Clean compliance record and proposed rewards |

## Mock credentials

The main journey works without login. These are shown on `/login` only for submission-form completeness.

| Purpose | Username | Password |
| --- | --- | --- |
| Primary demo | `demo@rasta.test` | `RastaDemo#2026` |
| Sold-vehicle case | `seller@rasta.test` | `RastaDemo#2026` |
| Clean record | `clean@rasta.test` | `RastaDemo#2026` |

## Honesty

No government system, real person, payment gateway, OTP, government logo, Aadhaar, PAN or private data is used. All records are synthetic.
