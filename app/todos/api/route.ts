import { Database } from "@/lib/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "1000");

  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.from("tasks").select(`
    task_id,
    content,
    status,
    inserted_at,
    deadline,
    profiles (username),
    progress,
    project_id
  `).limit(limit);

  if (error) console.log(error);
  return NextResponse.json({ data: data, error: error?.message || "" });
};

export async function POST(request: Request) {
  const { task, deadline } = await request.json();

  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase.from("tasks").insert({
    task: task,
    deadline: deadline || null
  }).select(`
    task_id,
    content,
    status,
    inserted_at,
    deadline,
    profiles (username),
    progress,
    project_id
  `);

  if (error) console.log(error);
  return NextResponse.json({ data: data ? data[0] : null, error: error?.message || "" });
}

export async function PUT(request: Request) {
  const { id, to } = await request.json();

  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.from("tasks").update({
    status: to as Task["status"]
  }).match({ task_id: id }).select(`
    task_id,
    content,
    status,
    inserted_at,
    deadline,
    profiles (username),
    progress,
    project_id
  `);

  if (error) console.log(error);
  return NextResponse.json({ data: data ? data[0] : null, error: error?.message || "" });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase.from("tasks").delete().eq('task_id', id).select('task_id');

  if (error) console.log(error);
  return NextResponse.json({ data: data ? data[0].task_id : null, error: error?.message || "" });
}