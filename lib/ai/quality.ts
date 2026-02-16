/**
 * Low-cost AI features (run locally, no API calls)
 * - Blur detection
 * - Duplicate detection (perceptual hash)
 * - Quality scoring
 * - Best photo picks
 */

// =============================================
// BLUR DETECTION
// Uses Laplacian variance - higher = sharper
// =============================================

export interface BlurResult {
  score: number      // 0-100, higher = sharper
  isBlurry: boolean  // true if score < threshold
  variance: number   // raw Laplacian variance
}

/**
 * Detect blur in an image using Laplacian variance
 * Works on raw pixel data from canvas
 */
export function detectBlur(
  imageData: ImageData,
  threshold: number = 30
): BlurResult {
  const { data, width, height } = imageData
  
  // Convert to grayscale
  const gray = new Float32Array(width * height)
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4]
    const g = data[i * 4 + 1]
    const b = data[i * 4 + 2]
    gray[i] = 0.299 * r + 0.587 * g + 0.114 * b
  }
  
  // Apply Laplacian kernel: [0, 1, 0], [1, -4, 1], [0, 1, 0]
  let sum = 0
  let sumSq = 0
  let count = 0
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x
      const laplacian = 
        gray[idx - width] +     // top
        gray[idx - 1] +         // left
        -4 * gray[idx] +        // center
        gray[idx + 1] +         // right
        gray[idx + width]       // bottom
      
      sum += laplacian
      sumSq += laplacian * laplacian
      count++
    }
  }
  
  const mean = sum / count
  const variance = (sumSq / count) - (mean * mean)
  
  // Normalize to 0-100 scale (typical variance range: 0-5000+)
  const score = Math.min(100, Math.max(0, Math.sqrt(variance) * 2))
  
  return {
    score,
    isBlurry: score < threshold,
    variance
  }
}

// =============================================
// DUPLICATE DETECTION (Perceptual Hash)
// =============================================

export interface HashResult {
  hash: string         // 64-bit perceptual hash as hex
  thumbnail: number[]  // 8x8 grayscale values
}

/**
 * Generate perceptual hash (pHash) for duplicate detection
 * Resize to 8x8, convert to grayscale, compare to mean
 */
export function generatePerceptualHash(imageData: ImageData): HashResult {
  const { data, width, height } = imageData
  
  // Sample down to 8x8
  const thumbnail: number[] = []
  const blockW = width / 8
  const blockH = height / 8
  
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      // Average the block
      let sum = 0
      let count = 0
      
      const startX = Math.floor(x * blockW)
      const endX = Math.floor((x + 1) * blockW)
      const startY = Math.floor(y * blockH)
      const endY = Math.floor((y + 1) * blockH)
      
      for (let py = startY; py < endY; py++) {
        for (let px = startX; px < endX; px++) {
          const idx = (py * width + px) * 4
          const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]
          sum += gray
          count++
        }
      }
      
      thumbnail.push(sum / count)
    }
  }
  
  // Calculate mean
  const mean = thumbnail.reduce((a, b) => a + b, 0) / 64
  
  // Generate hash: 1 if above mean, 0 if below
  let hash = ''
  for (let i = 0; i < 64; i += 4) {
    let nibble = 0
    for (let j = 0; j < 4; j++) {
      if (thumbnail[i + j] > mean) {
        nibble |= (1 << (3 - j))
      }
    }
    hash += nibble.toString(16)
  }
  
  return { hash, thumbnail }
}

/**
 * Calculate Hamming distance between two perceptual hashes
 * Lower = more similar. 0 = identical.
 */
export function hammingDistance(hash1: string, hash2: string): number {
  if (hash1.length !== hash2.length) return 64 // Max distance
  
  let distance = 0
  for (let i = 0; i < hash1.length; i++) {
    const n1 = parseInt(hash1[i], 16)
    const n2 = parseInt(hash2[i], 16)
    const xor = n1 ^ n2
    // Count set bits
    distance += (xor & 1) + ((xor >> 1) & 1) + ((xor >> 2) & 1) + ((xor >> 3) & 1)
  }
  
  return distance
}

/**
 * Check if two images are duplicates based on perceptual hash
 */
export function isDuplicate(hash1: string, hash2: string, threshold: number = 5): boolean {
  return hammingDistance(hash1, hash2) <= threshold
}

// =============================================
// QUALITY SCORING
// =============================================

export interface QualityResult {
  score: number           // 0-100 overall quality
  sharpness: number       // 0-100
  brightness: number      // 0-100
  contrast: number        // 0-100
  saturation: number      // 0-100
  issues: string[]        // List of detected issues
}

/**
 * Comprehensive quality scoring for a photo
 */
