# Project Agent Context

## Repository

- Project path: `/home/dendup/projects/Bar-entertainer`
- App type: Next.js App Router frontend for a Bar & Entertainer booking/review platform.
- Framework versions currently installed:
  - `next`: `^16.2.6`
  - `react`: `19.2.4`
  - `react-dom`: `19.2.4`
  - `tailwindcss`: `^4`
- Important local instruction: read relevant docs in `node_modules/next/dist/docs/` before writing Next.js code. This repo uses Next.js 16, which has changed APIs and behavior.

## Current Frontend Structure

- Routes live under `app/`.
- Feature/service code lives under `src/features`.
- API endpoint constants live in `src/constants/apis.ts`.
- Auth state uses Zustand in `src/features/auth/store/authstore.ts`.
- HTTP helper is `src/features/auth/services/apiClient.ts`.
- Organizer/bar dashboard routes:
  - `/dashboard/bar`
  - `/dashboard/bar/events`
  - `/dashboard/bar/booking`
  - `/dashboard/bar/applications`
  - `/dashboard/bar/profile`
- Entertainer dashboard routes:
  - `/dashboard/entertainer`
  - `/dashboard/entertainer/bookings`
  - `/dashboard/entertainer/profile`
- Auth routes:
  - `/login`
  - `/register`
  - `/verify`
  - `/verify2`
  - `/forgot_password`
  - `/reset_password`

## Dev Server State

- `npm run dev` was attempted.
- A Next dev server was already running for this repo:
  - URL: `http://localhost:3000`
  - PID shown by Next: `556025`
- A second `npm run dev` attempt switched to port `3001`, then exited because Next detected the existing server.
- `/dashboard/bar/events` initially returned `500` because the QR modal imported a missing package.
- After installing `qrcode.react`, `/dashboard/bar/events` returned `200 OK`.

## Package Context

- `qrcode.react` is required by `app/dashboard/(bar)/bar/components/QRModal.tsx`.
- Missing dependency problem observed:
  - `Module not found: Can't resolve 'qrcode.react'`
- The fix applied was installing:
  - `qrcode.react`
- Current dirty files at the time this context file was written:
  - `package.json`
  - `package-lock.json`
- `npm run build` passed after installing `qrcode.react`.
- `npm run lint` still has unrelated existing lint errors, mainly React static component rules in profile form components plus warnings for `any` and `<img>`.

## Frontend API Configuration

- Frontend API base URL is defined in `src/constants/apis.ts`.
- Current pattern:
  - `API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://31.97.239.18:9000'`
- For local backend development, use:
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000`
- Backend docs are served separately at:
  - `http://localhost:8000/api-docs/`
- The Swagger UI points to:
  - `http://localhost:8000/api-docs/openapi.json`

## Backend API Docs Context

- Backend docs were accessible from the host when using unsandboxed localhost access.
- `GET http://localhost:8000/api-docs/` returned `200 OK`.
- API spec title: `Bar Entertainer Platform API`
- OpenAPI version: `3.0.3`
- Spec server URL:
  - `http://localhost:5000`
- Backend tags include:
  - Health
  - Entertainer Auth
  - Entertainer Profile
  - Entertainer Uploads
  - Entertainer Bookings
  - Entertainer Events
  - Organizer Auth
  - Organizer Profile
  - Organizer Entertainers
  - Organizer Events
  - Organizer Uploads
  - Organizer Bookings
  - Organizer Applications
  - Reviews

## Auth And Headers

- Protected endpoints use bearer auth:
  - `Authorization: Bearer <token>`
- The frontend `apiClient` should attach the token from Zustand.
- Login responses in the OpenAPI schema may include:
  - `token`
  - `data`
  - `user`
- Some frontend code may expect `accessToken`; verify response shape when debugging auth.

## Organizer Review / QR API

These are the endpoints relevant to QR generation and review submission.

### Generate Review QR Token

- Method: `POST`
- Path: `/api/bar/reviews/{eventId}/generate-token`
- Auth: bearer token required
- Success response: `201`
- Response schema: `ReviewTokenResponse`
- Response properties:
  - `message: string`
  - `qrTokenId: string`
  - `token: string`
  - `reviewUrl: string`
  - `validFrom: date-time`
  - `validUntil: date-time`

Frontend references:

- Constant:
  - `ENDPOINTS.BAR.GENERATE_REVIEW_TOKEN(eventId)`
- Service:
  - `barService.generateReviewToken(id)`
- UI:
  - `EventTable.handleGenerateQR`
  - `QRModal`

### Regenerate Review QR Token

- Method: `POST`
- Path: `/api/bar/reviews/{eventId}/regenerate-token`
- Auth: bearer token required
- Success response: `201`
- Response schema: `ReviewTokenResponse`

