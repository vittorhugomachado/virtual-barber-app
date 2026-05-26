# Timezone and Scheduling Audit

Date: 2026-03-28

Scope:

- Audit only
- No changes were made to scheduling or timezone logic
- Focus on identifying how the current implementation behaves and where production risk still exists

## Files audited

- `src/lib/booking-queries.ts`
- `src/hooks/use-available-slots.ts`
- `src/utils/format-time.ts`
- `src/themes/default/components/booking/step-4/step-confirm.tsx`
- `src/hooks/use-booking.ts`
- `database/prevent-overlapping-appointments.sql`

## Current behavior

1. Local date filtering for appointment reads

- `getUtcRangeForLocalDate(date)` builds a local midnight range with `new Date(\`${date}T00:00:00\`)`
- The range is then converted with `toISOString()`
- This means the query window depends on the runtime timezone of the client

2. Day-of-week calculations

- Several places intentionally use `T12:00:00` when deriving weekday from a date string
- This is a good defensive choice against accidental day shifting caused by implicit UTC parsing

3. Slot overlap calculations

- Slot blocking compares only the `HH:mm` slice from `starts_at` and `ends_at`
- This works as long as the stored timestamps represent the same local calendar day expected by the UI

4. Appointment creation

- `step-confirm.tsx` currently builds `starts_at` and `ends_at` as plain local strings like `2026-03-30T09:00:00`
- `use-booking.ts` still has an alternative path that converts local dates with `toISOString()`
- That means there are two timestamp construction strategies in the codebase

5. Database protection

- `database/prevent-overlapping-appointments.sql` shows the intended protection using exclusion constraints
- The note in that file correctly warns that the exact range type must match the real database column type

## Audit result

The current implementation is internally consistent enough that it may work correctly in production today, especially if:

- the app runs in the same timezone expected by the business
- the database columns and RLS rules already match the currently shipped format
- the client app and barbershop app are both using the same timestamp assumptions

However, I would not call the timezone layer low-risk yet, because there are still structural sensitivities.

## Risks found

1. Mixed timestamp serialization strategies

- Reads use ISO UTC windows
- Some writes use local naive timestamps
- Another booking path still uses `toISOString()`
- If both write paths are ever used against the same schema, subtle shifts can appear

2. Runtime timezone dependence

- Any code using `new Date(\`${date}T00:00:00\`)` depends on the browser/device timezone
- That is usually fine for a Brazil-only deployment, but it is still an operational assumption

3. UI assumes same-day timestamp semantics

- Slot collision logic slices `starts_at` and `ends_at` by string position
- If the backend ever returns normalized UTC timestamps crossing day boundaries, availability can look correct in one timezone and wrong in another

4. Database type coupling

- The SQL audit file explicitly distinguishes `timestamptz` from `timestamp`
- If the schema changes or differs between environments, the app can appear fine locally and fail in production

## Recommendation without code changes

Before production, validate these items in the real Supabase project:

1. Confirm the exact types of `appointments.starts_at` and `appointments.ends_at`
2. Confirm the same timestamp strategy is used by both apps that share the database
3. Create one manual booking at a boundary time such as:

- first slot of the day
- last slot of the day
- day change around midnight UTC

4. Re-open the same day in both the customer app and the barbershop app and confirm:

- same slot appears occupied
- same weekday label is shown
- profile history shows the expected date and time

5. Repeat the test on a device configured to another timezone just to detect hidden client-side assumptions

## Important note

This audit intentionally did not modify any scheduling logic, per request.
