import { Webhook } from "svix";
import { headers } from "next/headers";
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    console.error("SIGNING_SECRET is not set in environment variables.");
    return new Response("Error: Missing SIGNING_SECRET", { status: 500 });
  }

  const wh = new Webhook(SIGNING_SECRET);

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers:", {
      svix_id,
      svix_timestamp,
      svix_signature,
    });
    return new Response("Error: Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error(
      "Webhook verification failed. Check headers or SIGNING_SECRET.",
      err
    );
    return new Response("Error: Verification error", { status: 400 });
  }

  const { id } = evt?.data;
  const eventType = evt?.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { first_name, last_name, image_url, email_addresses } = evt?.data;
    try {
      const user = await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email_addresses
      );
      if (user && eventType === "user.created") {
        try {
          await clerkClient.user.updateUserMetadata(id, {
            publicMetadata: {
              userMogoId: user._id,
            },
          });
        } catch (error) {
          console.error("Error updating user metadata:", error);
        }
      }
    } catch (error) {
      console.error("Error in createOrUpdateUser:", error.message || error);
      return new Response("Error: Could not create or update user", {
        status: 500,
      });
    }
  }

  if (eventType === "user.deleted") {
    try {
      await deleteUser(id);
    } catch (error) {
      console.error("Error deleting user:", error.message || error);
      return new Response("Error: Could not delete user", { status: 500 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
