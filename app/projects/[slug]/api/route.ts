import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const team_id = searchParams.get("id");

  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase.from("todos").select(`
    id,
    profiles (username),
    task,
    inserted_at,
    deadline,
    status,
    team_data:teams (
      team_id:id, 
      team_name, 
      joined_date:created_at, 
      team_lead:profiles(username)
    )
  `).eq('team_id', team_id);

  if (error) console.log(error);
  return NextResponse.json({
    data: data,
    error: error?.message || ""
  });
}