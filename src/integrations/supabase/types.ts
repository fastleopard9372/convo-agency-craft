export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      AgentJob: {
        Row: {
          budgetMax: number | null
          budgetMin: number | null
          description: string | null
          id: string
          metadata: Json | null
          postedAt: string | null
          scrapedAt: string
          source: string | null
          title: string
          userId: string
        }
        Insert: {
          budgetMax?: number | null
          budgetMin?: number | null
          description?: string | null
          id: string
          metadata?: Json | null
          postedAt?: string | null
          scrapedAt?: string
          source?: string | null
          title: string
          userId: string
        }
        Update: {
          budgetMax?: number | null
          budgetMin?: number | null
          description?: string | null
          id?: string
          metadata?: Json | null
          postedAt?: string | null
          scrapedAt?: string
          source?: string | null
          title?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "AgentJob_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["userId"]
          },
        ]
      }
      Conversation: {
        Row: {
          createdAt: string
          endedAt: string | null
          id: string
          messageCount: number
          metadata: Json
          sessionId: string | null
          startedAt: string
          status: string
          summary: string | null
          totalTokens: number
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          endedAt?: string | null
          id: string
          messageCount?: number
          metadata?: Json
          sessionId?: string | null
          startedAt?: string
          status?: string
          summary?: string | null
          totalTokens?: number
          updatedAt: string
          userId: string
        }
        Update: {
          createdAt?: string
          endedAt?: string | null
          id?: string
          messageCount?: number
          metadata?: Json
          sessionId?: string | null
          startedAt?: string
          status?: string
          summary?: string | null
          totalTokens?: number
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Conversation_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["userId"]
          },
        ]
      }
      ConversationTag: {
        Row: {
          conversationId: string
          tagId: number
        }
        Insert: {
          conversationId: string
          tagId: number
        }
        Update: {
          conversationId?: string
          tagId?: number
        }
        Relationships: [
          {
            foreignKeyName: "ConversationTag_conversationId_fkey"
            columns: ["conversationId"]
            isOneToOne: false
            referencedRelation: "Conversation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ConversationTag_tagId_fkey"
            columns: ["tagId"]
            isOneToOne: false
            referencedRelation: "Tag"
            referencedColumns: ["id"]
          },
        ]
      }
      FileAccessLog: {
        Row: {
          accessedAt: string
          accessType: string
          fileId: string
          id: string
          userId: string
        }
        Insert: {
          accessedAt?: string
          accessType: string
          fileId: string
          id: string
          userId: string
        }
        Update: {
          accessedAt?: string
          accessType?: string
          fileId?: string
          id?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "FileAccessLog_fileId_fkey"
            columns: ["fileId"]
            isOneToOne: false
            referencedRelation: "NasFile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FileAccessLog_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["userId"]
          },
        ]
      }
      MemoryRule: {
        Row: {
          actions: Json
          conditions: Json
          createdAt: string
          id: string
          isActive: boolean
          ruleType: string
          updatedAt: string
          userId: string
        }
        Insert: {
          actions: Json
          conditions: Json
          createdAt?: string
          id: string
          isActive?: boolean
          ruleType: string
          updatedAt: string
          userId: string
        }
        Update: {
          actions?: Json
          conditions?: Json
          createdAt?: string
          id?: string
          isActive?: boolean
          ruleType?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "MemoryRule_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["userId"]
          },
        ]
      }
      MemoryTrigger: {
        Row: {
          conversationId: string
          details: Json | null
          id: string
          triggeredAt: string
          triggerType: string
        }
        Insert: {
          conversationId: string
          details?: Json | null
          id: string
          triggeredAt?: string
          triggerType: string
        }
        Update: {
          conversationId?: string
          details?: Json | null
          id?: string
          triggeredAt?: string
          triggerType?: string
        }
        Relationships: [
          {
            foreignKeyName: "MemoryTrigger_conversationId_fkey"
            columns: ["conversationId"]
            isOneToOne: false
            referencedRelation: "Conversation"
            referencedColumns: ["id"]
          },
        ]
      }
      Message: {
        Row: {
          content: string
          conversationId: string
          filePath: string
          id: string
          metadata: Json | null
          role: string
          timestamp: string
          tokenCount: number | null
          vectorId: string | null
        }
        Insert: {
          content?: string
          conversationId: string
          filePath?: string
          id: string
          metadata?: Json | null
          role: string
          timestamp?: string
          tokenCount?: number | null
          vectorId?: string | null
        }
        Update: {
          content?: string
          conversationId?: string
          filePath?: string
          id?: string
          metadata?: Json | null
          role?: string
          timestamp?: string
          tokenCount?: number | null
          vectorId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Message_conversationId_fkey"
            columns: ["conversationId"]
            isOneToOne: false
            referencedRelation: "Conversation"
            referencedColumns: ["id"]
          },
        ]
      }
      NasFile: {
        Row: {
          checksum: string | null
          conversationId: string | null
          createdAt: string
          fileName: string
          filePath: string
          fileSize: number | null
          fileType: string | null
          folderPath: string
          id: string
          indexedAt: string | null
          lastAccessed: string | null
          metadata: Json | null
          mimeType: string | null
          modifiedAt: string
          summary: string | null
          tags: string[] | null
          title: string | null
          userId: string
          vectorIds: string[] | null
        }
        Insert: {
          checksum?: string | null
          conversationId?: string | null
          createdAt?: string
          fileName: string
          filePath: string
          fileSize?: number | null
          fileType?: string | null
          folderPath: string
          id: string
          indexedAt?: string | null
          lastAccessed?: string | null
          metadata?: Json | null
          mimeType?: string | null
          modifiedAt?: string
          summary?: string | null
          tags?: string[] | null
          title?: string | null
          userId: string
          vectorIds?: string[] | null
        }
        Update: {
          checksum?: string | null
          conversationId?: string | null
          createdAt?: string
          fileName?: string
          filePath?: string
          fileSize?: number | null
          fileType?: string | null
          folderPath?: string
          id?: string
          indexedAt?: string | null
          lastAccessed?: string | null
          metadata?: Json | null
          mimeType?: string | null
          modifiedAt?: string
          summary?: string | null
          tags?: string[] | null
          title?: string | null
          userId?: string
          vectorIds?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "NasFile_conversationId_fkey"
            columns: ["conversationId"]
            isOneToOne: false
            referencedRelation: "Conversation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "NasFile_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["userId"]
          },
        ]
      }
      Profile: {
        Row: {
          createdAt: string
          email: string
          id: string
          memoryQuotaMb: number
          settings: Json
          updatedAt: string
          userId: string
          username: string | null
        }
        Insert: {
          createdAt?: string
          email: string
          id: string
          memoryQuotaMb?: number
          settings?: Json
          updatedAt: string
          userId: string
          username?: string | null
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          memoryQuotaMb?: number
          settings?: Json
          updatedAt?: string
          userId?: string
          username?: string | null
        }
        Relationships: []
      }
      Proposal: {
        Row: {
          content: string
          conversationId: string | null
          generatedAt: string
          id: string
          jobId: string
          metadata: Json | null
          status: string | null
          submittedAt: string | null
        }
        Insert: {
          content: string
          conversationId?: string | null
          generatedAt?: string
          id: string
          jobId: string
          metadata?: Json | null
          status?: string | null
          submittedAt?: string | null
        }
        Update: {
          content?: string
          conversationId?: string | null
          generatedAt?: string
          id?: string
          jobId?: string
          metadata?: Json | null
          status?: string | null
          submittedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Proposal_conversationId_fkey"
            columns: ["conversationId"]
            isOneToOne: false
            referencedRelation: "Conversation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Proposal_jobId_fkey"
            columns: ["jobId"]
            isOneToOne: false
            referencedRelation: "AgentJob"
            referencedColumns: ["id"]
          },
        ]
      }
      SearchQuery: {
        Row: {
          createdAt: string
          executionTimeMs: number | null
          filePaths: string[] | null
          id: string
          queryText: string
          queryType: string
          userId: string
        }
        Insert: {
          createdAt?: string
          executionTimeMs?: number | null
          filePaths?: string[] | null
          id: string
          queryText: string
          queryType: string
          userId: string
        }
        Update: {
          createdAt?: string
          executionTimeMs?: number | null
          filePaths?: string[] | null
          id?: string
          queryText?: string
          queryType?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "SearchQuery_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["userId"]
          },
        ]
      }
      Tag: {
        Row: {
          category: string | null
          color: string | null
          createdAt: string
          id: number
          name: string
          userId: string
        }
        Insert: {
          category?: string | null
          color?: string | null
          createdAt?: string
          id?: number
          name: string
          userId: string
        }
        Update: {
          category?: string | null
          color?: string | null
          createdAt?: string
          id?: number
          name?: string
          userId?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
