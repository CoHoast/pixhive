/**
 * Face Clustering Algorithm
 * 
 * Groups detected faces into person clusters using DBSCAN-like approach.
 * Faces with similar embeddings (cosine similarity > threshold) are grouped together.
 */

import { cosineSimilarity, FACE_MATCH_THRESHOLD } from './faces'
import type { FaceRecord, PersonCluster } from './types'

interface ClusterInput {
  faceId: string
  photoId: string
  embedding: number[]
}

interface ClusterOutput {
  clusterId: string
  faceIds: string[]
  photoIds: string[]
  representativeFaceId: string
  centroid: number[]
}

/**
 * Cluster faces by similarity
 * Uses a greedy clustering approach:
 * 1. Start with first face as cluster 1
 * 2. For each subsequent face:
 *    - If similar to existing cluster centroid, add to that cluster
 *    - Otherwise, create new cluster
 */
export function clusterFaces(
  faces: ClusterInput[],
  threshold: number = FACE_MATCH_THRESHOLD
): ClusterOutput[] {
  if (faces.length === 0) return []

  const clusters: ClusterOutput[] = []
  const assigned = new Set<string>()

  for (const face of faces) {
    if (assigned.has(face.faceId)) continue

    // Find best matching cluster
    let bestCluster: ClusterOutput | null = null
    let bestSimilarity = 0

    for (const cluster of clusters) {
      const similarity = cosineSimilarity(face.embedding, cluster.centroid)
      if (similarity > threshold && similarity > bestSimilarity) {
        bestCluster = cluster
        bestSimilarity = similarity
      }
    }

    if (bestCluster) {
      // Add to existing cluster
      bestCluster.faceIds.push(face.faceId)
      if (!bestCluster.photoIds.includes(face.photoId)) {
        bestCluster.photoIds.push(face.photoId)
      }
      // Update centroid (running average)
      bestCluster.centroid = averageEmbeddings([
        ...bestCluster.faceIds.map(id => 
          faces.find(f => f.faceId === id)!.embedding
        )
      ])
      assigned.add(face.faceId)
    } else {
      // Create new cluster
      const clusterId = `cluster_${clusters.length + 1}_${Date.now()}`
      clusters.push({
        clusterId,
        faceIds: [face.faceId],
        photoIds: [face.photoId],
        representativeFaceId: face.faceId,
        centroid: face.embedding,
      })
      assigned.add(face.faceId)
    }
  }

  // Update representative face for each cluster (face closest to centroid)
  for (const cluster of clusters) {
    let bestFaceId = cluster.faceIds[0]
    let bestSimilarity = 0

    for (const faceId of cluster.faceIds) {
      const face = faces.find(f => f.faceId === faceId)!
      const similarity = cosineSimilarity(face.embedding, cluster.centroid)
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity
        bestFaceId = faceId
      }
    }

    cluster.representativeFaceId = bestFaceId
  }

  return clusters
}

/**
 * Calculate average of multiple embeddings
 */
function averageEmbeddings(embeddings: number[][]): number[] {
  if (embeddings.length === 0) return []
  
  const dimensions = embeddings[0].length
  const result = new Array(dimensions).fill(0)

  for (const embedding of embeddings) {
    for (let i = 0; i < dimensions; i++) {
      result[i] += embedding[i]
    }
  }

  for (let i = 0; i < dimensions; i++) {
    result[i] /= embeddings.length
  }

  return result
}

/**
 * Merge clusters that are similar enough
 * Run periodically to consolidate clusters as more photos are added
 */
export function mergeSimilarClusters(
  clusters: ClusterOutput[],
  threshold: number = FACE_MATCH_THRESHOLD + 0.1 // Slightly higher threshold for merging
): ClusterOutput[] {
  const merged: ClusterOutput[] = []
  const mergedIds = new Set<string>()

  for (const cluster of clusters) {
    if (mergedIds.has(cluster.clusterId)) continue

    // Find all clusters that should merge with this one
    const toMerge = [cluster]
    
    for (const other of clusters) {
      if (other.clusterId === cluster.clusterId) continue
      if (mergedIds.has(other.clusterId)) continue

      const similarity = cosineSimilarity(cluster.centroid, other.centroid)
      if (similarity >= threshold) {
        toMerge.push(other)
        mergedIds.add(other.clusterId)
      }
    }

    if (toMerge.length === 1) {
      merged.push(cluster)
    } else {
      // Merge all clusters
      const allFaceIds = toMerge.flatMap(c => c.faceIds)
      const allPhotoIds = [...new Set(toMerge.flatMap(c => c.photoIds))]
      const allEmbeddings = toMerge.map(c => c.centroid)
      
      merged.push({
        clusterId: cluster.clusterId, // Keep original cluster ID
        faceIds: allFaceIds,
        photoIds: allPhotoIds,
        representativeFaceId: cluster.representativeFaceId,
        centroid: averageEmbeddings(allEmbeddings),
      })
    }

    mergedIds.add(cluster.clusterId)
  }

  return merged
}

/**
 * Find which cluster a face belongs to
 */
export function findMatchingCluster(
  embedding: number[],
  clusters: ClusterOutput[],
  threshold: number = FACE_MATCH_THRESHOLD
): ClusterOutput | null {
  let bestCluster: ClusterOutput | null = null
  let bestSimilarity = 0

  for (const cluster of clusters) {
    const similarity = cosineSimilarity(embedding, cluster.centroid)
    if (similarity > threshold && similarity > bestSimilarity) {
      bestCluster = cluster
      bestSimilarity = similarity
    }
  }

  return bestCluster
}

/**
 * Calculate cluster quality metrics
 */
export function calculateClusterMetrics(
  cluster: ClusterOutput,
  faces: ClusterInput[]
): {
  intraClusterSimilarity: number // Average similarity within cluster
  size: number
  photoCount: number
} {
  const clusterFaces = faces.filter(f => cluster.faceIds.includes(f.faceId))
  
  let totalSimilarity = 0
  let pairCount = 0

  for (let i = 0; i < clusterFaces.length; i++) {
    for (let j = i + 1; j < clusterFaces.length; j++) {
      totalSimilarity += cosineSimilarity(
        clusterFaces[i].embedding,
        clusterFaces[j].embedding
      )
      pairCount++
    }
  }

  return {
    intraClusterSimilarity: pairCount > 0 ? totalSimilarity / pairCount : 1,
    size: cluster.faceIds.length,
    photoCount: cluster.photoIds.length,
  }
}

/**
 * Sort clusters by size (most photos first)
 */
export function sortClustersBySize(clusters: ClusterOutput[]): ClusterOutput[] {
  return [...clusters].sort((a, b) => b.photoIds.length - a.photoIds.length)
}
