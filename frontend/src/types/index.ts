export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'ADMIN';
  subscriptionTier: 'FREE' | 'BASIC' | 'PRO' | 'UNLIMITED';
  creditsRemaining: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Logo {
  id: string;
  userId: string;
  filename: string;
  originalUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  mimeType: string;
  aiAnalysis?: {
    style: string;
    complexity: number;
    hasText: boolean;
    recommendedCategories: string[];
    dominantColors: string[];
    colors: ColorInfo[];
    placement: {
      preferredPosition: string;
      scaleRange: [number, number];
      rotationTolerance: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface ColorInfo {
  name: string;
  hex: string;
  rgb: number[];
  population: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  isPremium: boolean;
  tags: string[];
  placeholderAreas: PlaceholderArea[];
  createdAt: string;
  updatedAt: string;
}

export interface PlaceholderArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  blendMode?: string;
}

export interface Mockup {
  id: string;
  userId: string;
  logoId: string;
  templateId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  renderUrl?: string;
  thumbnailUrl?: string;
  customizations?: MockupCustomizations;
  processingTime?: number;
  createdAt: string;
  updatedAt: string;
  logo?: Logo;
  template?: Template;
}

export interface MockupCustomizations {
  position?: { x: number; y: number };
  scale?: number;
  rotation?: number;
  opacity?: number;
  blendMode?: string;
  tint?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: 'FREE' | 'BASIC' | 'PRO' | 'UNLIMITED';
  status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE';
  stripeSubscriptionId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface SocketEvents {
  'mockup-queued': { mockupId: string };
  'mockup-processing': { mockupId: string; progress?: number };
  'mockup-completed': { mockupId: string; renderUrl: string; thumbnailUrl: string };
  'mockup-failed': { mockupId: string; error: string };
  'credit-updated': { creditsRemaining: number };
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  templateCount: number;
}

export interface PricingPlan {
  tier: 'FREE' | 'BASIC' | 'PRO' | 'UNLIMITED';
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
  stripePriceId?: string;
}
