export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
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
            foreignKeyName: 'articles_bookId_fkey'
            columns: ['bookId']
            isOneToOne: false
            referencedRelation: 'books'
            referencedColumns: ['id']
          },
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
