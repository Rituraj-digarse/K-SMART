# K-SMART Backend

Production-style REST backend for **Kisan Smart Management & Allocation of Procurement Tokens**.

## Stack
Node.js, Express, TypeScript, PostgreSQL, JWT/OTP authentication, RBAC and OpenAI-compatible chatbot integration.

## Setup
1. Install Node.js 20+ and PostgreSQL 14+.
2. Create a PostgreSQL database named `ksmart`.
3. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
4. Run the SQL in `src/config/schema.sql`.
5. `npm install`
6. `npm run build`
7. `npm start`

In development, OTPs are printed to the server console. For production, replace the OTP delivery adapter in `src/utils/otp.ts` with an SMS/WhatsApp provider.

## Roles
`FARMER`, `PROCUREMENT_OFFICER`, `CENTRE_OPERATOR`, `ADMIN`.

## Main APIs
- `/api/auth` OTP login and current user
- `/api/farmers` registration/profile
- `/api/centres` discovery/recommendations
- `/api/slots` slot lifecycle
- `/api/tokens` token lifecycle
- `/api/officer` officer queue/status management
- `/api/operator` farmer/receipt/procurement workflow
- `/api/payments` payment records
- `/api/notifications` in-app notifications
- `/api/admin` centre/capacity administration
- `/api/chat` authenticated K-SMART chatbot
