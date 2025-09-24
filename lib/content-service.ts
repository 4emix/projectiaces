import { createClient } from "@/lib/supabase/server"
import type { HeroContent, AboutContent, BoardMember, MagazineArticle, ContactInfo, LocalCommittee } from "@/lib/types"

export class ContentService {
  private static async getSupabase() {
    return await createClient()
  }

  // Hero Content
  static async getActiveHeroContent(): Promise<HeroContent | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from("hero_content")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Error fetching hero content:", error)
      return null
    }

    return data && data.length > 0 ? data[0] : null
  }

  static async updateHeroContent(id: string, updates: Partial<HeroContent>): Promise<HeroContent | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from("hero_content")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating hero content:", error)
      return null
    }
    return data
  }

  // About Content
  static async getActiveAboutContent(): Promise<AboutContent | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from("about_content")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Error fetching about content:", error)
      return null
    }

    return data && data.length > 0 ? data[0] : null
  }

  static async updateAboutContent(id: string, updates: Partial<AboutContent>): Promise<AboutContent | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from("about_content")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating about content:", error)
      return null
    }
    return data
  }

  // Board Members
  static async getActiveBoardMembers(): Promise<BoardMember[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from("board_members")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching board members:", error)
      return []
    }
    return data || []
  }

  static async getAllBoardMembers(): Promise<BoardMember[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase.from("board_members").select("*").order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching all board members:", error)
      return []
    }
    return data || []
  }

  static async createBoardMember(
    member: Omit<BoardMember, "id" | "created_at" | "updated_at">,
  ): Promise<BoardMember | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase.from("board_members").insert(member).select().single()

    if (error) {
      console.error("Error creating board member:", error)
      return null
    }
    return data
  }

  static async updateBoardMember(id: string, updates: Partial<BoardMember>): Promise<BoardMember | null> {
    console.log("[v0] ContentService: Starting updateBoardMember with id:", id)
    console.log("[v0] ContentService: Updates object:", JSON.stringify(updates, null, 2))

    const supabase = await this.getSupabase()
    console.log("[v0] ContentService: Supabase client created")

    const updateData = { ...updates, updated_at: new Date().toISOString() }
    console.log("[v0] ContentService: Final update data:", JSON.stringify(updateData, null, 2))

    const { data, error } = await supabase.from("board_members").update(updateData).eq("id", id).select().single()

    console.log("[v0] ContentService: Supabase response - data:", data)
    console.log("[v0] ContentService: Supabase response - error:", error)

    if (error) {
      console.error("[v0] ContentService: Error updating board member:", error)
      return null
    }

    console.log("[v0] ContentService: Returning data:", data)
    return data
  }

  static async deleteBoardMember(id: string): Promise<boolean> {
    const supabase = await this.getSupabase()
    const { error } = await supabase.from("board_members").delete().eq("id", id)

    if (error) {
      console.error("Error deleting board member:", error)
      return false
    }
    return true
  }

  // Magazine Articles
  static async getActiveMagazineArticles(): Promise<MagazineArticle[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from("magazine_articles")
      .select("*")
      .eq("is_active", true)
      .order("publication_date", { ascending: false })

    if (error) {
      console.error("Error fetching magazine articles:", error)
      return []
    }
    return data || []
  }

  // Contact Info
  static async getActiveContactInfo(): Promise<ContactInfo | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from("contact_info")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Error fetching contact info:", error)
      return null
    }

    return data && data.length > 0 ? data[0] : null
  }

  // Site Settings
  static async getSiteSettings(): Promise<Record<string, string>> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase.from("site_settings").select("key, value")

    if (error) {
      console.error("Error fetching site settings:", error)
      return {}
    }

    const settings: Record<string, string> = {}
    data?.forEach((setting) => {
      if (setting.key && setting.value) {
        settings[setting.key] = setting.value
      }
    })
    return settings
  }

  static async updateSiteSetting(key: string, value: string, userId: string): Promise<boolean> {
    const supabase = await this.getSupabase()
    const { error } = await supabase.from("site_settings").upsert({
      key,
      value,
      user_id: userId,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error updating site setting:", error)
      return false
    }
    return true
  }

  // Local Committees
  static async getActiveLocalCommittees(): Promise<LocalCommittee[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from("local_committees")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching local committees:", error)
      return []
    }
    return data || []
  }

  static async getAllLocalCommittees(): Promise<LocalCommittee[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from("local_committees")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching all local committees:", error)
      return []
    }
    return data || []
  }

  static async createLocalCommittee(
    committee: Omit<LocalCommittee, "id" | "created_at" | "updated_at">,
  ): Promise<LocalCommittee | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase.from("local_committees").insert(committee).select().single()

    if (error) {
      console.error("Error creating local committee:", error)
      return null
    }
    return data
  }

  static async updateLocalCommittee(id: string, updates: Partial<LocalCommittee>): Promise<LocalCommittee | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from("local_committees")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating local committee:", error)
      return null
    }
    return data
  }

  static async deleteLocalCommittee(id: string): Promise<boolean> {
    const supabase = await this.getSupabase()
    const { error } = await supabase.from("local_committees").delete().eq("id", id)

    if (error) {
      console.error("Error deleting local committee:", error)
      return false
    }
    return true
  }
}
