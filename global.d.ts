import { PostgrestError, User } from "@supabase/supabase-js";

export { };

declare global {
  interface SearchState {
    search: string,
    data: berry[]
  }

  interface AppNotification {
    id: string,
    type: "success" | "error" | "warning" | "normal",
    content: string
  }

  interface ToDo {
    id: number,
    task: string | null,
    status: "Pending" | "Working" | "Done",
    inserted_at: string,
    profiles: {
      username: string | null,
    } | null,
    deadline: string | null,
    team_id: string | null
  }

  interface ToDoColProps {
    title: string,

  }

  type GetSupaBaseRes = {
    data: ToDo[],
    error: string
  }

  type PostSupaBaseRes = {
    data: ToDo,
    error: string
  }

  type PutSupaBaseRes = PostSupaBaseRes;

  type DeleteSupaBaseRes = {
    id: number,
    error: string
  }

  type DroppableIds = "working" | "pending" | "done";

  interface UserState extends User {
    role: string | null,
    updated_at: string | null,
    avatar_url: string | null,
    full_name: string | null,
    id: string,
    role: string | null,
    updated_at: string | null,
    username: string | null,
    app_metadata?: any, 
    user_metadata?: any, 
    aud?: any, 
    created_at?: any
  }
}