Frontend references:

- Constant:
  - `ENDPOINTS.BAR.REGENERATE_REVIEW_TOKEN(eventId)`
- Service:
  - `barService.regenerateReviewToken(id)`

### Validate Public Review Token

- Method: `GET`
- Path: `/api/bar/reviews/{token}`
- Auth: not required
- Success response: `200`
- Response schema: `ReviewPageResponse`
- Response properties:
  - `message`
  - `event`
  - `entertainer`

### Submit Anonymous Review

- Method: `POST`
- Path: `/api/bar/reviews/{token}/submit`
- Auth: not required
- Required request body fields:
  - `performanceRating`
  - `professionalismRating`
  - `crowdEngagementRating`
  - `deviceId`
- Optional:
  - `comment`
- Rating range:
  - minimum `1`
  - maximum `5`
- Success response: `201`

### Review Stats

- Method: `GET`
- Path: `/api/bar/reviews/events/stats`
- Tag: Reviews
- Used for review table/stat screens when implemented.

## Existing QR Flow Notes

- `EventTable` calls `barService.generateReviewToken(e._id)`.
- On response, it expects at least:
  - `response.reviewUrl`
  - `response.token`
- It stores:
  - `reviewUrl`
  - `token`
  - `eventName`
- `QRModal` renders:
  - `<QRCodeSVG value={data.reviewUrl} size={200} />`
- If QR generation still fails after dependency install, likely causes to check next:
  - API base URL is pointing to production instead of local backend.
  - User is not authenticated as organizer/bar.
  - Bearer token is missing or invalid.
  - Backend rejects events without selected/accepted entertainer.
  - Frontend is using `accessToken` while backend login returns `token`.
  - Event ID is invalid or event does not belong to the logged-in bar.

## Other Backend Endpoints Used By Frontend

### Organizer Auth

- `POST /api/bar/send-otp`
- `POST /api/bar/resend-otp`
- `POST /api/bar/verify-otp`
- `POST /api/bar/login`
- `POST /api/bar/password-reset/send-otp`
- `POST /api/bar/password-reset/verify-otp`
- `POST /api/bar/password-reset/set-new`

### Entertainer Auth

- `POST /api/entertainer/send-otp`
- `POST /api/entertainer/resend-otp`
- `POST /api/entertainer/verify-otp`
- `POST /api/entertainer/login`
- `POST /api/entertainer/password-reset/send-otp`
- `POST /api/entertainer/password-reset/verify-otp`
- `POST /api/entertainer/password-reset/set-new`

### Organizer Events

- `GET /api/bar/event`
- `POST /api/bar/event`
- `GET /api/bar/event/{eventId}`
- `PATCH /api/bar/event/{eventId}`
- `DELETE /api/bar/event/{eventId}`
- `GET /api/bar/event/search/query`
- `GET /api/bar/event/dashboard/count`

### Organizer Bookings

- `GET /api/bar/bookings`
- `POST /api/bar/bookings`
- `GET /api/bar/bookings/stats`
- `GET /api/bar/bookings/search/query`

### Organizer Applications

- `GET /api/bar/applications`
- `GET /api/bar/applications/shortlisted`
- `PATCH /api/bar/applications/{applicationId}/status`

### Entertainer Events

- `GET /api/entertainer/events`
- `GET /api/entertainer/events/{eventId}/profile`
- `POST /api/entertainer/events/{eventId}/apply`

### Entertainer Bookings

- `GET /api/entertainer/bookings`
- `PATCH /api/entertainer/bookings/{bookingId}/status`
- `GET /api/entertainer/bookings/stats`

## Recommended Next Debugging Step

For the QR issue after dependency installation:

1. Confirm `NEXT_PUBLIC_API_BASE_URL` points to the backend currently being tested.
2. Log in as organizer/bar and verify the stored token name and value.
3. From the browser, trigger `Generate QR code` on `/dashboard/bar/events`.
4. Inspect the network request:
   - URL should be `/api/bar/reviews/{eventId}/generate-token` on the backend host.
   - Method should be `POST`.
   - Header should include `Authorization: Bearer <token>`.
   - Success should return `201` with `reviewUrl`.
5. If backend returns `400`, check whether the event has an accepted/selected entertainer.

## Constraints For Future Agents

- Do not overwrite user changes.
- Check `git status --short` before editing.
- Use `rg` for search.
- Use `apply_patch` for file edits.
- Do not use destructive git commands unless explicitly requested.
- Before Next.js code changes, read relevant docs under `node_modules/next/dist/docs/`.
- Keep changes focused. The repo has existing lint debt unrelated to the QR dependency.
