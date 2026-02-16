import { createClient } from '@supabase/supabase-js'

// Supabase client for storage (uses service role for server-side uploads)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BUCKET_NAME = 'photos'

export interface UploadResult {
  key: string
  url: string
  size: number
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  file: Buffer,
  key: string,
  contentType: string
): Promise<UploadResult> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(key, file, {
      contentType,
      upsert: false,
    })

  if (error) {
    console.error('Storage upload error:', error)
    throw new Error(`Failed to upload file: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(key)

  return {
    key: data.path,
    url: urlData.publicUrl,
    size: file.length,
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(key: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([key])

  if (error) {
    console.error('Storage delete error:', error)
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}

/**
 * Delete multiple files from Supabase Storage
 */
export async function deleteFiles(keys: string[]): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(keys)

  if (error) {
    console.error('Storage delete error:', error)
    throw new Error(`Failed to delete files: ${error.message}`)
  }
}

/**
 * Generate a unique key for a photo
 */
export function generatePhotoKey(eventId: string, filename: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = filename.split('.').pop()?.toLowerCase() || 'jpg'
  return `events/${eventId}/photos/${timestamp}-${random}.${extension}`
}

/**
 * Generate a unique key for a thumbnail
 */
export function generateThumbnailKey(photoKey: string): string {
  return photoKey.replace('/photos/', '/thumbnails/')
}

/**
 * Get the public URL for a key
 */
export function getPublicUrl(key: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(key)
  
  return data.publicUrl
}

/**
 * Create a signed URL for temporary access (useful for private buckets)
 */
export async function getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(key, expiresIn)

  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`)
  }

  return data.signedUrl
}
