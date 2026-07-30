# MyRishta Implementation Plan

This file is the living execution checklist for the MyRishta closed beta. Mark a task complete by changing `- [ ]` to `- [x]` only after its implementation and applicable verification are complete. Add short notes or links beneath tasks when a decision, migration, or follow-up needs to be recorded.

## Definition of Done

A task is complete only when:

- The implementation matches the approved product behavior.
- Authorization, validation, privacy, and failure handling are included.
- Applicable automated tests pass.
- User-facing states cover loading, empty, offline, and error behavior.
- Relevant API/schema changes and operational notes are documented.
- No secrets, sensitive profile content, or private messages are exposed in logs or analytics.

## Milestone 0 - Project Foundation

- [x] Create a pnpm workspace and Turborepo configuration.
- [x] Add the Expo mobile application.
- [x] Add the Next.js moderation console.
- [x] Add the Hono API service.
- [x] Add independently deployable worker code with no application-to-application imports.
- [x] Add shared packages for API contracts, domain logic, database access, configuration, and reusable types.
- [x] Enable strict TypeScript across the monorepo.
- [x] Add shared linting, formatting, and test configuration.
- [x] Commit a single exact dependency lockfile.
- [x] Pin Expo SDK 57, React Native 0.86, React 19.2.3, Expo Router `~57.0.7`, and NativeWind 4.2.4.
- [x] Configure NativeWind design tokens and reusable mobile UI primitives.
- [x] Isolate `unstable-native-tabs` behind one replaceable navigation component.
- [x] Configure the five tabs: Home, Discover, Interests, Chats, and Profile.
- [x] Add validated environment configuration for local, staging, and production.
- [x] Create separate local/staging/production configuration boundaries for Clerk, Neon, media, push, and API services.
- [x] Add CI checks for types, linting, tests, migrations, API compatibility, and builds.
- [x] Configure scheduled dependency-update pull requests without automatic merging.

  - Foundation verified with Expo Doctor, strict TypeScript, ESLint, Vitest, Expo web export, and Next.js production build on 2026-07-29.

## Milestone 1 - Database and API Foundation

- [ ] Provision Neon PostgreSQL environments for staging and production.
- [x] Configure Drizzle with migration generation and application commands.
- [x] Define database naming, timestamp, soft-deletion, and audit conventions.
- [x] Implement transactional database helpers and connection health checks.
- [ ] Add migration checks to CI and staging deployment.
- [x] Publish a versioned `/v1` REST API using OpenAPI schemas.
- [ ] Generate typed mobile and admin API clients from OpenAPI.
- [ ] Add runtime request, response, query, and environment validation.
- [x] Add structured error responses with stable machine-readable error codes.
- [x] Require idempotency keys for unsafe retryable mutations.
- [ ] Add optimistic-concurrency/version fields to stale-edit-sensitive resources.
- [x] Add API rate limiting and request-size limits.
- [x] Add redacted structured logging, request correlation IDs, and health endpoints.

## Milestone 2 - Authentication, Accounts, and Consent

- [ ] Create company-owned Clerk applications for staging and production.
- [ ] Implement Clerk email OTP authentication.
- [ ] Implement Google authentication.
- [ ] Implement Apple authentication while keeping Android beta behavior coherent.
- [ ] Store mobile sessions securely and handle expiration, refresh, and revocation.
- [ ] Require private phone verification before profile publication.
- [ ] Add phone OTP resend cooldowns, attempt limits, invitation gating, and spend monitoring.
- [ ] Mirror Clerk identities into application account records through idempotent synchronization.
- [ ] Verify Clerk tokens on every authenticated API and WebSocket connection.
- [ ] Define account roles for candidate, co-manager, moderator, support, and administrator.
- [ ] Enforce one active candidate/co-manager role per member account.
- [ ] Record accepted terms, privacy policy, community rules, age declaration, and policy versions.
- [ ] Implement logout, session revocation, and active-device token cleanup.
- [ ] Test duplicate callbacks, expired sessions, revoked sessions, and unauthorized role claims.

## Milestone 3 - Candidate and Co-manager Profiles

