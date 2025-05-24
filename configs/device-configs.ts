import { devices } from '@playwright/test';

export const DEVICE_CONFIGS = {
    mobile: {
      ...devices['iPhone 13'],
      viewport: { width: 375, height: 667 },
      isMobile: true,
      hasTouch: true
    },
    desktop: {
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      isMobile: false,
      hasTouch: false
    }
  };