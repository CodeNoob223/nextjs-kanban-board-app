import { Database } from "@/lib/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const project_id = searchParams.get("project");
  const message_id = searchParams.get("message");

  if (project_id) {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    const { data, error } = await supabase.from("messages").select(`
      message_id,
      project_id,
      created_at,
      content,
      profiles(profile_id, username, avatar_url)
    `).order('created_at', { ascending: true })
      .eq('project_id', parseInt(project_id));

    if (error) console.log(error);
    return NextResponse.json({ data: data, error: error?.message || "" });
  } else if (message_id) {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    const { data, error } = await supabase.from("messages").select(`
      message_id,
      project_id,
      created_at,
      content,
      profiles(profile_id, username, avatar_url)
    `)
      .eq('message_id', parseInt(message_id))
      .single();

    if (error) console.log(error);
    return NextResponse.json({ data: data, error: error?.message || "" });
  } else {
    return NextResponse.json({ data: null, error: "No params given!" });
  }

};

export async function POST(request: Request) {
  const { project_id, content } = await request.json();

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data, error } = await supabase.from("messages").insert({
    content: content,
    project_id: project_id
  }).select(`
    message_id,
    project_id,
    created_at,
    content,
    profiles(profile_id, username, avatar_url)
  `).single();

  if (error) console.log(error);
  return NextResponse.json({ data: data, error: error?.message || "" });
}