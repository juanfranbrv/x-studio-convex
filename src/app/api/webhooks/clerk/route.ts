import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/../convex/_generated/api";
import { log } from "@/lib/logger";

export const runtime = "nodejs";

type ClerkEmailAddress = {
  id: string;
  email_address: string;
};

type ClerkUserPayload = {
  id?: string;
  primary_email_address_id?: string;
  email_addresses?: ClerkEmailAddress[];
};

function getPrimaryEmail(data: ClerkUserPayload): string | null {
  const primaryEmailId = data?.primary_email_address_id;
  const addresses = Array.isArray(data?.email_addresses) ? data.email_addresses : [];
  const primary = addresses.find((item) => item?.id === primaryEmailId) || addresses[0];
  const email = primary?.email_address;
  return typeof email === "string" && email.trim() ? email.trim() : null;
}

export async function POST(req: NextRequest) {
  try {
    const event = await verifyWebhook(req);
    const eventType = event.type;
    const data = event.data as ClerkUserPayload;
    const clerkId = data?.id as string | undefined;

    if (!clerkId) {
      log.warn("API", "[CLERK_WEBHOOK] Evento sin clerkId, ignorado", { eventType });
      return NextResponse.json({ ok: true, ignored: true }, { status: 200 });
    }

    if (eventType === "user.deleted") {
      await fetchMutation(api.users.deleteUserByClerkId, { clerk_id: clerkId });
      log.success("API", "[CLERK_WEBHOOK] Usuario eliminado sincronizado", { clerkId });
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (eventType === "user.created" || eventType === "user.updated") {
      const email = getPrimaryEmail(data);
      if (!email) {
        log.warn("API", "[CLERK_WEBHOOK] Usuario sin email primario, ignorado", { clerkId, eventType });
        return NextResponse.json({ ok: true, ignored: true }, { status: 200 });
      }

      const sync = await fetchMutation(api.users.syncUserFromClerkWebhook, {
        clerk_id: clerkId,
        email,
      });

      const client = await clerkClient();
      await client.users.updateUserMetadata(clerkId, {
        publicMetadata: {
          role: sync.role,
          status: sync.status,
        },
      });

      log.success("API", "[CLERK_WEBHOOK] Usuario sincronizado", {
        clerkId,
        eventType,
        action: sync.action,
        role: sync.role,
        status: sync.status,
      });

      return NextResponse.json({ ok: true }, { status: 200 });
    }

    log.debug("API", "[CLERK_WEBHOOK] Evento no manejado", { eventType });
    return NextResponse.json({ ok: true, ignored: true }, { status: 200 });
  } catch (error) {
    log.error("API", "[CLERK_WEBHOOK] Error procesando webhook", error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
