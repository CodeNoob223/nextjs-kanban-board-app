import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const project_id = searchParams.get("project");
  const report_id = searchParams.get("report");

  const supabase = createRouteHandlerClient<Database>({ cookies });
  if (project_id) {
    const { data, error } = await supabase.from("reports")
      .select(`
        report_id,
        created_at,
        profiles(profile_id, username, full_name, avatar_url),
        title,
        content,
        projects(project_id, project_name:name, team_lead:profiles(profile_id, username, avatar_url))
      `)
      .eq('project_id', project_id)
      .order('created_at', {
        ascending: false
      });

    if (error) console.log(error);
    return NextResponse.json({
      data: data ? data : null,
      error: error?.message || ""
    });
  } else if (report_id) {
    const { data, error } = await supabase.from("reports")
      .select(`
        report_id,
        created_at,
        profiles(profile_id, username, full_name, avatar_url),
        title,
        content,
        projects(project_id, project_name:name, team_lead:profiles(profile_id, username, avatar_url))
      `)
      .eq('report_id', report_id)
      .single();

    if (error) console.log(error);
    return NextResponse.json({
      data: data ? data : null,
      error: error?.message || ""
    });
  } else {
    return NextResponse.json({
      data: null,
      error: "No params provided!"
    })
  }
}

export async function POST(request: Request) {
  const { project_id, content, title } = await request.json();

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data, error } = await supabase.from("reports")
    .insert({
      project_id,
      content,
      title
    })
    .select(`
      report_id,
      created_at,
      profiles(profile_id, username, full_name, avatar_url),
      title,
      content,
      projects(project_id, project_name:name, team_lead:profiles(profile_id, username, avatar_url))
    `)
    .single();

  if (error) console.log(error);
  return NextResponse.json({
    data: data ?? null,
    error: error?.message || ""
  });
}

export async function PUT(request: Request) {
  const { report_id, content, title } = await request.json();

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data, error } = await supabase.from("reports")
    .update({
      content,
      title
    })
    .eq('report_id', report_id)
    .select(`
      report_id,
      created_at,
      profiles(profile_id, username, full_name, avatar_url),
      title,
      content,
      projects(project_id, project_name:name, team_lead:profiles(profile_id, username, avatar_url))
    `)
    .single();

  if (error) console.log(error);
  return NextResponse.json({
    data: data ?? null,
    error: error?.message || ""
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const report_id = searchParams.get("report");

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data, error } = await supabase.from("reports")
    .delete()
    .eq('report_id', report_id)
    .select(`report_id`)
    .single();

  if (error) console.log(error);
  return NextResponse.json({
    id: data ? data.report_id : null,
    error: error?.message || ""
  });
}