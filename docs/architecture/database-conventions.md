# Database conventions

- Use PostgreSQL `snake_case` names. Tables are plural; primary keys are UUIDs named `id`; foreign keys end in `_id`.
- Store all timestamps as timezone-aware PostgreSQL timestamps and treat them as UTC at API boundaries.
- Mutable resources include `version`, `created_at`, `updated_at`, and nullable `deleted_at` columns. Increment `version` atomically and compare it with the caller's `If-Match` value for stale-edit-sensitive writes.
- Soft deletion sets `deleted_at`; ordinary reads must exclude those rows. Hard deletion is reserved for retention-policy jobs.
- Security, consent, moderation, and staff-access changes append immutable `audit_events` rows in the same transaction as the domain change.
- Schema changes are generated with `pnpm db:generate`, reviewed as SQL, checked with `pnpm db:check`, and applied with `pnpm db:migrate` during deployment.
- Multi-step writes use the exported database `transaction` helper. Do not mix transactional and non-transactional handles in one operation.
