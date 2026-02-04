// Supabase Edge Function: SMS Webhook Receiver
// This function is meant to be configured in Supabase Auth -> SMS webhook settings.
// It verifies an HMAC signature using SUPABASE_SMS_SECRET and forwards the SMS to
// a configured provider (FAST2SMS or GUPSHUP). Configure env vars in your Supabase
// functions dashboard before deploying.

// Environment variables expected:
// - SUPABASE_SMS_SECRET: shared secret used to verify incoming requests
// - SMS_PROVIDER: 'fast2sms' | 'gupshup'
// - FAST2SMS_API_KEY / FAST2SMS_ENDPOINT (optional)
// - GUPSHUP_APP_ID / GUPSHUP_APP_SECRET (optional)

// Notes: The exact provider API shapes vary. This function sends a simple JSON payload
// { to: phone, message } to the provider endpoint (default placeholders). Replace provider
// bodies with the official provider shapes when integrating.

import { serve } from "https://deno.land/std@0.201.0/http/server.ts";

// Basic in-memory rate limiter (per function instance)
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds
const MAX_PER_WINDOW = 5; // max SMS per phone per window
const rateMap = new Map<string, { count: number; windowStart: number }>();

function hexEncode(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifySignature(reqBody: string, signature: string | null, secret: string | undefined) {
  if (!secret) return false;
  if (!signature) return false;

  // Compute HMAC-SHA256 hex
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(reqBody));
  const hex = hexEncode(sig);

  // Accept hex or base64 signature from header
  const base64 = btoa(String.fromCharCode(...new Uint8Array(sig)));

  return signature === hex || signature === base64;
}

async function sendViaFast2SMS(phone: string, message: string) {
  const apiKey = Deno.env.get("FAST2SMS_API_KEY");
  const endpoint = Deno.env.get("FAST2SMS_ENDPOINT") || "https://www.fast2sms.com/dev/bulkV2";
  const senderId = Deno.env.get("FAST2SMS_SENDER_ID");
  if (!apiKey) throw new Error("FAST2SMS_API_KEY not configured");

  // Fast2SMS v3 expects fields like: route, numbers (comma-separated), message, and optional sender_id
  const body: Record<string, any> = {
    route: "v3",
    numbers: phone,
    message: message,
  };

  if (senderId) body.sender_id = senderId;

  const resp = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await resp.json().catch(() => ({}));

  // Fast2SMS returns a structure with `return` or `status` fields; normalize success check
  const ok = resp.ok && (data?.return === true || data?.status === "success" || resp.status === 200);
  return { ok, data, rawStatus: resp.status };
}

async function sendViaGupshup(phone: string, message: string) {
  const appId = Deno.env.get("GUPSHUP_APP_ID");
  const appSecret = Deno.env.get("GUPSHUP_APP_SECRET");
  const endpoint = Deno.env.get("GUPSHUP_ENDPOINT") || "https://api.gupshup.io/sm/api/v1/msg";
  if (!appId || !appSecret) throw new Error("GUPSHUP credentials not configured");

  const body = {
    channel: "sms",
    source: appId,
    destination: phone,
    message: message,
  };

  const resp = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${appSecret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await resp.json().catch(() => ({}));
  return { ok: resp.ok, data };
}

serve(async (req: Request) => {
  try {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

    const text = await req.text();
    const sigHeader = req.headers.get("x-supabase-signature") || req.headers.get("x-webhook-signature");
    const secret = Deno.env.get("SUPABASE_SMS_SECRET");

    const okSig = await verifySignature(text, sigHeader, secret);
    if (!okSig) {
      console.warn("Invalid signature for SMS webhook");
      return new Response(JSON.stringify({ error: "invalid signature" }), { status: 401 });
    }

    const payload = JSON.parse(text);
    const phone = payload.phone || payload.to;
    const token = payload.token || payload.otp || payload.code;

    if (!phone || !token) return new Response(JSON.stringify({ error: "phone and token required" }), { status: 400 });

    // Rate limiting per phone (best-effort, per instance)
    const now = Date.now();
    const state = rateMap.get(phone) || { count: 0, windowStart: now };
    if (now - state.windowStart > RATE_LIMIT_WINDOW_MS) {
      state.count = 0;
      state.windowStart = now;
    }
    state.count += 1;
    rateMap.set(phone, state);
    if (state.count > MAX_PER_WINDOW) {
      return new Response(JSON.stringify({ error: "rate limit" }), { status: 429 });
    }

    const message = `Your verification code is ${token}. It expires in 10 minutes.`;

    const provider = (Deno.env.get("SMS_PROVIDER") || "fast2sms").toLowerCase();
    let res;
    if (provider === "fast2sms") {
      res = await sendViaFast2SMS(phone, message);
    } else if (provider === "gupshup") {
      res = await sendViaGupshup(phone, message);
    } else {
      return new Response(JSON.stringify({ error: "unsupported provider" }), { status: 500 });
    }

    if (!res.ok) {
      console.error("Provider failed", res.data);
      return new Response(JSON.stringify({ error: "provider error", detail: res.data }), { status: 502 });
    }

    return new Response(JSON.stringify({ ok: true, provider: provider, result: res.data }), { status: 200 });
  } catch (err) {
    console.error("sms-webhook error", err);
    return new Response(JSON.stringify({ error: "internal_error", message: String(err) }), { status: 500 });
  }
});
