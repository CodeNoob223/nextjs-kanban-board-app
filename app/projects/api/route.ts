import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase.from("profile_project")
    .select(`
    id,
    created_at,
    projects (project_id, name, profiles (username))
  `);

  if (error) console.log(error);
  return NextResponse.json({
    data: data?.map(team => {
      return {
        project_id: team.projects?.project_id,
        project_name: team.projects?.name,
        team_lead: team.projects?.profiles?.username,
        joined_date: team.created_at
      }
    }),
    error: error?.message || ""
  });
}

export async function POST(request: Request) {
  const { project_id, project_name } = await request.json();

  const supabase = createRouteHandlerClient<Database>({ cookies });

  if (project_id && project_name) {
    const { data, error } = await supabase.from("profile_project").insert({
      project_id: project_id
    }).select(`
      id,
      created_at,
      projects (project_id, name, profiles (username))
    `);

    if (error) console.log(error);
    return NextResponse.json({
      data: data?.map(team => {
        return {
          project_id: team.projects?.project_id,
          project_name: team.projects?.name,
          team_lead: team.projects?.profiles?.username,
          joined_date: team.created_at
        }
      })[0],
      error: error?.message || ""
    });

  } else if (project_name) {
    const { data, error } = await supabase.from("projects").insert({
      name: project_name
    }).select(`
      project_id,
      project_name:name,
      team_lead:profiles(username),
      joined_date:created_at
    `);

    if (error) console.log(error);
    return NextResponse.json({ data: data ? data[0] : null, error: error?.message || "" });
  }

}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const flag = searchParams.get("flag");
  const id = searchParams.get("id");

  const supabase = createRouteHandlerClient<Database>({ cookies });

  if (flag === "leave") {
    const { data, error } = await supabase.from("profile_project")
      .delete()
      .eq("project_id", id)
      .select(`projects(name)`);

    if (error) console.log(error);
    return NextResponse.json({ id: data ? data[0].projects?.name : null, error: error?.message || "" });
  } else if (flag === "delete") {
    const { data, error } = await supabase.from("projects")
      .delete()
      .eq("project_id", id)
      .select(`name`);

    if (error) console.log(error);
    return NextResponse.json({ id: data ? data[0].name : null, error: error?.message || "" });
  } else {
    return NextResponse.json({
      id: 0,
      error: "Invalid flag!"
    });
  }
} 