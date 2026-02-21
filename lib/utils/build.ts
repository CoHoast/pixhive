// Check if we're in build/prerender mode
export function isBuildTime(): boolean {
  // During next build, there's no real runtime context
  // Check for missing or placeholder env vars
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !url || url.includes('placeholder') || url === ''
}
