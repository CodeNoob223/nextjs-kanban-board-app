export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          content: string | null
          created_at: string
          message_id: number
          profile_id: string | null
          project_id: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          message_id?: number
          profile_id?: string | null
          project_id?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string
          message_id?: number
          profile_id?: string | null
          project_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "messages_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          }
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          notification_id: number
          profile_id: string | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          notification_id?: number
          profile_id?: string | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          notification_id?: number
          profile_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          }
        ]
      }
      profile_project: {
        Row: {
          created_at: string
          id: number
          profile_id: string | null
          project_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          profile_id?: string | null
          project_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          profile_id?: string | null
          project_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_project_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "profile_project_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          }
        ]
      }
      profile_task: {
        Row: {
          created_at: string
          id: number
          task_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          task_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          task_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_task_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "tasks"
            referencedColumns: ["task_id"]
          },
          {
            foreignKeyName: "profile_task_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          profile_id: string
          role: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          profile_id: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          profile_id?: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          name: string
          profile_id: string | null
          project_id: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          name: string
          profile_id?: string | null
          project_id?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          name?: string
          profile_id?: string | null
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "projects_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          }
        ]
      }
      reports: {
        Row: {
          content: string
          created_at: string
          profile_id: string | null
          project_id: number | null
          report_id: number
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          profile_id?: string | null
          project_id?: number | null
          report_id?: number
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          profile_id?: string | null
          project_id?: number | null
          report_id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "reports_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          }
        ]
      }
      tasks: {
        Row: {
          content: string | null
          deadline: string | null
          inserted_at: string
          profile_id: string
          progress: number
          project_id: number | null
          status: string | null
          task_id: number
        }
        Insert: {
          content?: string | null
          deadline?: string | null
          inserted_at?: string
          profile_id?: string
          progress?: number
          project_id?: number | null
          status?: string | null
          task_id?: number
        }
        Update: {
          content?: string | null
          deadline?: string | null
          inserted_at?: string
          profile_id?: string
          progress?: number
          project_id?: number | null
          status?: string | null
          task_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tasks_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      hello: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
