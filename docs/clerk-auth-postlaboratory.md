# Clerk Auth Setup (postlaboratory.com)

This project is now prepared for Clerk auth sync with Convex using:

- `src/app/api/webhooks/clerk/route.ts`
- `convex/users.ts` (`syncUserFromClerkWebhook`, `deleteUserByClerkId`)
- `src/lib/auth-config.ts`

## Required Clerk Dashboard config

1. Set production domain to `postlaboratory.com`.
2. Configure paths:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/image`
   - After sign-up: `/onboarding`
3. Add webhook endpoint:
   - URL: `https://postlaboratory.com/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`
4. Copy webhook secret into env var:
   - `CLERK_WEBHOOK_SIGNING_SECRET`

## Role and status behavior

- `admin` + `active`: admin email allowlist.
- `beta` + `active`: approved in `beta_requests`.
- `user` + `waitlist`: signed up but not approved yet.

## Onboarding flow

- New sign-up is forced to `/onboarding`.
- Sign-in is forced to `/image`.
- Onboarding modal and brand-kit flow remain active as before.

