# LearnTrack Backend Integration Notes

## Current Frontend State

LearnTrack is a React application built with Vite.

The frontend currently uses local application state and localStorage
for learning goals and scheduled-session data.

Session creation, rescheduling, title editing, completion, undoing
completion, cancellation, session history, and goal progress have
been implemented on the frontend.

Session history supports filtering by learning goal and status.

## Persistence

The current browser-based persistence is temporary.

The backend must provide authenticated, user-specific persistence
for learning goals, scheduled sessions, session status changes,
profile settings, and other applicable account data.

The frontend must not treat localStorage as the authoritative
source of truth once backend integration is complete.

## Authentication

The authentication interface exists but is not yet fully connected
to a backend.

Registration, sign-in, password recovery, password reset, session
expiry, protected access, and sign-out require backend integration.

Password requirements:
- Minimum password length: 12 characters.
- Password-reset links expire after 30 minutes.
- Password-reset links must be single-use.

The frontend authentication guard was temporarily removed during
dashboard testing and must be restored as part of integration.

## Session and Progress Rules

- Session statuses must follow the product requirements.
- Completing a session must be idempotent.
- Undoing completion must recalculate status using the current time.
- Rescheduling must preserve the session's identity and history.
- Cancelled sessions must be excluded from goal progress.
- Cancelled sessions cannot be restored.
- Goal progress must follow the PRD's eligible-session rules.

## Profile Settings

The settings interface includes profile fields, password validation,
and sign-out controls. These are not yet fully connected to backend
operations. Profile persistence, password changes, and actual
sign-out must be implemented.

## Integration Requirements

Before integration, agree on the API contract, including:
- Endpoint paths and HTTP methods.
- Request and response formats.
- Authentication and session-management mechanism.
- Validation and error-response formats.
- Goal and session data models.
- Time-zone handling.
- Loading, failure, and expired-session behaviour.

Preserve the existing frontend design and working functionality
where possible.

The LearnTrack PRD is the source of truth for product requirements.
