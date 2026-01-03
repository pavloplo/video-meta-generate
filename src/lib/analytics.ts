import { API_ENDPOINTS } from '@/constants/api';

type AnalyticsProps = Record<string, unknown>;

declare global {
  interface Window {
    analytics?: {
      track?: (event: string, props?: AnalyticsProps) => void;
    };
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
  }
}

const hasConsent = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return true;
};

export const track = (event: string, props: AnalyticsProps = {}) => {
  if (!hasConsent() || typeof window === "undefined") {
    return;
  }

  if (window.analytics?.track) {
    window.analytics.track(event, props);
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, props);
  }
};

/**
 * GA4 Analytics helpers for client and server-side tracking
 */
export const analytics = {
  /**
   * Get or create a client ID for GA4
   */
  getClientId(): string {
    if (typeof window === 'undefined') return 'server';

    let clientId = localStorage.getItem('ga_client_id');
    if (!clientId) {
      clientId = `${Date.now()}.${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('ga_client_id', clientId);
    }
    return clientId;
  },

  /**
   * Track event via gtag (client-side)
   */
  trackEvent(name: string, params?: Record<string, unknown>) {
    if (typeof window === 'undefined' || !window.gtag) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[GA4 gtag]', name, params);
      }
      return;
    }

    window.gtag('event', name, params);
  },

  /**
   * Track event via server-side Measurement Protocol (fallback for ad blockers)
   */
  async trackEventServer(name: string, params?: Record<string, unknown>) {
    if (typeof window === 'undefined') return;

    try {
      const response = await fetch(API_ENDPOINTS.SYNCH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: this.getClientId(),
          events: [{ name, params }],
        }),
        keepalive: true, // Send even if page is unloading
      });

      if (!response.ok && process.env.NODE_ENV === 'development') {
        console.debug('[GA4 server] Event tracking failed:', response.status);
      }
    } catch (error) {
      // Silently fail - analytics should never break functionality
      if (process.env.NODE_ENV === 'development') {
        console.debug('[GA4 server] Network error:', error);
      }
    }
  },

  /**
   * Track event with both client and server fallbacks
   */
  trackEventReliable(name: string, params?: Record<string, unknown>) {
    // Try gtag first
    this.trackEvent(name, params);
    // Always send server-side as backup
    this.trackEventServer(name, params);
  },

  /**
   * Page view tracking
   */
  pageView(url: string) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
        page_path: url,
      });
    }
    // Also send server-side
    this.trackEventServer('page_view', { page_path: url });
  },

  /**
   * Generation events
   */
  generateStart(type: 'thumbnails' | 'description' | 'tags') {
    this.trackEventReliable('generate_start', { content_type: type });
  },

  generateSuccess(type: 'thumbnails' | 'description' | 'tags', durationMs?: number) {
    const params: Record<string, unknown> = { content_type: type };
    if (durationMs) params.duration_ms = durationMs;
    this.trackEventReliable('generate_success', params);
  },

  generateError(type: 'thumbnails' | 'description' | 'tags', errorMessage: string) {
    this.trackEventReliable('generate_error', {
      content_type: type,
      error_message: errorMessage,
    });
  },

  /**
   * Upload events
   */
  uploadStart(fileType: 'video' | 'image') {
    this.trackEventReliable('upload_start', { file_type: fileType });
  },

  uploadComplete(fileType: 'video' | 'image', fileSize: number) {
    this.trackEventReliable('upload_complete', {
      file_type: fileType,
      file_size: fileSize,
    });
  },

  uploadError(fileType: 'video' | 'image', errorMessage: string) {
    this.trackEventReliable('upload_error', {
      file_type: fileType,
      error_message: errorMessage,
    });
  },

  /**
   * UI interaction events
   */
  thumbnailSelect(variantIndex: number) {
    this.trackEventReliable('thumbnail_select', { variant_index: variantIndex });
  },

  regenerateClick() {
    this.trackEventReliable('regenerate_click');
  },

  copyDescription() {
    this.trackEventReliable('copy_description');
  },

  copyTags() {
    this.trackEventReliable('copy_tags');
  },
};