export function analyzeQuality(imageData: ImageData): QualityResult {
  const { data, width, height } = imageData
  const pixelCount = width * height
  const issues: string[] = []
  
  // Calculate various metrics
  let rSum = 0, gSum = 0, bSum = 0
  let rSumSq = 0, gSumSq = 0, bSumSq = 0
  let lumSum = 0, lumSumSq = 0
  let satSum = 0
  
  for (let i = 0; i < pixelCount; i++) {
    const r = data[i * 4]
    const g = data[i * 4 + 1]
    const b = data[i * 4 + 2]
    
    rSum += r; gSum += g; bSum += b
    rSumSq += r * r; gSumSq += g * g; bSumSq += b * b
    
    // Luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b
    lumSum += lum
    lumSumSq += lum * lum
    
    // Saturation (simplified HSL saturation)
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const sat = max === 0 ? 0 : (max - min) / max
    satSum += sat
  }
  
  // Brightness (mean luminance, normalized to 0-100)
  const meanLum = lumSum / pixelCount
  const brightness = (meanLum / 255) * 100
  
  // Contrast (std dev of luminance, normalized)
  const lumVariance = (lumSumSq / pixelCount) - (meanLum * meanLum)
  const lumStdDev = Math.sqrt(Math.max(0, lumVariance))
  const contrast = Math.min(100, (lumStdDev / 64) * 100)
  
  // Saturation (mean, normalized to 0-100)
  const saturation = (satSum / pixelCount) * 100
  
  // Sharpness (use blur detection)
  const blurResult = detectBlur(imageData)
  const sharpness = blurResult.score
  
  // Detect issues
  if (brightness < 20) issues.push('too_dark')
  if (brightness > 90) issues.push('overexposed')
  if (contrast < 15) issues.push('low_contrast')
  if (saturation < 10) issues.push('desaturated')
  if (sharpness < 25) issues.push('blurry')
  
  // Overall score (weighted average)
  const score = Math.round(
    sharpness * 0.35 +      // Sharpness most important
    brightness * 0.20 +     // Good exposure
    contrast * 0.25 +       // Good contrast
    saturation * 0.20       // Vibrant colors
  )
  
  // Penalize for issues
  const penalty = issues.length * 10
  const finalScore = Math.max(0, Math.min(100, score - penalty))
  
  return {
    score: finalScore,
    sharpness: Math.round(sharpness),
    brightness: Math.round(brightness),
    contrast: Math.round(contrast),
    saturation: Math.round(saturation),
    issues
  }
}

// =============================================
// BEST PHOTO PICKS
// =============================================

export interface PhotoScore {
  photoId: string
  score: number
  metrics: QualityResult
}

/**
 * Rank photos by quality and return top N
 */
export function pickBestPhotos(
  photos: { id: string; quality: QualityResult }[],
  count: number = 20
): string[] {
  // Sort by score descending
  const sorted = [...photos].sort((a, b) => b.quality.score - a.quality.score)
  
  // Return top N photo IDs
  return sorted.slice(0, count).map(p => p.id)
}

/**
 * Find photos that are significantly better than duplicates
 */
export function pickBestFromDuplicates(
  groups: { photoId: string; quality: QualityResult }[][]
): string[] {
  return groups.map(group => {
    // Sort group by quality
    const sorted = [...group].sort((a, b) => b.quality.score - a.quality.score)
    return sorted[0].photoId
  })
}

// =============================================
// SCENE DETECTION (Simple rule-based)
// =============================================

export type SceneType = 
  | 'ceremony'
  | 'reception'
  | 'dancing'
  | 'portraits'
  | 'candids'
  | 'food'
  | 'decorations'
  | 'outdoor'
  | 'group'
  | 'unknown'

/**
 * Simple scene detection based on image characteristics
 * (Basic heuristics - real implementation would use ML model)
 */
export function detectScene(imageData: ImageData): SceneType {
  const quality = analyzeQuality(imageData)
  
  // These are placeholder heuristics
  // Real implementation would use a trained model
  
  // High saturation + good lighting = likely decorations or food
  if (quality.saturation > 70 && quality.brightness > 50) {
    return 'decorations'
  }
  
  // Low light + high contrast = might be dancing/reception
  if (quality.brightness < 40 && quality.contrast > 40) {
    return 'dancing'
  }
  
  // Very bright + sharp = likely outdoor/portraits
  if (quality.brightness > 60 && quality.sharpness > 60) {
    return 'outdoor'
  }
  
  return 'unknown'
}

// =============================================
// BATCH PROCESSING
// =============================================

export interface ProcessedPhoto {
  id: string
  blurScore: number
  isBlurry: boolean
  qualityScore: number
  perceptualHash: string
  detectedScene: SceneType
  issues: string[]
}

/**
 * Process a single photo with all local AI features
 */
export function processPhoto(
  photoId: string,
  imageData: ImageData
): ProcessedPhoto {
  const blur = detectBlur(imageData)
  const quality = analyzeQuality(imageData)
  const hash = generatePerceptualHash(imageData)
  const scene = detectScene(imageData)
  
  return {
    id: photoId,
    blurScore: blur.score,
    isBlurry: blur.isBlurry,
    qualityScore: quality.score,
    perceptualHash: hash.hash,
    detectedScene: scene,
    issues: quality.issues
  }
}

/**
 * Find duplicates in a batch of photos
 */
export function findDuplicates(
  photos: { id: string; hash: string }[],
  threshold: number = 5
): { original: string; duplicate: string; distance: number }[] {
  const duplicates: { original: string; duplicate: string; distance: number }[] = []
  
  for (let i = 0; i < photos.length; i++) {
    for (let j = i + 1; j < photos.length; j++) {
      const distance = hammingDistance(photos[i].hash, photos[j].hash)
      if (distance <= threshold) {
        duplicates.push({
          original: photos[i].id,
          duplicate: photos[j].id,
          distance
        })
      }
    }
  }
  
  return duplicates
}
