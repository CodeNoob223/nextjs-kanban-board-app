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
      profile_team: {
        Row: {
          created_at: string
          id: number
          team_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          team_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          team_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_team_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_team_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      profile_todo: {
        Row: {
          created_at: string
          id: number
          todo_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          todo_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          todo_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_todo_todo_id_fkey"
            columns: ["todo_id"]
            referencedRelation: "todos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_todo_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          role: string | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          role?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: number
          team_leader: string | null
          team_name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          team_leader?: string | null
          team_name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          team_leader?: string | null
          team_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_team_leader_fkey"
            columns: ["team_leader"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      todos: {
        Row: {
          deadline: string | null
          id: number
          inserted_at: string
          status: string | null
          task: string | null
          team_id: number | null
          user_id: string
        }
        Insert: {
          deadline?: string | null
          id?: number
          inserted_at?: string
          status?: string | null
          task?: string | null
          team_id?: number | null
          user_id?: string
        }
        Update: {
          deadline?: string | null
          id?: number
          inserted_at?: string
          status?: string | null
          task?: string | null
          team_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todos_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todos_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
