import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const project_id = searchParams.get("id");

  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase.from("projects").select(`
    project_id,
    project_name:name,
    team_lead:profiles(profile_id, username, avatar_url),
    created_at,
    joined_date:profile_project(created_at),
    description,
    tasks(
      task_id,
      content,
      status,
      inserted_at,
      profiles(username),
      deadline,
      progress,
      workers:profile_task(profiles(profile_id, username, avatar_url))
    ),
    project_members:profile_project(id, profiles(profile_id, username, avatar_url))
  `).eq('project_id', project_id);

  if (error) console.log(error);
  return NextResponse.json({
    data: data ? data[0] : null,
    error: error?.message || ""
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const profile_id = searchParams.get("profile");
  const project_id = searchParams.get("project");

  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase.from("profile_project")
    .delete()
    .eq('profile_id', profile_id)
    .eq('project_id', project_id)
    .select(`
      profiles(profile_id)
    `);

  if (error) console.log(error);
  return NextResponse.json({
    id: data ? data[0].profiles?.profile_id : null,
    error: error?.message || ""
  });
}