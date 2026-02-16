// @ts-nocheck
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// =============================================
// PARTNER CRUD
// =============================================

export async function createPartner(data: {
  companyName: string
  email: string
  password: string
  fullName: string
}) {
  const supabase = createServerClient()

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
    },
  })

  if (authError || !authData.user) {
    return { error: authError?.message || 'Failed to create account' }
  }

  // 2. Generate slug from company name
  const baseSlug = data.companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  // 3. Create partner record
  const { data: partner, error: partnerError } = await supabase
    .from('partners')
    .insert({
      user_id: authData.user.id,
      company_name: data.companyName,
      slug: baseSlug,
      email: data.email,
    })
    .select()
    .single()

  if (partnerError) {
    return { error: partnerError.message }
  }

  return { partner }
}

export async function getPartner() {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: partner, error } = await supabase
    .from('partners')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    return { error: error.message }
  }

  return { partner }
}

export async function updatePartner(data: {
  companyName?: string
  phone?: string
  website?: string
  logoUrl?: string
  logoDarkUrl?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  fontFamily?: string
  customDomain?: string
  settings?: Record<string, any>
  onboardingCompleted?: boolean
}) {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const updateData: Record<string, any> = {}
  
  if (data.companyName) updateData.company_name = data.companyName
  if (data.phone) updateData.phone = data.phone
  if (data.website) updateData.website = data.website
  if (data.logoUrl) updateData.logo_url = data.logoUrl
  if (data.logoDarkUrl) updateData.logo_dark_url = data.logoDarkUrl
  if (data.primaryColor) updateData.primary_color = data.primaryColor
  if (data.secondaryColor) updateData.secondary_color = data.secondaryColor
  if (data.accentColor) updateData.accent_color = data.accentColor
  if (data.fontFamily) updateData.font_family = data.fontFamily
  if (data.customDomain) updateData.custom_domain = data.customDomain
  if (data.settings) updateData.settings = data.settings
  if (data.onboardingCompleted !== undefined) updateData.onboarding_completed = data.onboardingCompleted
  
  updateData.updated_at = new Date().toISOString()

  const { data: partner, error } = await supabase
    .from('partners')
    .update(updateData)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/partner-dashboard')
  return { partner }
}

// =============================================
// PARTNER CLIENTS
// =============================================

export async function getPartnerClients() {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', clients: [] }

  // Get partner ID
  const { data: partner } = await supabase
    .from('partners')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!partner) return { error: 'Partner not found', clients: [] }

  const { data: clients, error } = await supabase
    .from('partner_clients')
    .select('*')
    .eq('partner_id', partner.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message, clients: [] }
  }

  return { clients }
}

export async function createPartnerClient(data: {
  name: string
  email?: string
  phone?: string
  notes?: string
}) {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get partner ID
  const { data: partner } = await supabase
    .from('partners')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!partner) return { error: 'Partner not found' }

  const { data: client, error } = await supabase
    .from('partner_clients')
    .insert({
      partner_id: partner.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      notes: data.notes,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/partner-dashboard/clients')
  return { client }
}

export async function updatePartnerClient(
  clientId: string,
  data: {
    name?: string
    email?: string
    phone?: string
    notes?: string
  }
) {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify ownership
  const { data: partner } = await supabase
    .from('partners')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!partner) return { error: 'Partner not found' }

  const { data: client, error } = await supabase
    .from('partner_clients')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', clientId)
    .eq('partner_id', partner.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/partner-dashboard/clients')
  return { client }
}

export async function deletePartnerClient(clientId: string) {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify ownership
  const { data: partner } = await supabase
    .from('partners')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!partner) return { error: 'Partner not found' }

  const { error } = await supabase
    .from('partner_clients')
    .delete()
    .eq('id', clientId)
    .eq('partner_id', partner.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/partner-dashboard/clients')
  return { success: true }
}

// =============================================
// PARTNER EVENTS
// =============================================

export async function getPartnerEvents() {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', events: [] }

  // Get partner ID
  const { data: partner } = await supabase
    .from('partners')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!partner) return { error: 'Partner not found', events: [] }

  const { data: events, error } = await supabase
    .from('events')
    .select(`
      *,
      partner_clients (
        id,
        name
      )
    `)
    .eq('partner_id', partner.id)
    .order('event_date', { ascending: false })

  if (error) {
    return { error: error.message, events: [] }
  }

  return { events }
}

