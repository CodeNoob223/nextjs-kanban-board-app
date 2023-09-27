import { Database } from "@/lib/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profile_id = searchParams.get("profile");

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data, error } = await supabase.from("profiles").select(
    `
      *,
      completed_tasks:tasks(task_id),
      projects_joined:profile_project(id),
      reports_written:reports(report_id)
    `
  ).eq('profile_id',profile_id)
  .eq('tasks.status', "Done")
  .single();

  if (error) console.log(error);
  return NextResponse.json({ data: data, error: error?.message || "" });
};