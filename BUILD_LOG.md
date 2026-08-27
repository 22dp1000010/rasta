# Build log

## Phase 0 - Foundation

- Codex scaffolded the Next.js, TypeScript, Tailwind, lint, Vitest and Playwright project files without running any git command.
- Edge case caught: the first quick static prototype did not satisfy the requested architecture or verification requirements, so it was replaced with the planned app structure.
- Suggestion rejected: no database or auth library was added, because the brief requires mock data and a no-login main journey.

## Phase 1 - Domain, Mock Data, And Passport

- Codex created domain types, the mock repository, fictional seed data, passport scoring rules and the lookup/passport screens.
- Edge case caught: pending challans are shown as streak risk but do not reduce the score before resolution.
- Suggestion rejected: no live public-service lookup was used, because the plan forbids accessing real systems.

## Phase 2 - Triage And Model Layer

- Codex added provider interfaces, OpenAI/Groq-compatible adapters, deterministic fallback classification and schema-validated API routes.
- Edge case caught: unclear input returns a clarifying path rather than a guessed dispute ground.
- Suggestion rejected: a general chatbot was not added, because the model is limited to classification, drafting and explanation.

## Phase 3 - Evidence, Deadlines, Drafting

- Codex added deadline math, milestone markers, mock SVG evidence, editable draft generation and browser print-to-PDF.
- Edge case caught: exact matching plates no longer trigger the plate-misread rule.
- Suggestion rejected: downloaded vehicle photos were not used; all evidence imagery is self-authored SVG.

## Phase 4 - Status, Streak Restore, Rewards

- Codex added the status route with upheld and rejected outcomes, retroactive streak restoration copy and proposed reward disclaimers.
- Edge case caught: the rejected outcome is written clearly and does not hide next steps.
- Suggestion rejected: reward gamification such as coins or leaderboards was not added.

## Phase 5 - Honesty, Scale, I18n, Accessibility

- Codex added honesty and scale pages, Hindi catalogue support, keyboard-accessible controls and an E2E axe check.
- Edge case caught: axe flagged the disclosure bar outside landmarks, so it was changed to a labelled aside.
- Suggestion rejected: official colours, marks and government-style branding were avoided.

## Phase 6 - Polish And Submission Prep

- Codex updated dependency defaults, refreshed the Groq model default after checking current Groq docs, and verified the build budget.
- Edge case caught: npm reported a stale Next patch, so the app stayed on Next 15 but moved to the latest 15.5 patch.
- Suggestion rejected: jumping to Next 16 was not done because the build plan explicitly chose Next.js 15.
