# Supabase SMS Webhook: Setup & Deployment

This document explains how to configure Supabase to send SMS via a webhook and how to deploy the `sms-webhook` Edge Function included in this repo.

## Summary

- The function verifies a signature (HMAC-SHA256) using `SUPABASE_SMS_SECRET` and forwards the SMS to an SMS provider (Fast2SMS or Gupshup).
- Configure Supabase Auth → Settings → SMS to use the webhook URL and set a shared secret that matches `SUPABASE_SMS_SECRET`.

## Environment variables

Set these in the Supabase Functions environment (or local `.env` for testing):

- SUPABASE_SMS_SECRET: shared secret used to verify incoming webhook calls.
- SMS_PROVIDER: `fast2sms` or `gupshup`.
- FAST2SMS_API_KEY, FAST2SMS_ENDPOINT (for Fast2SMS).
- GUPSHUP_APP_ID, GUPSHUP_APP_SECRET, GUPSHUP_ENDPOINT (for Gupshup).

## Deploying the Edge Function

1. Install Supabase CLI and login.
2. From this repo: `supabase functions deploy sms-webhook --project-ref <your-ref>`
3. Set environment variables: `supabase secrets set SUPABASE_SMS_SECRET="<your-secret>" FAST2SMS_API_KEY=...`

## Configuring Supabase Auth

1. Go to Supabase Dashboard → Authentication → Settings → SMS
2. Choose `Webhook` and provide the deployed function endpoint (e.g. `https://<region>.functions.supabase.co/sms-webhook`).
3. Set a header or signature secret to the same `SUPABASE_SMS_SECRET`. When Supabase sends the webhook, the function verifies the HMAC-SHA256 of the request body with this secret.

## Testing locally

- Use `supabase functions serve sms-webhook` locally and send a POST to `http://localhost:54321/functions/v1/sms-webhook` with body `{ "phone": "+919xxxxxxxxx", "token": "123456" }` and set `x-supabase-signature` header computed with the same secret.

### curl example (compute HMAC externally)

- Example computing HMAC-SHA256 hex in bash (requires `xxd` and `printf`):

```bash
BODY='{"phone":"+919876543210","token":"123456"}'
SECRET="your-secret"
SIG=$(printf "%s" "$BODY" | openssl dgst -sha256 -hmac "$SECRET" -binary | xxd -p -c 256)
curl -X POST 'http://localhost:54321/functions/v1/sms-webhook' \
  -H "Content-Type: application/json" \
  -H "x-supabase-signature: $SIG" \
  -d "$BODY"
```

### Node helper (local test script)

- Use the included `scripts/test-sms-webhook.js` script to send a signed request. Example:

```bash
node scripts/test-sms-webhook.js --url http://localhost:54321/functions/v1/sms-webhook --phone +919876543210 --token 123456 --secret your-secret
```

### Fast2SMS payload example

- The Edge Function uses the Fast2SMS v3 body shape: `{ route: 'v3', numbers: '<comma-separated-numbers>', message: 'text', sender_id?: 'SENDERID' }` and sends it to the endpoint in `FAST2SMS_ENDPOINT` with header `Authorization: <API_KEY>`.
- The function will return 200 when provider responds OK; if provider returns an error the function returns 502 and includes provider details.

```bash
# Example: replace with real endpoint and API key set in env
curl -X POST 'https://www.fast2sms.com/dev/bulkV2' -H "Authorization: YOUR_KEY" -H "Content-Type: application/json" -d '{"route":"v3","numbers":"+919876543210","message":"Your code is 1234"}'
```

## Notes & Next Steps

- Replace the provider request body and endpoints with the official provider shapes (the function uses a simple placeholder JSON body). Consult provider docs for precise parameters.
- Add persistent rate-limiting if needed (use Redis or Supabase table as a rate store).
- Consider adding reCAPTCHA verification upstream to reduce abuse.
