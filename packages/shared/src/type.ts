export type PlanType = 'free' | 'pro' | 'enterprise';
export type TimeRange = '12h' | '24h' | '7d' | '30d';

export interface ApiResponse<T = null> {
  success: boolean
  message: string
  data: T | null
  error: string | null
}