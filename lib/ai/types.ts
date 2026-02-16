/**
 * AI Feature Types for PixHive
 */

// Face detection result from AI model
export interface DetectedFace {
  // Bounding box (normalized 0-1)
  bbox: {
    x: number
    y: number
    width: number
    height: number
  }
  // Confidence score (0-1)
  confidence: number
  // Face embedding vector (512 dimensions for InsightFace)
  embedding: number[]
  // Landmarks (optional)
  landmarks?: {
    leftEye: [number, number]
    rightEye: [number, number]
    nose: [number, number]
    leftMouth: [number, number]
    rightMouth: [number, number]
  }
}

// Photo with detected faces
export interface PhotoFaceData {
  photoId: string
  photoUrl: string
  thumbnailUrl: string
  faces: DetectedFace[]
  processedAt: string
}

// Person cluster (group of similar faces)
export interface PersonCluster {
  id: string
  eventId: string
  name: string | null // Host can name: "Grandma", "Best Man", etc.
  photoCount: number
  representativeFaceUrl: string | null
  createdAt: string
}

// Face record in database
export interface FaceRecord {
  id: string
  photoId: string
  personId: string | null
  embedding: number[]
  boundingBox: DetectedFace['bbox']
  confidence: number
  createdAt: string
}

// "Find Yourself" search result
export interface FaceSearchResult {
  photoId: string
  photoUrl: string
  thumbnailUrl: string
  similarity: number // 0-1, higher = more similar
  boundingBox: DetectedFace['bbox']
}

// Face processing job status
export interface FaceProcessingJob {
  id: string
  photoId: string
  eventId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  facesDetected: number
  error?: string
  createdAt: string
  completedAt?: string
}

// Clustering job status
export interface ClusteringJob {
  id: string
  eventId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  clustersCreated: number
  facesProcessed: number
  error?: string
  createdAt: string
  completedAt?: string
}

// Activity detection result
export interface DetectedActivity {
  activity: ActivityType
  confidence: number
}

export type ActivityType =
  | 'ceremony'
  | 'reception'
  | 'first_dance'
  | 'cake_cutting'
  | 'toasts'
  | 'dancing'
  | 'portraits'
  | 'candids'
  | 'decorations'
  | 'food'
  | 'group_photo'
  | 'other'

// Content moderation result
export interface ModerationResult {
  safe: boolean
  flags: ModerationFlag[]
}

export interface ModerationFlag {
  category: 'nudity' | 'violence' | 'hate' | 'drugs' | 'spam'
  confidence: number
  description?: string
}
