// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PHONE_AUTH_DOMAIN = "@mmmphone.app";

async function findUserByEmail(
  supabaseAdmin: ReturnType<typeof createClient>,
  email: string,
) {
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw error;
    }

    const found = data.users.find((user) => user.email === email);
    if (found) {
      return found;
    }

    if (data.users.length < perPage) {
      return null;
    }

    page += 1;
  }
}

async function ensurePhoneDerivedUser(
  supabaseAdmin: ReturnType<typeof createClient>,
  {
    email,
    password,
    phone,
    firstName,
    lastName,
  }: {
    email: string;
    password?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  },
) {
  const existingUser = await findUserByEmail(supabaseAdmin, email);
  if (existingUser) {
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      existingUser.id,
      {
        email_confirm: true,
        password,
        user_metadata: {
          ...(existingUser.user_metadata || {}),
          ...(phone ? { phone } : {}),
          ...(firstName ? { first_name: firstName } : {}),
          ...(lastName ? { last_name: lastName } : {}),
        },
      },
    );

    if (updateError) {
      throw updateError;
    }

    return existingUser.id;
  }

  if (!password) {
    throw new Error("password is required when creating a new phone-derived user");
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      ...(phone ? { phone } : {}),
      ...(firstName ? { first_name: firstName } : {}),
      ...(lastName ? { last_name: lastName } : {}),
    },
  });

  if (error || !data.user) {
    throw error || new Error("Failed to create phone-derived user");
  }

  return data.user.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, email, password, phone, firstName, lastName } =
      await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase admin credentials" }),
        { status: 500, headers: corsHeaders },
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    let targetUserId = userId as string | undefined;

    if (!targetUserId && email) {
      if (typeof email !== "string" || !email.endsWith(PHONE_AUTH_DOMAIN)) {
        return new Response(
          JSON.stringify({ error: "Not a phone-derived account" }),
          { status: 403, headers: corsHeaders },
        );
      }

      targetUserId = await ensurePhoneDerivedUser(supabaseAdmin, {
        email,
        password,
        phone,
        firstName,
        lastName,
      });
    }

    if (!targetUserId) {
      return new Response(
        JSON.stringify({ error: "userId or email is required" }),
        { status: 400, headers: corsHeaders },
      );
    }

    const { data: userData, error: getUserError } =
      await supabaseAdmin.auth.admin.getUserById(targetUserId);

    if (getUserError || !userData?.user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    if (!userData.user.email?.endsWith(PHONE_AUTH_DOMAIN)) {
      return new Response(
        JSON.stringify({ error: "Not a phone-derived account" }),
        { status: 403, headers: corsHeaders },
      );
    }

    const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUserId,
      { email_confirm: true },
    );

    if (confirmError) {
      throw confirmError;
    }

    return new Response(JSON.stringify({ success: true, userId: targetUserId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