- [ ] Define the candidate profile and revision schemas.
- [ ] Define structured reference data for country, city, nationality, language, religion, sect, marital status, education, profession, and lifestyle fields.
- [ ] Support country/city only; do not collect GPS or exact distance.
- [ ] Support optional ethnicity and income ranges with visibility controls.
- [ ] Explicitly exclude caste/biradari fields.
- [ ] Enforce a minimum age of 18.
- [ ] Allow only never-married, divorced, widowed, or legally annulled active candidates.
- [ ] Store exact birth date privately and expose calculated age only.
- [ ] Store legal identity and contact information separately from public profile data.
- [ ] Implement relationship-to-candidate labels for self, son, daughter, sibling, relative, and friend.
- [ ] Implement required-core onboarding with optional secondary family/lifestyle enrichment.
- [ ] Implement partner preferences with explicit `must-have` versus `flexible` strictness.
- [ ] Adapt religion/lifestyle questions so non-Muslims are not shown Islamic-only fields.
- [ ] Build profile preview using the same public-profile projection used by discovery.
- [ ] Add profile completion status and actionable missing-field guidance.
- [ ] Implement states for draft, awaiting consent, pending review, approved, changes pending, rejected, paused, and deleted.
- [ ] Keep the last approved revision visible while edits await moderation.
- [ ] Add pause, recovery, deactivate, and permanent-delete entry points.

### Co-manager workflow

- [ ] Allow a manager to draft an unpublished candidate profile.
- [ ] Send a secure, expiring candidate ownership invitation.
- [ ] Require the candidate to create and verify their own account.
- [ ] Require the candidate to approve profile content and publication consent.
- [ ] Transfer final profile authority to the candidate before publication.
- [ ] Give co-managers review, suggestion, shortlist, and approved-chat participation capabilities only.
- [ ] Prevent co-managers from publishing, accepting interests, revealing photos, or deleting the candidate profile.
- [ ] Let candidates revoke co-manager access immediately.
- [ ] Test role switching, invitation expiry, declined consent, and manager revocation.

## Milestone 4 - Photos and Verification

- [ ] Configure private ImageKit upload and delivery settings.
- [ ] Implement signed direct uploads for profile photos.
- [ ] Validate photo type, size, dimensions, metadata, and ownership.
- [ ] Support multiple photos, main-photo selection, reordering, replacement, and deletion.
- [ ] Require an explicit visible, blurred, or hidden visibility selection.
- [ ] Generate original, thumbnail, visible, blurred, and recipient-watermarked variants.
- [ ] Use short-lived signed delivery URLs for non-public media.
- [ ] Prevent unapproved photos from appearing on the live profile.
- [ ] Configure separate private object storage for prompted-selfie evidence and voice notes.
- [ ] Implement a prompted selfie/video verification challenge.
- [ ] Label the result as manually verified, never as automated liveness or government-ID verification.
- [ ] Require candidates and co-managers to pass the same verification workflow.
- [ ] Define and implement verification-evidence retention and deletion rules.
- [ ] Add Android screen-capture restrictions on protected views.
- [ ] Obscure protected content in task/app-switcher previews.
- [ ] Detect or warn about capture where supported without promising complete iOS prevention.

## Milestone 5 - Moderation Console and Safety Operations

- [ ] Implement staff authentication and least-privilege authorization in the Next.js console.
- [ ] Build profile revision review queues.
- [ ] Build photo review queues.
- [ ] Build prompted-selfie verification queues.
- [ ] Show profile diffs between approved and pending revisions.
- [ ] Support approve, reject, request-changes, pause, suspend, and restore actions.
- [ ] Require structured reasons and optional member-facing explanations for moderation decisions.
- [ ] Build report, appeal, and safety-case queues.
- [ ] Add prioritized handling for active threats and reported matched conversations.
- [ ] Restrict private-chat evidence access to reported context.
- [ ] Require a recorded justification for sensitive staff access.
- [ ] Add immutable audit events for staff access and moderation actions.
- [ ] Add account, profile, match, and case lookup without exposing unnecessary private data.
- [ ] Add moderation backlog and review-age indicators targeting review within 24 hours.
- [ ] Test cross-role access and prove unauthorized staff cannot access sensitive evidence.

## Milestone 6 - Recommendations and Discovery

