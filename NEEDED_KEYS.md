# Required Environment Variables

To run the Cortex SaaS platform with full functionality, you must configure the following environment variables in your `.env` file (or deployment environment).

## Core
- `PORT`: (Optional) Port for the server to run on (default: 5000).
- `DATABASE_URL`: Connection string for the PostgreSQL database (Neon).
- `JWT_SECRET`: Strong secret key for signing authentication tokens.
- `FRONTEND_URL`: The URL of your frontend application (e.g., `https://cortex-app.com` or `http://localhost:5173`). Used for password reset links.

## Authentication & Notifications
- `SENDGRID_API_KEY`: API Key for SendGrid (or Resend) to send system emails (e.g., password reset).
- `GOOGLE_CLIENT_ID`: OAuth Client ID for Google Sign-In.
- `APPLE_CLIENT_ID`: Service ID for Sign in with Apple.

## Hardware Bridge
- `HARDWARE_WS_PORT`: Port for the Smart Lock WebSocket Server (Default: 7788). Ensure this port is open on your firewall.
- `HARDWARE_API_KEY`: (Deprecated/Optional) Authenticating with legacy bridge.
- `HARDWARE_WEBHOOK_SECRET`: Secret key used to verify the `x-hardware-signature` header from incoming webhooks.

## Financials
- `VAT_PERCENTAGE`: (Optional) Default VAT percentage if not set in DB (default: 18.00). Note: Tax settings are primarily managed via the database `tax_settings` table.
