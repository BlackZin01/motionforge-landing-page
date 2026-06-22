export type Plan = 'free' | 'starter' | 'pro' | 'agency'

const PLAN_LIMITS: Record<Plan, { buscas: number; curadoria: boolean; unlimited: boolean }> = {
  free:    { buscas: 5,   curadoria: false, unlimited: false },
  starter: { buscas: 50,  curadoria: false, unlimited: false },
  pro:     { buscas: 200, curadoria: true,  unlimited: false },
  agency:  { buscas: 999, curadoria: true,  unlimited: true  },
}

export function canUseCuradoria(plan: Plan): boolean {
  return PLAN_LIMITS[plan]?.curadoria ?? false
}

export function getBuscasLimit(plan: Plan): number {
  return PLAN_LIMITS[plan]?.buscas ?? 5
}

export function isUnlimited(plan: Plan): boolean {
  return PLAN_LIMITS[plan]?.unlimited ?? false
}

export function hasActivePlan(plan: Plan, status: string): boolean {
  return plan !== 'free' && status === 'active'
}
