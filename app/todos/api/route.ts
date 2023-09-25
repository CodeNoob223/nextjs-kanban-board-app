import { Database } from "@/lib/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "1000");
  const task_id = parseInt(searchParams.get("task_id") || "");

  if (task_id) {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data, error } = await supabase.from("tasks").select(`
      task_id,
      content,
      status,
      inserted_at,
      deadline,
      profiles (username),
      progress,
      project_id,
      workers:profile_task(profiles(profile_id, username, avatar_url))
    `).eq("task_id", task_id).single();

    if (error) console.log(error);
    return NextResponse.json({ data: data ?? null, error: error?.message || "" });
  } else {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data, error } = await supabase.from("tasks").select(`
      task_id,
      content,
      status,
      inserted_at,
      deadline,
      profiles (username),
      progress,
      project_id,
      workers:profile_task(profiles(profile_id, username, avatar_url))
    `).limit(limit);

    if (error) console.log(error);
    return NextResponse.json({ data: data, error: error?.message || "" });
  }
};

export async function POST(request: Request) {
  const { content, deadline, project_id } = await request.json();

  let config = {
    content: content,
    deadline: deadline || null
  } as {
    content: string,
    deadline: string,
    project_id?: number
  }

  if (project_id) {
    config = {
      ...config,
      project_id: parseInt(project_id)
    }
  }
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase.from("tasks").insert(config)
    .select(`
    task_id,
    content,
    status,
    inserted_at,
    deadline,
    profiles (username),
    progress,
    project_id,
    workers:profile_task(profiles(profile_id, username, avatar_url))
    
  `);

  if (error) console.log(error);
  return NextResponse.json({ data: data ? data[0] : null, error: error?.message || "" });
}

export async function PUT(request: Request) {
  const { id, to, progress, workers }: {
    id: number,
    progress: string,
    to: Task["status"],
    workers: Task["workers"]
  } = await request.json();

  const supabase = createRouteHandlerClient({ cookies });

  if (workers && workers.length === 0 && to !== "Pending") {
    const res = await supabase.from("profile_task").insert({
      task_id: id
    });

    if (res.error) {
      console.log(res.error);
      return NextResponse.json({
        data: null,
        error: res.error
      });
    }
  }


  let config = {
    status: to as Task["status"]
  } as {
    content: string,
    status: Task["status"],
    deadline: string,
    progress: number
  }

  if (progress) config.progress = parseInt(progress);
  if (config.status === "Done") config.progress = 100;

  const { data, error } = await supabase.from("tasks").update(config)
    .match({ task_id: id }).select(`
    task_id,
    content,
    status,
    inserted_at,
    deadline,
    profiles (username),
    progress,
    project_id,
    workers:profile_task(profiles(profile_id, username, avatar_url))
  `);

  if (error) console.log(error);
  return NextResponse.json({ data: data ? data[0] : null, error: error?.message || "" });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({
      id: null,
      error: "No id given!"
    });
  }

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data, error } = await supabase.from("tasks").delete().eq('task_id', parseInt(id!)).select('task_id');

  if (data) {
    if (data.length === 0) {
      return NextResponse.json({ data: null, error: "Bạn không có quyền xóa!" });
    }
  }

  return NextResponse.json({ data: data ? data[0] : null, error: error?.message || "" });
}