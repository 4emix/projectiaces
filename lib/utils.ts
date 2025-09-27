import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const GOOGLE_DRIVE_HOSTNAMES = new Set([
  "drive.google.com",
  "docs.google.com",
])

const createGoogleDriveDownloadUrl = (fileId: string) =>
  `https://drive.google.com/uc?export=download&id=${fileId}`

const createGoogleDriveThumbnailUrl = (fileId: string, size: number = 2048) =>
  `https://drive.google.com/thumbnail?id=${fileId}&sz=w${Math.max(32, size)}`

function extractGoogleDriveFileId(url: URL): string | null {
  const host = url.hostname.toLowerCase()
  if (!GOOGLE_DRIVE_HOSTNAMES.has(host)) {
    return null
  }

  const segments = url.pathname.split("/").filter(Boolean)

  if (segments.length >= 3 && segments[0] === "file" && segments[1] === "d") {
    return segments[2]
  }

  if (segments[0] === "open" || segments[0] === "uc" || segments[0] === "thumbnail") {
    const idParam = url.searchParams.get("id") || url.searchParams.get("ids")
    if (idParam) {
      return idParam
    }
  }

  return null
}

export type GoogleDriveDirectUrlOptions = {
  preferThumbnail?: boolean
  thumbnailSize?: number
}

export function toGoogleDriveDirectUrl(
  value: string | null | undefined,
  options?: GoogleDriveDirectUrlOptions,
): string | null {
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  try {
    const parsedUrl = new URL(trimmed)
    const fileId = extractGoogleDriveFileId(parsedUrl)

    if (fileId) {
      if (options?.preferThumbnail || parsedUrl.pathname.startsWith("/thumbnail")) {
        return createGoogleDriveThumbnailUrl(fileId, options?.thumbnailSize)
      }

      return createGoogleDriveDownloadUrl(fileId)
    }
  } catch (error) {
    console.warn("Failed to parse URL while normalizing Google Drive link", error)
    return trimmed
  }

  const fileIdMatch = trimmed.match(/https?:\/\/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (fileIdMatch?.[1]) {
    if (options?.preferThumbnail) {
      return createGoogleDriveThumbnailUrl(fileIdMatch[1], options?.thumbnailSize)
    }
    return createGoogleDriveDownloadUrl(fileIdMatch[1])
  }

  return trimmed
}

export function toGoogleDriveImageUrl(
  value: string | null | undefined,
  size?: number,
): string | null {
  return toGoogleDriveDirectUrl(value, { preferThumbnail: true, thumbnailSize: size })
}
