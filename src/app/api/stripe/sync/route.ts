import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { syncStripeCatalog } from "@/lib/billing-server";
import { isAdminEmail } from "@/lib/auth-config";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress || "";
    if (!isAdminEmail(email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const synced = await syncStripeCatalog();
    return NextResponse.json({ success: true, synced });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