- [ ] Implement canonical unordered candidate-pair records.
- [ ] Implement reciprocal hard-requirement evaluation.
- [ ] Enforce man-woman candidate pairing for v1.
- [ ] Require mutual opt-in for interfaith recommendations.
- [ ] Enforce declared must-haves without silent relaxation.
- [ ] Implement deterministic weighted scoring for flexible preferences.
- [ ] Produce qualitative Strong/Good compatibility labels.
- [ ] Generate plain-language compatibility reasons without exposing internal scores.
- [ ] Generate a small daily recommendation batch per approved candidate.
- [ ] Recompute affected recommendations after approved profile/preference changes.
- [ ] Build honest empty states identifying overly restrictive requirements.
- [ ] Build the Home dashboard with daily recommendations, pending activity, completion, and verification states.
- [ ] Build Discover with recommendations, controlled filters, new profiles, and favourites.
- [ ] Build the limited anonymized/blurred pre-approval sample with no interaction.
- [ ] Add favourite, hide, and explicit reversible-exclusion controls.
- [ ] Ensure declined, hidden, blocked, and reported pairs do not reappear automatically.
- [ ] Test mutual filtering, interfaith rules, pair exclusions, deterministic ranking, and empty results.

## Milestone 7 - Interests and Matches

- [ ] Define interest states for pending, accepted, declined, expired, and withdrawn where policy permits.
- [ ] Require a guided or custom introduction for every interest.
- [ ] Provide respectful guided introduction templates.
- [ ] Enforce five new interests per member per calendar day in the configured timezone.
- [ ] Enforce limits on the server and make retries idempotent.
- [ ] Expire unanswered interests after 14 days.
- [ ] Allow recipients to view the sender profile before deciding.
- [ ] Transactionally create one match and one initial private conversation on acceptance.
- [ ] Prevent duplicate interests and duplicate matches for a candidate pair.
- [ ] Build received, sent, pending, accepted, declined, and expired interest views.
- [ ] Build match views and entry points into chat and photo-access requests.
- [ ] Test simultaneous acceptance, duplicate requests, limit boundaries, expiry, and excluded pairs.

## Milestone 8 - Photo Access

- [ ] Allow photo-access requests to be queued from eligible matched profiles.
- [ ] Permit grants only between currently matched candidates.
- [ ] Make grants candidate-controlled, per match, auditable, and revocable.
- [ ] Revoke delivery URLs and access immediately after revocation, unmatch, block, or report.
- [ ] Prevent co-managers from granting candidate photo access.
- [ ] Show clear requested, granted, declined, revoked, and unavailable states.
- [ ] Test expired URLs, revoked grants, stale cached images, blocked pairs, and authorization bypass attempts.

## Milestone 9 - Realtime Messaging and Voice Notes

- [ ] Define conversation, participant, message, receipt, attachment, and membership schemas.
- [ ] Store messages in PostgreSQL as the source of truth.
- [ ] Add authenticated WebSocket connections and membership authorization.
- [ ] Define versioned WebSocket commands and events.
- [ ] Support reconnect/resume cursors without duplicating messages.
- [ ] Require stable client message IDs for retry-safe sends.
- [ ] Implement text messages and replies.
- [ ] Implement ephemeral typing indicators.
- [ ] Implement read receipts with member privacy settings where applicable.
- [ ] Implement guided marriage-question prompts.
- [ ] Implement voice recording, compression, upload, playback, and failure recovery.
- [ ] Cap each voice note at two minutes.
- [ ] Prevent in-app voice-note forwarding and download.
- [ ] Allow individual messages and voice notes to be reported.
- [ ] Preserve local drafts but require server acknowledgement before showing a message as sent.
- [ ] Add conversation loading, reconnecting, failed-send, empty, and blocked states.
- [ ] Test ordering, duplicate retries, reconnects, token expiry, slow uploads, and unauthorized conversation access.

## Milestone 10 - Guardian Group Conversations

- [ ] Let either candidate propose adding a named verified co-manager to a match.
- [ ] Require explicit approval from both candidates.
- [ ] Create a new group conversation after approval.
- [ ] Do not expose earlier one-to-one conversation history.
- [ ] Show every participant's identity and role clearly.
- [ ] Allow the sponsoring candidate to remove their co-manager.
- [ ] Define group behavior after match termination, manager revocation, or account suspension.
- [ ] Test unilateral-add attempts, stale approvals, removed managers, and historical-message isolation.

## Milestone 11 - Blocking, Reporting, and Appeals

- [ ] Define report categories for profiles, photos, messages, voice notes, impersonation, harassment, fraud, and safety concerns.
- [ ] Let members unmatch, block, and report from profiles and conversations.
- [ ] Immediately hide both profiles from each other after blocking/reporting.
- [ ] Stop all messaging and revoke photo access immediately.
- [ ] Remove the pair from future recommendations.
- [ ] Preserve narrowly relevant encrypted evidence for authorized moderator review.
- [ ] Create a prioritized moderation case from every report.
- [ ] Prevent retaliation through alternate interactions or stale sessions.
- [ ] Implement member-facing report status and appeal entry points without exposing staff notes.
- [ ] Test report races, offline devices, stale media URLs, and suspended-account behavior.

