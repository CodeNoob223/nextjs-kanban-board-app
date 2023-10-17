import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profile_id = searchParams.get("profile");
  const project_id = searchParams.get("project");

  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase.from("profile_project")
    .select(`
    id,
    profiles(profile_id,avatar_url,username)
  `).eq("profile_id", profile_id)
    .eq("project_id", project_id)
    .single();

  if (error) console.log(error);

  return NextResponse.json({
    data: data ?? null,
    error: error?.message || ""
  });
}

export async function POST(request: Request) {
  const { task_id } = await request.json();

  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase.from("profile_task").insert({
    task_id
  }).select(`
    tasks(*, 
      profiles(*), 
      workers:profile_task(
        profiles(profile_id, avatar_url, username)
      )
    )
  `);

  if (error) console.log(error);

  return NextResponse.json({
    id: data ? data[0] : null,
    error: error?.message || ""
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const profile_id = searchParams.get("profile");
  const task_id = searchParams.get("task");
  const workers_left = searchParams.get("length");

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data, error } = await supabase.from("profile_task")
    .delete()
    .eq('profile_id', profile_id)
    .eq('task_id', task_id)
    .select(`
      profiles(profile_id)
    `);

  if (error) console.log("Delete task member: ", error);

  if (workers_left && parseInt(workers_left) === 1) {
    const res = await supabase.from("tasks").update({
      status: "Pending"
    }).eq('task_id', task_id);

    if (res.error) console.log("Change status: ", res.error);
  }
  return NextResponse.json({
    id: data ? data[0].profiles?.profile_id : null,
    error: error?.message || ""
  });
}