import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const user = await supabase.auth.getUser();

  if (user.error) return NextResponse.json({
    data: null,
    error: "Chưa đăng nhập!"
  });

  const { data, error } = await supabase.from("profile_project")
    .select(`
    id,
    created_at,
    projects (project_id, name, 
      profiles (username, profile_id, avatar_url), 
    description)
  `).eq("profile_id", user.data.user?.id);

  if (error) console.log(error);

  console.log("<GET: projects/api>: Fetch projects successfully!");

  return NextResponse.json({
    data: data?.map(project => {
      return {
        project_id: project.projects?.project_id,
        project_name: project.projects?.name,
        team_lead: {...project.projects?.profiles},
        joined_date: project.created_at,
        description: project.projects?.description
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
      projects (project_id, name, 
        profiles (profile_id, username, avatar_url), 
      description)
    `);

    if (error) console.log(error);
    return NextResponse.json({
      data: data?.map(project => {
        return {
          project_id: project.projects?.project_id,
          project_name: project.projects?.name,
          team_lead: {...project.projects?.profiles},
          joined_date: project.created_at,
          description: project.projects?.description
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
      team_lead:profiles(profile_id, username, avatar_url),
      joined_date:created_at,
      description
    `);

    if (error) console.log(error);
    return NextResponse.json({ data: data ? data[0] : null, error: error?.message || "" });
  }

}

export async function PUT(request: Request) {
  const { project_id, project_name, description } = await request.json();
  const supabase = createRouteHandlerClient<Database>({ cookies });
  let config: {
    name?: string,
    description?: string
  } = {}
  if (project_name) config.name = project_name
  if (description) config.description = description
    
  const { data, error } = await supabase.from("projects")
  .update(config)
  .eq("project_id", project_id)
    .select(`
    project_id,
    project_name:name,
    team_lead:profiles(profile_id, username, avatar_url),
    joined_date:created_at,
    description
  `);

  if (error) console.log(error);
  return NextResponse.json({ data: data ? data[0] : null, error: error?.message || "" });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const flag = searchParams.get("flag");
  const project_id = searchParams.get("project");
  const profile_id = searchParams.get("profile");

  const supabase = createRouteHandlerClient<Database>({ cookies });

  if (flag === "leave") {
    const { data, error } = await supabase.from("profile_project")
      .delete()
      .eq("project_id", project_id)
      .eq("profile_id", profile_id)
      .select(`projects(name)`);

    if (error) console.log(error);
    return NextResponse.json({ id: data ? data[0].projects?.name : null, error: error?.message || "" });
  } else if (flag === "delete") {
    const { data, error } = await supabase.from("projects")
      .delete()
      .eq("project_id", project_id)
      .eq("profile_id", profile_id)
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