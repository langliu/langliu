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
      albums: {
        Row: {
          collected: boolean
          cover: string | null
          created_at: string
          id: number
          name: string | null
          organization: string | null
          picture_num: number | null
          updated_at: string | null
          video_num: number | null
        }
        Insert: {
          collected?: boolean
          cover?: string | null
          created_at?: string
          id?: number
          name?: string | null
          organization?: string | null
          picture_num?: number | null
          updated_at?: string | null
          video_num?: number | null
        }
        Update: {
          collected?: boolean
          cover?: string | null
          created_at?: string
          id?: number
          name?: string | null
          organization?: string | null
          picture_num?: number | null
          updated_at?: string | null
          video_num?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "albums_organization_fkey"
            columns: ["organization"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      articles: {
        Row: {
          bookId: number
          content: string | null
          created_at: string | null
          id: number
          serial: number | null
          title: string | null
        }
        Insert: {
          bookId: number
          content?: string | null
          created_at?: string | null
          id?: number
          serial?: number | null
          title?: string | null
        }
        Update: {
          bookId?: number
          content?: string | null
          created_at?: string | null
          id?: number
          serial?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_bookId_fkey"
            columns: ["bookId"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          }
        ]
      }
      books: {
        Row: {
          author: string | null
          cover: string | null
          created_at: string | null
          end: boolean
          id: number
          name: string | null
        }
        Insert: {
          author?: string | null
          cover?: string | null
          created_at?: string | null
          end?: boolean
          id?: number
          name?: string | null
        }
        Update: {
          author?: string | null
          cover?: string | null
          created_at?: string | null
          end?: boolean
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          asd: string | null
          id: number
          name: string
        }
        Insert: {
          asd?: string | null
          id?: number
          name: string
        }
        Update: {
          asd?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      models: {
        Row: {
          avatar: string | null
          created_at: string
          created_by: string | null
          homepage: string | null
          id: number
          instagram: string | null
          twitter: string | null
          updated_at: string
          username: string | null
          weibo: string | null
          youtube: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          created_by?: string | null
          homepage?: string | null
          id?: number
          instagram?: string | null
          twitter?: string | null
          updated_at?: string | null
          username?: string | null
          weibo?: string | null
          youtube?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          created_by?: string | null
          homepage?: string | null
          id?: number
          instagram?: string | null
          twitter?: string | null
          updated_at?: string | null
          username?: string | null
          weibo?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      models_albums: {
        Row: {
          album_id: number
          model_id: number
        }
        Insert: {
          album_id: number
          model_id: number
        }
        Update: {
          album_id?: number
          model_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "models_albums_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "models_albums_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          }
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          url?: string | null
        }
        Relationships: []
      }
      photos: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          tags: Json | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          tags?: Json | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          tags?: Json | null
          url?: string | null
        }
        Relationships: []
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
