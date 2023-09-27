import { PostgrestError, User } from "@supabase/supabase-js";
import { Database } from "./lib/database.types";

export { };

declare global {
  interface SearchState {
    search: string,
    data: berry[]
  }

  interface ForeignUser extends Database["public"]["Tables"]["profiles"]["Row"] {
    username: string,
    full_name: string,
    avatar_url: string,
    completed_tasks: number[],
    projects_joined: number[],
    reports_written: number[]
  };

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
    project_id: number | null,
    project_data?: Project,
    progress: number,
    workers: {
      profiles: {
        profile_id: string,
        username: string,
        avatar_url: string
      }
    }[]
  }

  type GetSupaBaseResSingle<T> = {
    data: T,
    error: string
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
    id: number | string,
    error: string
  }

  interface ProjectReport {
    report_id: number,
    created_at: string,
    profiles: {
      profile_id: string,
      username: string,
      full_name: string,
      avatar_url: string
    },
    content: string,
    title: string,
    projects: {
      project_id: number,
      project_name: string,
      team_lead: {
        profile_id: string,
        username: string,
        avatar_url: string
      }
    }
  }

  interface ChatMessage {
    message_id: number,
    created_at: string,
    project_id: number,
    profiles: {
      profile_id: string,
      username: string,
      avatar_url: string
    },
    content: string
  }

  interface ServerNotification {
    notification_id: number,
    created_at: string,
    content: string,
    title: string,
    profile_id: string
  }

  interface ServerNotifState {
    new: boolean,
    data: ServerNotification[]
  }

  interface Project {
    project_id: number,
    project_name: string,
    team_lead: {
      profile_id: string,
      username: string,
      avatar_url: string
    },
    created_at: string,
    joined_date: string,
    description: string,
    tasks: Task[],
    project_members: {
      id: number,
      profiles: {
        profile_id: string,
        username: string,
        avatar_url: string
      }
    }[]
  }

  type DroppableIds = "working" | "pending" | "done";

  interface UserState extends User {
    role: string | null,
    updated_at: string | null,
    avatar_url: string | null,
    full_name: string | null,
    profile_id: string,
    role: string | null,
    updated_at: string | null,
    username: string | null,
    app_metadata?: any,
    user_metadata?: any,
    aud?: any,
    created_at?: any,
    projects: Project[]
  }
}