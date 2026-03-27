-- Inspect current appointments policies on public.appointments
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'appointments'
order by policyname;

-- Inspect triggers attached to public.appointments
select
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
from information_schema.triggers
where event_object_schema = 'public'
  and event_object_table = 'appointments'
order by trigger_name, event_manipulation;

-- Inspect current trigger function source if you want to audit it first
select
  p.proname as function_name,
  pg_get_functiondef(p.oid) as definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    'check_appointment_conflict',
    'validate_appointment_opening_hours'
  );

-- Inspect exact duplicate rows before cleanup
select
  barbershop_id,
  barber_id,
  customer_id,
  service_id,
  starts_at,
  ends_at,
  status,
  count(*) as duplicate_count
from public.appointments
group by
  barbershop_id,
  barber_id,
  customer_id,
  service_id,
  starts_at,
  ends_at,
  status
having count(*) > 1
order by starts_at, barber_id, customer_id;

begin;

-- Required for exclusion constraints on uuid + range
create extension if not exists btree_gist;

-- Basic time sanity check
alter table public.appointments
drop constraint if exists appointments_valid_time_range;

alter table public.appointments
add constraint appointments_valid_time_range
check (ends_at > starts_at);

-- Cleanup exact duplicates, keeping the oldest row by created_at/id.
-- Review this CTE result first if you want, then run the delete.
with ranked_duplicates as (
  select
    id,
    row_number() over (
      partition by
        barbershop_id,
        barber_id,
        customer_id,
        service_id,
        starts_at,
        ends_at,
        status
      order by created_at asc nulls last, id asc
    ) as rn
  from public.appointments
)
delete from public.appointments a
using ranked_duplicates d
where a.id = d.id
  and d.rn > 1;

-- The old trigger exists today but is not reliably preventing duplicates.
-- Keep opening-hours validation, but remove overlap validation in favor of
-- exclusion constraints, which are enforced by PostgreSQL itself.
drop trigger if exists trg_check_appointment_conflict on public.appointments;

drop function if exists public.check_appointment_conflict();

-- Prevent overlapping appointments for the same barber
alter table public.appointments
drop constraint if exists appointments_no_overlap_per_barber;

alter table public.appointments
add constraint appointments_no_overlap_per_barber
exclude using gist (
  barber_id with =,
  tstzrange(starts_at, ends_at, '[)') with &&
)
where (
  status not in (
    'cancelled_by_customer',
    'cancelled_by_barbershop',
    'no_show'
  )
);

-- Prevent overlapping appointments for the same customer
alter table public.appointments
drop constraint if exists appointments_no_overlap_per_customer;

alter table public.appointments
add constraint appointments_no_overlap_per_customer
exclude using gist (
  customer_id with =,
  tstzrange(starts_at, ends_at, '[)') with &&
)
where (
  status not in (
    'cancelled_by_customer',
    'cancelled_by_barbershop',
    'no_show'
  )
);

commit;

-- Notes:
-- 1) This is stronger than an RLS policy for preventing schedule collisions.
-- 2) If starts_at/ends_at are timestamp without time zone in your database,
--    replace tstzrange(...) with tsrange(...).
-- 3) Back-to-back bookings remain allowed because the range uses '[)'.