export async function createPartnerEvent(data: {
  name: string
  clientId?: string
  eventDate?: string
  description?: string
  aiFeatures?: { core: boolean; faceDetection: boolean }
}) {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get partner ID
  const { data: partner } = await supabase
    .from('partners')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!partner) return { error: 'Partner not found' }

  // Generate slug
  const baseSlug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const { data: event, error } = await supabase
    .from('events')
    .insert({
      user_id: user.id,
      partner_id: partner.id,
      partner_client_id: data.clientId,
      name: data.name,
      slug: baseSlug + '-' + Date.now().toString(36),
      event_date: data.eventDate,
      description: data.description,
      ai_features: data.aiFeatures || { core: false, face_detection: false },
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/partner-dashboard/events')
  return { event }
}

// =============================================
// AI USAGE TRACKING
// =============================================

export async function getPartnerAiUsage(month?: string) {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated', usage: [] }

  // Get partner ID
  const { data: partner } = await supabase
    .from('partners')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!partner) return { error: 'Partner not found', usage: [] }

  let query = supabase
    .from('partner_ai_usage')
    .select(`
      *,
      events (
        name
      )
    `)
    .eq('partner_id', partner.id)
    .order('created_at', { ascending: false })

  if (month) {
    const startDate = new Date(month + '-01')
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
    query = query
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
  }

  const { data: usage, error } = await query

  if (error) {
    return { error: error.message, usage: [] }
  }

  return { usage }
}

export async function recordAiUsage(data: {
  eventId: string
  aiType: 'core' | 'face_detection'
  photoCount: number
}) {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Get partner ID
  const { data: partner } = await supabase
    .from('partners')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!partner) return { error: 'Partner not found' }

  // Calculate cost based on photo count
  const costCents = calculateAiCost(data.aiType, data.photoCount)

  const { data: usage, error } = await supabase
    .from('partner_ai_usage')
    .insert({
      partner_id: partner.id,
      event_id: data.eventId,
      ai_type: data.aiType,
      photo_count: data.photoCount,
      cost_cents: costCents,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { usage }
}

// Helper: Calculate AI cost based on photo count
function calculateAiCost(aiType: 'core' | 'face_detection', photoCount: number): number {
  // Pricing tiers (in cents)
  const CORE_PRICING = [
    { max: 250, price: 2900 },   // $29
    { max: 500, price: 4900 },   // $49
    { max: 2000, price: 9900 },  // $99
    { max: Infinity, price: 14900 }, // $149
  ]

  const FACE_PRICING = [
    { max: 250, price: 7900 },   // $79
    { max: 500, price: 14900 },  // $149
    { max: 2000, price: 34900 }, // $349
    { max: Infinity, price: 49900 }, // $499
  ]

  const pricing = aiType === 'core' ? CORE_PRICING : FACE_PRICING

  for (const tier of pricing) {
    if (photoCount <= tier.max) {
      return tier.price
    }
  }

  return pricing[pricing.length - 1].price
}

// =============================================
// DOMAIN VERIFICATION
// =============================================

export async function verifyCustomDomain(domain: string) {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // In production, this would check DNS records
  // For now, we'll simulate verification
  
  // Generate verification token if not exists
  const verificationToken = 'pixhive-verify-' + Math.random().toString(36).substring(2, 15)

  const { error } = await supabase
    .from('partners')
    .update({
      custom_domain: domain,
      domain_verification_token: verificationToken,
      domain_verified: false,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  return { 
    verificationToken,
    instructions: `Add a TXT record to your DNS:\nName: _pixhive-verify\nValue: ${verificationToken}`,
  }
}

export async function checkDomainVerification() {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: partner } = await supabase
    .from('partners')
    .select('custom_domain, domain_verification_token')
    .eq('user_id', user.id)
    .single()

  if (!partner?.custom_domain) {
    return { error: 'No custom domain configured' }
  }

  // In production, this would actually check DNS
  // For now, simulate successful verification after token is set
  const verified = !!partner.domain_verification_token

  if (verified) {
    await supabase
      .from('partners')
      .update({
        domain_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
  }

  revalidatePath('/partner-dashboard/branding')
  return { verified }
}
