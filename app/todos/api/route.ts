import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "1000");

  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.from("todos").select(`
    id,
    task,
    status,
    inserted_at,
    deadline,
    profiles (username),
    team_id
  `).limit(limit);

  if (error) console.log(error);
  return NextResponse.json({ data: data, error: error?.message || "" });
};

export async function POST(request: Request) {
  const { task } = await request.json();

  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.from("todos").insert({
    task: task
  }).select(`
    id,
    task,
    status,
    inserted_at,
    deadline,
    profiles (username),
    team_id
  `);

  if (error) console.log(error);
  return NextResponse.json({ data: data ? data[0] : null, error: error?.message || "" });
}

export async function PUT(request: Request) {
  const { id, from, to } = await request.json();

  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.from("todos").update({
    status: to as ToDo["status"]
  }).match({ id }).select(`
    id,
    task,
    status,
    inserted_at,
    deadline,
    profiles (username),
    team_id
  `);

  if (error) console.log(error);
  return NextResponse.json({ data: data ? data[0] : null, error: error?.message || "" });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase.from("todos").delete().eq('id', id).select('id');

  if (error) console.log(error);
  return NextResponse.json({ data: data ? data[0].id : null, error: error?.message || "" });
}