## Milestone 12 - Background Jobs and Notifications

- [ ] Implement a PostgreSQL-backed durable job table.
- [ ] Add job idempotency keys, scheduled timestamps, attempt counts, and ownership leases.
- [ ] Claim jobs safely using a single-consumer/`SKIP LOCKED` strategy.
- [ ] Add exponential backoff, terminal failure state, and dead-letter inspection.
- [ ] Implement jobs for recommendation generation.
- [ ] Implement jobs for interest expiry.
- [ ] Implement jobs for push delivery and retry.
- [ ] Implement jobs for media and verification-evidence cleanup.
- [ ] Implement jobs for account deletion and retention enforcement.
- [ ] Implement moderation SLA reminders and queue-health checks.
- [ ] Run one safe worker consumer inside the beta API process.
- [ ] Keep the worker independently deployable for the public-launch migration.
- [ ] Configure Expo Push Service and device-token registration.
- [ ] Add transactional notifications for interests, matches, messages, photo requests/grants, guardian requests, moderation, and security events.
- [ ] Ensure notification failure never rolls back the underlying domain action.
- [ ] Prevent private profile or message content from appearing in lock-screen notifications by default.
- [ ] Test retries, process restarts, duplicate jobs, invalid push tokens, and dead-letter recovery.

## Milestone 13 - Offline, Caching, and Performance

- [ ] Add encrypted local caching for allowed profile lists, recommendation summaries, and recent chats.
- [ ] Do not cache legal identity, verification evidence, full private media, or moderation data.
- [ ] Preserve unsent drafts locally.
- [ ] Require online server confirmation for interests, messages, photo grants, and other consent-changing actions.
- [ ] Show explicit offline, API-waking, reconnecting, stale-data, and retry states.
- [ ] Optimize image variants and prefetch only permitted thumbnails.
- [ ] Virtualize long profile, discovery, interest, and message lists.
- [ ] Profile startup, navigation, list scrolling, memory use, and media loading on affordable Android devices.
- [ ] Test slow, intermittent, and lost network connections.
- [ ] Test cold-start recovery against sleeping beta hosting.

## Milestone 14 - Privacy, Retention, and Account Lifecycle

- [ ] Implement privacy and visibility settings for profile fields, photos, online status, notifications, and read receipts.
- [ ] Record auditable consent, profile visibility, photo access, manager access, and security events.
- [ ] Hide deleted accounts immediately.
- [ ] Implement the 30-day account recovery window.
- [ ] Purge personal content after the recovery window.
- [ ] Retain only legally justified fraud, consent, moderation, and audit records.
- [ ] Define retention periods for messages, voice notes, selfie evidence, reports, and audit events with legal review.
- [ ] Add member data export before public launch if required by selected jurisdictions.
- [ ] Test deletion while interests, matches, group chats, reports, and pending jobs exist.
- [ ] Verify logs, analytics, backups, and media stores honor deletion and retention policy.

## Milestone 15 - Observability and Product Measurement

- [ ] Add mobile crash and error reporting using a free-tier service.
- [ ] Add API and worker error reporting with environment and correlation context.
- [ ] Redact tokens, contact information, profile answers, message content, media URLs, and verification evidence.
- [ ] Add health checks and alerts for API, database, job backlog, push failures, and moderation backlog.
- [ ] Define privacy-safe funnel events for signup, verification, profile completion, approval, recommendation viewing, interest, match, and chat start.
- [ ] Exclude sensitive fields, media, and communication content from analytics.
- [ ] Build beta metrics for completion rate, review time, accepted interests, matched-chat starts, and report/block rate.
- [ ] Establish numerical go/no-go thresholds after the first controlled cohort produces baseline data.

## Milestone 16 - Accessibility, Localization, and UX Quality

- [ ] Externalize all mobile and admin user-facing strings.
- [ ] Use locale-safe dates, numbers, timezones, names, and structured reference labels.
- [ ] Make layouts and directional icons RTL-ready.
- [ ] Add RTL smoke tests without shipping Urdu or Arabic translations.
- [ ] Add screen-reader labels, focus order, scalable text, adequate contrast, and touch-target checks.
- [ ] Provide loading, empty, rejected, paused, limited-inventory, error, and recovery states for every critical flow.
- [ ] Review language for respectful, marriage-focused, family-friendly positioning.
- [ ] Avoid dating-style swipe mechanics, engagement pressure, and pseudo-scientific compatibility claims.

