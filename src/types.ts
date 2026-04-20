export interface ModelQuota {
  id: string;
  provider: string;
  model: string;
  useCase: string;
  totalQuota: number;
  usedQuota: number; // Mapping used to usedQuota in blueprint
  used: number; // Keep for convenience or use usedQuota
  costPer1k: number;
  status: 'Healthy' | 'Warning' | 'Exhausted';
  ownerEmail: string;
  lastUpdated?: string;
}

export interface UsageLog {
  timestamp: string;
  tokens: number;
  cost: number;
  model: string;
  useCase: string;
}

export interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  savings: string;
  action: string;
  savingsPercent?: number; // 0-100 for visual scale
  impact?: 'low' | 'medium' | 'high';
}
