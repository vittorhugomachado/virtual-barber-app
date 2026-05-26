# Production Checklist

Date: 2026-03-28

This checklist covers the customer app and the shared Supabase backend.

## Application

- `npm run lint` passes
- `npm test` passes
- `npm run build` passes
- `.env.local` is not used as the production source of truth
- Production environment has valid `VITE_SUPABASE_URL`
- Production environment has valid `VITE_SUPABASE_ANON_KEY`
- Auth redirect URLs are configured in Supabase for every production domain
- `/slug/entrar -> login -> /slug/agendar` flow is manually tested
- Existing-session flow is manually tested from `/slug/entrar?from=agendar`
- Profile page is manually tested with an account that has appointments
- Error states are manually tested with temporary backend failure simulation
- `README.md` should be filled with setup, deploy and rollback notes before handoff

## Scheduling and data integrity

- Review [TIMEZONE_AUDIT.md](/c:/Users/Vitor%20Hugo/OneDrive/Desktop/virtual-barber-front-end/virtual-barber-app/TIMEZONE_AUDIT.md)
- Confirm real column types for `appointments.starts_at` and `appointments.ends_at`
- Confirm both apps use the same timestamp assumptions
- Validate booking creation in the customer app
- Validate booking visibility in the barbershop app
- Validate conflict prevention with simultaneous booking attempts
- Validate last slot of the day and first slot of the next day
- Validate customer profile history dates and times

## Supabase

- RLS policies are enabled and reviewed for `customers_auth`, `appointments`, `profiles`, `barbershops`, `services`, `barbers`, `opening_hours`, `barber_availability`
- The customer can only read and write their own auth/profile records
- The customer can only create appointments allowed by current RLS and constraints
- Exclusion constraints or equivalent conflict protection are active in production
- OTP/WhatsApp auth provider is enabled and tested in production configuration
- Auth rate limits and anti-abuse settings are reviewed
- Required callback URLs are configured for production and preview environments
- Monitoring/log retention is enabled for auth and database errors
- Backups and restore path are documented

## Operations

- A real staging or pilot environment exists before public launch
- One smoke-test script exists for login, booking and profile
- A rollback plan exists for both frontend deploy and Supabase changes
- Contact owner is defined for auth outage and booking outage
- Basic analytics or error tracking is enabled
- Browser/device test was done on mobile and desktop

## Go/No-Go

Go only if:

- all automated checks are green
- manual auth and booking smoke tests pass
- timezone validation is signed off
- Supabase policies and constraints are confirmed in the live project
