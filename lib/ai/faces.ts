/**
 * Face Detection & Embedding Service
 * 
 * Uses Replicate API with InsightFace model for:
 * - Face detection (bounding boxes)
 * - Face embedding generation (512-dim vectors)
 * 
 * When REPLICATE_API_TOKEN is not set, returns mock data for development.
 */

import type { DetectedFace, PhotoFaceData } from './types'

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN
const INSIGHTFACE_MODEL = 'daanelson/insightface:da9756c9a37dd0d3f2ef86c718c2155c8be7bd4e87bc2bcec3e71b6e17f3ce31'

// Similarity threshold for face matching (0-1)
export const FACE_MATCH_THRESHOLD = 0.6

// Minimum confidence for face detection
export const FACE_CONFIDENCE_THRESHOLD = 0.7

/**
 * Detect faces in an image and generate embeddings
 */
export async function detectFaces(imageUrl: string): Promise<DetectedFace[]> {
  // If no API key, return empty for now (will be processed when key is added)
  if (!REPLICATE_API_TOKEN) {
    console.log('[FaceDetection] No REPLICATE_API_TOKEN, skipping face detection')
    return []
  }

  try {
    // Call Replicate API
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: INSIGHTFACE_MODEL,
        input: {
          image: imageUrl,
          det_size: 640,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.status}`)
    }

    const prediction = await response.json()

    // Poll for completion
    const result = await pollPrediction(prediction.id)
    
    if (!result.output) {
      return []
    }

    // Parse InsightFace output
    return parseInsightFaceOutput(result.output)
  } catch (error) {
    console.error('[FaceDetection] Error detecting faces:', error)
    return []
  }
}

/**
 * Poll Replicate prediction until complete
 */
async function pollPrediction(predictionId: string, maxAttempts = 30): Promise<any> {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        },
      }
    )

    const prediction = await response.json()

    if (prediction.status === 'succeeded') {
      return prediction
    }

    if (prediction.status === 'failed') {
      throw new Error(`Prediction failed: ${prediction.error}`)
    }

    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  throw new Error('Prediction timed out')
}

/**
 * Parse InsightFace model output into our format
 */
function parseInsightFaceOutput(output: any): DetectedFace[] {
  const faces: DetectedFace[] = []

  // InsightFace returns array of detected faces
  if (Array.isArray(output)) {
    for (const face of output) {
      if (face.det_score >= FACE_CONFIDENCE_THRESHOLD) {
        faces.push({
          bbox: {
            x: face.bbox[0],
            y: face.bbox[1],
            width: face.bbox[2] - face.bbox[0],
            height: face.bbox[3] - face.bbox[1],
          },
          confidence: face.det_score,
          embedding: face.embedding || [],
          landmarks: face.kps ? {
            leftEye: face.kps[0],
            rightEye: face.kps[1],
            nose: face.kps[2],
            leftMouth: face.kps[3],
            rightMouth: face.kps[4],
          } : undefined,
        })
      }
    }
  }

  return faces
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Find similar faces in database using embedding
 */
export function isSamePerson(embedding1: number[], embedding2: number[]): boolean {
  const similarity = cosineSimilarity(embedding1, embedding2)
  return similarity >= FACE_MATCH_THRESHOLD
}

/**
 * Generate a face thumbnail URL (crop from original image)
 * This creates a URL that can be used to show just the face
 */
export function getFaceThumbnailUrl(
  imageUrl: string,
  bbox: DetectedFace['bbox'],
  size: number = 150
): string {
  // For Supabase Storage, we can use image transformations
  // Format: /render/image/public/bucket/path?width=X&height=Y&resize=crop
  // We'll add padding around the face for better cropping
  const padding = 0.3
  const x = Math.max(0, bbox.x - bbox.width * padding)
  const y = Math.max(0, bbox.y - bbox.height * padding)
  const width = bbox.width * (1 + padding * 2)
  const height = bbox.height * (1 + padding * 2)

  // For now, return the original URL
  // TODO: Implement actual cropping when Supabase transformations are set up
  return imageUrl
}

/**
 * Process a batch of photos for face detection
 * Returns photos with their detected faces
 */
export async function processPhotoBatch(
  photos: { id: string; url: string; thumbnailUrl: string }[]
): Promise<PhotoFaceData[]> {
  const results: PhotoFaceData[] = []

  for (const photo of photos) {
    const faces = await detectFaces(photo.url)
    
    results.push({
      photoId: photo.id,
      photoUrl: photo.url,
      thumbnailUrl: photo.thumbnailUrl,
      faces,
      processedAt: new Date().toISOString(),
    })
  }

  return results
}

/**
 * Extract a single face embedding from a selfie image
 * Used for "Find Yourself" feature
 */
export async function extractSelfieEmbedding(imageUrl: string): Promise<number[] | null> {
  const faces = await detectFaces(imageUrl)
  
  // Expect exactly one face in a selfie
  if (faces.length === 0) {
    console.log('[FaceDetection] No face detected in selfie')
    return null
  }

  if (faces.length > 1) {
    console.log('[FaceDetection] Multiple faces in selfie, using largest')
    // Use the face with largest bounding box (likely the main subject)
    faces.sort((a, b) => (b.bbox.width * b.bbox.height) - (a.bbox.width * a.bbox.height))
  }

  return faces[0].embedding
}
