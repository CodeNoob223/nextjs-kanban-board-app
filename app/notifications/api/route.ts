import { Database } from "@/lib/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data, error } = await supabase.from("notifications")
  .select()
  .order('created_at', {
    ascending: false
  });

  if (error) console.log(error);
  return NextResponse.json({ data: data, error: error?.message || "" });
};

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const notif_id = searchParams.get("id");

  if (!notif_id) return NextResponse.json({
    id: null,
    error: "No id provided!"
  });

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data, error } = await supabase.from("notifications")
  .delete()
  .eq("notification_id", notif_id)
  .select()
  .single();

  if (error) console.log(error);
  return NextResponse.json({ id: data?.notification_id, error: error?.message || "" });
};

export async function POST(request: Request) {
  const { title, inviteContent, profile_id } = await request.json();

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { error } = await supabase.from("notifications")
  .insert({
    content: inviteContent,
    title,
    profile_id
  });

  if (error) console.log(error);
  return NextResponse.json({ id: 0, error: error?.message || "" });
};