## Milestone 17 - Deployment and Closed Beta

- [ ] Create company-owned service accounts with MFA, role addresses, and documented recovery ownership.
- [ ] Configure staging and production Neon projects and backups.
- [ ] Configure staging and production Clerk applications and OAuth credentials.
- [ ] Configure private ImageKit and object-storage environments.
- [ ] Deploy the staging and production APIs to WebSocket-capable hosting.
- [ ] Use free sleeping hosting only for the closed beta and display waking/reconnecting behavior.
- [ ] Deploy the Next.js moderation console with staff-only access.
- [ ] Configure database migrations as a controlled deployment step.
- [ ] Configure Android development, internal, staging, and closed-beta builds.
- [ ] Configure Expo runtime-version compatibility and safe update channels.
- [ ] Register the Google Play developer account and satisfy closed-testing requirements.
- [ ] Prepare privacy policy, terms, community rules, safety guidance, and support contact.
- [ ] Complete legal review for Pakistan and the selected Gulf countries.
- [ ] Select the initial Pakistani cities and Gulf countries.
- [ ] Recruit a balanced invite-only cohort by location, gender, age, and preferences.
- [ ] Cap the beta at 500 accounts and monitor SMS, storage, hosting, and moderation usage.
- [ ] Document the mandatory migration to always-on API and separately deployed workers before public launch.

## Milestone 18 - Release Acceptance

- [ ] Pass unit tests for matching, permissions, visibility, limits, retention, and state machines.
- [ ] Pass API/database integration tests for every critical mutation and job.
- [ ] Pass OpenAPI compatibility checks and generated-client validation.
- [ ] Pass Android end-to-end onboarding and authentication tests.
- [ ] Pass candidate/co-manager consent and authorization tests.
- [ ] Pass verification, moderation, revision, and publication tests.
- [ ] Pass recommendation, interest, match, and exclusion tests.
- [ ] Pass private-photo request, grant, revocation, and protected-delivery tests.
- [ ] Pass text, voice-note, reconnect, push, and guardian-group chat tests.
- [ ] Pass block, report, suspension, appeal, deletion, and evidence-access tests.
- [ ] Pass affordable-device, slow-network, offline-cache, cold-start, accessibility, and RTL smoke tests.
- [ ] Perform a security review of authentication, authorization, uploads, signed URLs, WebSockets, rate limits, and staff access.
- [ ] Perform a privacy review of analytics, logs, media, backups, retention, and deletion.
- [ ] Complete a staging moderation rehearsal with sample profiles, edits, reports, and appeals.
- [ ] Complete founder operational runbooks for incidents, moderation escalation, account recovery, vendor outage, and data restoration.
- [ ] Approve the Android closed-beta build only after all release-blocking checks pass.

## Post-beta Backlog - Not Part of V1

- [ ] Move the API to always-on hosting and deploy workers separately.
- [ ] Prepare public Android release operations.
- [ ] Enroll in the Apple Developer Program and complete iOS production QA.
- [ ] Launch the public iOS app.
- [ ] Add symmetric-freemium entitlements and store-compliant subscriptions.
- [ ] Add advanced discovery, visitors, recently viewed, and boosts only after validating their product value.
- [ ] Add paid automated liveness or government-ID verification.
- [ ] Add Urdu translation and production RTL QA.
- [ ] Add Arabic and additional languages based on market demand.
- [ ] Evaluate in-app voice/video calls and their safety requirements.
- [ ] Evaluate separate guardian-to-guardian communication.
- [ ] Expand beyond one candidate/co-manager role per account only with a redesigned permission model.

## Decision and Risk Log

- [ ] Confirm the exact Pakistani cities and Gulf countries for the first cohort.
- [ ] Confirm legally reviewed retention durations for each sensitive-data category.
- [ ] Confirm the voice-note and selfie-evidence object-storage provider.
- [ ] Confirm the crash/error and privacy-safe analytics providers.
- [ ] Validate NativeWind 4.2.4 against the pinned Expo SDK 57 toolchain before broad UI implementation.
- [ ] Validate Expo native-tab behavior on supported affordable Android devices.
- [ ] Measure free-host cold-start and WebSocket recovery behavior before inviting beta members.
- [ ] Record baseline beta metrics before setting final public-launch thresholds.
