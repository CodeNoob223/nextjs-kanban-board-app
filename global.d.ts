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

  interface Task {
    task_id: number,
    content: string | null,
    status: "Pending" | "Working" | "Done",
    inserted_at: string,
    profiles: {
      username: string | null,
    } | null,
    deadline: string | null,
    project_id: string | null,
    project_data?: Project,
    progress: number
  }

  type GetSupaBaseRes<T> = {
    data: T[],
    error: string
  }

  type PostSupaBaseRes<T> = {
    data: T,
    error: string
  }

  type PutSupaBaseRes<T> = PostSupaBaseRes<T>;

  type DeleteSupaBaseRes = {
    id: number,
    error: string
  }

  interface Project {
    project_id: number,
    project_name: string,
    team_lead: string,
    joined_date: string
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