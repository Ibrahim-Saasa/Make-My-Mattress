#!/usr/bin/env node
// Node script to POST a test SMS webhook to the deployed or local function
// Usage: node scripts/test-sms-webhook.js --url <url> --phone +919xxxxxxxxx --token 1234 --secret your_secret

const crypto = require("crypto");
const https = require("https");
const http = require("http");

function usage() {
  console.log(
    "Usage: node scripts/test-sms-webhook.js --url <url> --phone <phone> --token <otp> --secret <supabase_secret>",
  );
  process.exit(1);
}

const argv = require("minimist")(process.argv.slice(2));
const url = argv.url;
const phone = argv.phone;
const token = argv.token;
const secret = argv.secret;

if (!url || !phone || !token || !secret) usage();

const body = JSON.stringify({ phone, token });
const hmac = crypto.createHmac("sha256", secret).update(body).digest("hex");

const parsed = new URL(url);
const opts = {
  hostname: parsed.hostname,
  port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
  path: parsed.pathname + (parsed.search || ""),
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
    "x-supabase-signature": hmac,
  },
};

const req = (parsed.protocol === "https:" ? https : http).request(
  opts,
  (res) => {
    let data = "";
    res.on("data", (c) => (data += c));
    res.on("end", () => {
      console.log("Status:", res.statusCode);
      console.log("Response:", data);
    });
  },
);
req.on("error", (e) => console.error("Request error", e));
req.write(body);
req.end();
