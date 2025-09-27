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
import { toGoogleDriveDirectUrl } from "@/lib/utils"

export class ContentService {
  private static supabaseUnavailableLogged = false

  private static normalizeRecord<T extends Record<string, any>>(record: T, fields: (keyof T)[]): T {
    const normalized = { ...record }

    for (const field of fields) {
      const value = normalized[field]
      normalized[field] = toGoogleDriveDirectUrl(value as string | null | undefined) as T[typeof field]
    }

    return normalized
  }

  private static normalizeOptionalRecord<T extends Record<string, any>>(
    record: T | null | undefined,
    fields: (keyof T)[],
  ): T | null {
    if (!record) {
      return null
    }

    return this.normalizeRecord(record, fields)
  }

  private static normalizeRecordArray<T extends Record<string, any>>(
    records: T[] | null | undefined,
    fields: (keyof T)[],
  ): T[] {
    if (!records) {
      return []
    }

    return records.map((record) => this.normalizeRecord(record, fields))
  }

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
      return this.normalizeRecord(fallbackHeroContent, ["background_image_url"])
    }
    const { data, error } = await supabase
      .from("hero_content")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Error fetching hero content:", error)
      return this.normalizeRecord(fallbackHeroContent, ["background_image_url"])
    }

    if (data && data.length > 0) {
      return this.normalizeRecord(data[0], ["background_image_url"])
    }

    return this.normalizeRecord(fallbackHeroContent, ["background_image_url"])
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
    return this.normalizeOptionalRecord(data, ["background_image_url"])
  }

  // About Content
  static async getActiveAboutContent(): Promise<AboutContent | null> {
    const supabase = await this.getSupabase()
    if (!supabase) {
      return this.normalizeRecord(fallbackAboutContent, ["image_url"])
    }
    const { data, error } = await supabase
      .from("about_content")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Error fetching about content:", error)
      return this.normalizeRecord(fallbackAboutContent, ["image_url"])
    }

    if (data && data.length > 0) {
      return this.normalizeRecord(data[0], ["image_url"])
    }

    return this.normalizeRecord(fallbackAboutContent, ["image_url"])
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
    return this.normalizeOptionalRecord(data, ["image_url"])
  }

  // Board Members
  static async getActiveBoardMembers(): Promise<BoardMember[]> {
    const supabase = await this.getSupabase()
    if (!supabase) {
      return this.normalizeRecordArray(
        fallbackBoardMembers.filter((member) => member.is_active),
        ["image_url"],
      )
    }
    const { data, error } = await supabase
      .from("board_members")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching board members:", error)
      return this.normalizeRecordArray(
        fallbackBoardMembers.filter((member) => member.is_active),
        ["image_url"],
      )
    }
    if (data && data.length > 0) {
      return this.normalizeRecordArray(data, ["image_url"])
    }

    return this.normalizeRecordArray(
      fallbackBoardMembers.filter((member) => member.is_active),
      ["image_url"],
    )
  }

  static async getAllBoardMembers(): Promise<BoardMember[]> {
    const supabase = await this.getSupabase()
    if (!supabase) {
      return this.normalizeRecordArray(fallbackBoardMembers, ["image_url"])
    }
    const { data, error } = await supabase.from("board_members").select("*").order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching all board members:", error)
      return this.normalizeRecordArray(fallbackBoardMembers, ["image_url"])
    }
    if (data && data.length > 0) {
      return this.normalizeRecordArray(data, ["image_url"])
    }

    return this.normalizeRecordArray(fallbackBoardMembers, ["image_url"])
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
    return this.normalizeOptionalRecord(data, ["image_url"])
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
    return this.normalizeOptionalRecord(data, ["image_url"])
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
      const normalized = this.normalizeRecordArray(fallbackMagazineArticles, ["cover_image_url", "pdf_url"])
      return normalized.map((article) => ({
        ...article,
        publication_type: article.publication_type === "newsletter" ? "newsletter" : "magazine",
      }))
    }
    const { data, error } = await supabase
      .from("magazine_articles")
      .select("*")
      .eq("is_active", true)
      .order("publication_date", { ascending: false })

    if (error) {
      console.error("Error fetching magazine articles:", error)
      const normalized = this.normalizeRecordArray(fallbackMagazineArticles, ["cover_image_url", "pdf_url"])
      return normalized.map((article) => ({
        ...article,
        publication_type: article.publication_type === "newsletter" ? "newsletter" : "magazine",
      }))
    }
    const normalizedData = this.normalizeRecordArray(data, ["cover_image_url", "pdf_url"])
    const normalized = normalizedData.map((article) => ({
      ...article,
      publication_type: article.publication_type === "newsletter" ? "newsletter" : "magazine",
    }))

    if (normalized.length > 0) {
      return normalized
    }

    const normalizedFallback = this.normalizeRecordArray(fallbackMagazineArticles, ["cover_image_url", "pdf_url"])
    return normalizedFallback.map((article) => ({
      ...article,
      publication_type: article.publication_type === "newsletter" ? "newsletter" : "magazine",
    }))
  }

  // Contact Info
  static async getActiveContactInfo(): Promise<ContactInfo | null> {
    const supabase = await this.getSupabase()
    if (!supabase) {
      return this.normalizeRecord(fallbackContactInfo, ["map_embed_url"])
    }
    const { data, error } = await supabase
      .from("contact_info")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Error fetching contact info:", error)
      return this.normalizeRecord(fallbackContactInfo, ["map_embed_url"])
    }
    if (data && data.length > 0) {
      return this.normalizeRecord(data[0], ["map_embed_url"])
    }

    return this.normalizeRecord(fallbackContactInfo, ["map_embed_url"])
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
      return this.normalizeRecordArray(
        fallbackLocalCommittees.filter((committee) => committee.is_active),
        ["logo_url"],
      )
    }
    const { data, error } = await supabase
      .from("local_committees")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching local committees:", error)
      return this.normalizeRecordArray(
        fallbackLocalCommittees.filter((committee) => committee.is_active),
        ["logo_url"],
      )
    }
    if (data && data.length > 0) {
      return this.normalizeRecordArray(data, ["logo_url"])
    }

    return this.normalizeRecordArray(
      fallbackLocalCommittees.filter((committee) => committee.is_active),
      ["logo_url"],
    )
  }

  static async getAllLocalCommittees(): Promise<LocalCommittee[]> {
    const supabase = await this.getSupabase()
    if (!supabase) {
      return this.normalizeRecordArray(fallbackLocalCommittees, ["logo_url"])
    }
    const { data, error } = await supabase
      .from("local_committees")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching all local committees:", error)
      return this.normalizeRecordArray(fallbackLocalCommittees, ["logo_url"])
    }
    if (data && data.length > 0) {
      return this.normalizeRecordArray(data, ["logo_url"])
    }

    return this.normalizeRecordArray(fallbackLocalCommittees, ["logo_url"])
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
    return this.normalizeOptionalRecord(data, ["logo_url"])
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
    return this.normalizeOptionalRecord(data, ["logo_url"])
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
