import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import {
  fallbackAboutContent,
  fallbackBoardMembers,
  fallbackContactInfo,
  fallbackHeroContent,
  fallbackLocalCommittees,
  fallbackMagazineArticles,
  fallbackSiteSettings,
} from "@/lib/fallback-data"
import type { HeroContent, AboutContent, BoardMember, MagazineArticle, ContactInfo, LocalCommittee } from "@/lib/types"

export class ContentService {
  private static supabaseUnavailableLogged = false

  private static async getSupabase(): Promise<Awaited<ReturnType<typeof createClient>> | null> {
    if (!isSupabaseConfigured()) {
      if (!this.supabaseUnavailableLogged) {
        console.warn("Supabase credentials are not configured. Falling back to static content.")
        this.supabaseUnavailableLogged = true
      }
      return null
    }

    try {
      return await createClient()
    } catch (error) {
      if (!this.supabaseUnavailableLogged) {
        console.error("Failed to initialize Supabase client. Falling back to static content.", error)
        this.supabaseUnavailableLogged = true
      }
      return null
    }
  }

  // Hero Content
  static async getActiveHeroContent(): Promise<HeroContent | null> {
    const supabase = await this.getSupabase()
    if (!supabase) {
      return fallbackHeroContent
    }
    const { data, error } = await supabase
      .from("hero_content")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Error fetching hero content:", error)
      return fallbackHeroContent
    }

    return data && data.length > 0 ? data[0] : fallbackHeroContent
  }

  static async updateHeroContent(id: string, updates: Partial<HeroContent>): Promise<HeroContent | null> {
    const supabase = await this.getSupabase()
    if (!supabase) {
      console.warn("Supabase unavailable - skipping hero content update.")
      return null
    }
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
    if (!supabase) {
      return fallbackAboutContent
    }
    const { data, error } = await supabase
      .from("about_content")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Error fetching about content:", error)
      return fallbackAboutContent
    }

    return data && data.length > 0 ? data[0] : fallbackAboutContent
  }

  static async updateAboutContent(id: string, updates: Partial<AboutContent>): Promise<AboutContent | null> {
    const supabase = await this.getSupabase()
    if (!supabase) {
      console.warn("Supabase unavailable - skipping about content update.")
      return null
    }
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
    if (!supabase) {
      return fallbackBoardMembers.filter((member) => member.is_active).map((member) => ({ ...member }))
    }
    const { data, error } = await supabase
      .from("board_members")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching board members:", error)
      return fallbackBoardMembers.filter((member) => member.is_active).map((member) => ({ ...member }))
    }
    return data && data.length > 0 ? data : fallbackBoardMembers.filter((member) => member.is_active).map((member) => ({ ...member }))
  }

  static async getAllBoardMembers(): Promise<BoardMember[]> {
    const supabase = await this.getSupabase()
    if (!supabase) {
      return fallbackBoardMembers.map((member) => ({ ...member }))
    }
    const { data, error } = await supabase.from("board_members").select("*").order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching all board members:", error)
      return fallbackBoardMembers.map((member) => ({ ...member }))
    }
    return data && data.length > 0 ? data : fallbackBoardMembers.map((member) => ({ ...member }))
  }

  static async createBoardMember(
    member: Omit<BoardMember, "id" | "created_at" | "updated_at">,
  ): Promise<BoardMember | null> {
    const supabase = await this.getSupabase()
    if (!supabase) {
      console.warn("Supabase unavailable - unable to create board member.")
      return null
    }
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
    if (!supabase) {
      console.warn("Supabase unavailable - unable to update board member.")
      return null
    }
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
    if (!supabase) {
      console.warn("Supabase unavailable - unable to delete board member.")
      return false
    }
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
    if (!supabase) {
      return fallbackMagazineArticles.map((article) => ({ ...article }))
    }
    const { data, error } = await supabase
      .from("magazine_articles")
      .select("*")
      .eq("is_active", true)
      .order("publication_date", { ascending: false })

    if (error) {
      console.error("Error fetching magazine articles:", error)
      return fallbackMagazineArticles.map((article) => ({ ...article }))
    }
    return data && data.length > 0 ? data : fallbackMagazineArticles.map((article) => ({ ...article }))
  }

  // Contact Info
  static async getActiveContactInfo(): Promise<ContactInfo | null> {
    const supabase = await this.getSupabase()
    if (!supabase) {
      return fallbackContactInfo
    }
    const { data, error } = await supabase
      .from("contact_info")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Error fetching contact info:", error)
      return fallbackContactInfo
    }

    return data && data.length > 0 ? data[0] : fallbackContactInfo
  }

  // Site Settings
  static async getSiteSettings(): Promise<Record<string, string>> {
    const supabase = await this.getSupabase()
    if (!supabase) {
      return { ...fallbackSiteSettings }
    }
    const { data, error } = await supabase.from("site_settings").select("key, value")

    if (error) {
      console.error("Error fetching site settings:", error)
      return { ...fallbackSiteSettings }
    }

    const settings: Record<string, string> = { ...fallbackSiteSettings }
    data?.forEach((setting) => {
      if (setting.key && setting.value) {
        settings[setting.key] = setting.value
      }
    })
    return settings
  }

  static async updateSiteSetting(key: string, value: string, userId: string): Promise<boolean> {
    const supabase = await this.getSupabase()
    if (!supabase) {
      console.warn("Supabase unavailable - unable to update site settings.")
      return false
    }
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
    if (!supabase) {
      return fallbackLocalCommittees.filter((committee) => committee.is_active).map((committee) => ({ ...committee }))
    }
    const { data, error } = await supabase
      .from("local_committees")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching local committees:", error)
      return fallbackLocalCommittees.filter((committee) => committee.is_active).map((committee) => ({ ...committee }))
    }
    return data && data.length > 0
      ? data
      : fallbackLocalCommittees.filter((committee) => committee.is_active).map((committee) => ({ ...committee }))
  }

  static async getAllLocalCommittees(): Promise<LocalCommittee[]> {
    const supabase = await this.getSupabase()
    if (!supabase) {
      return fallbackLocalCommittees.map((committee) => ({ ...committee }))
    }
    const { data, error } = await supabase
      .from("local_committees")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching all local committees:", error)
      return fallbackLocalCommittees.map((committee) => ({ ...committee }))
    }
    return data && data.length > 0 ? data : fallbackLocalCommittees.map((committee) => ({ ...committee }))
  }

  static async createLocalCommittee(
    committee: Omit<LocalCommittee, "id" | "created_at" | "updated_at">,
  ): Promise<LocalCommittee | null> {
    const supabase = await this.getSupabase()
    if (!supabase) {
      console.warn("Supabase unavailable - unable to create local committee.")
      return null
    }
    const { data, error } = await supabase.from("local_committees").insert(committee).select().single()

    if (error) {
      console.error("Error creating local committee:", error)
      return null
    }
    return data
  }

  static async updateLocalCommittee(id: string, updates: Partial<LocalCommittee>): Promise<LocalCommittee | null> {
    const supabase = await this.getSupabase()
    if (!supabase) {
      console.warn("Supabase unavailable - unable to update local committee.")
      return null
    }
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
    if (!supabase) {
      console.warn("Supabase unavailable - unable to delete local committee.")
      return false
    }
    const { error } = await supabase.from("local_committees").delete().eq("id", id)

    if (error) {
      console.error("Error deleting local committee:", error)
      return false
    }
    return true
  }
}
