import { test as baseTest, devices } from '@playwright/test';

// Device configurations
const DEVICE_CONFIGS = {
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

// Metadata storage for test configurations
const testMetadata = new Map<Function, {
  deviceConfig?: any;
  shouldSkip?: boolean;
}>();


// Mobile decorator with comprehensive debugging
export function mobile(...args: any[]): any {
  if (args.length === 2) {
    const [target, context] = args;
    return applyMobileConfig(target, context);
  }
  
  console.error('Mobile decorator called with unexpected arguments:', args);
  throw new Error(`Mobile decorator called with ${args.length} arguments. Expected 2.`);
}

// Desktop decorator with comprehensive debugging
export function desktop(...args: any[]): any {
  if (args.length === 2) {
    const [target, context] = args;
    return applyDesktopConfig(target, context);
  }
  
  console.error('Desktop decorator called with unexpected arguments:', args);
  throw new Error(`Desktop decorator called with ${args.length} arguments. Expected 2.`);
}

// Skip decorator with comprehensive debugging
export function skip(...args: any[]): any {

  if (args.length === 2) {
    const [target, context] = args;
    return applySkipConfig(target, context);
  }
  
  console.error('Skip decorator called with unexpected arguments:', args);
  throw new Error(`Skip decorator called with ${args.length} arguments. Expected 2.`);
}

// Helper functions to apply configurations
function applyMobileConfig(target: any, context: any): Function {
  if (context.kind !== 'method') {
    throw new Error('Mobile decorator can only be applied to methods');
  }
  
  const originalMethod = target;
  testMetadata.set(originalMethod, {
    ...testMetadata.get(originalMethod),
    deviceConfig: DEVICE_CONFIGS.mobile
  });
  
  console.log(`✓ Applied mobile config to method: ${context.name}`);
  return target;
}

function applyDesktopConfig(target: any, context: any): Function {
  if (context.kind !== 'method')  {
    throw new Error('Desktop decorator can only be applied to methods');
  }
  
  const originalMethod = target;
  testMetadata.set(originalMethod, {
    ...testMetadata.get(originalMethod),
    deviceConfig: DEVICE_CONFIGS.desktop
  });
  
  console.log(`✓ Applied desktop config to method: ${context.name}`);
  return target;
}

function applySkipConfig(target: any, context: any): Function {
  if (context.kind !== 'method') {
    throw new Error('Skip decorator can only be applied to methods');
  }
  
  const originalMethod = target;
  testMetadata.set(originalMethod, {
    ...testMetadata.get(originalMethod),
    shouldSkip: true
  });
  
  console.log(`✓ Applied skip config to method: ${context.name}`);
  return target;
}

// Enhanced test function that applies configurations
export function createConfiguredTest(testFn: Function, testName: string) {
  const metadata = testMetadata.get(testFn);
  
  if (metadata?.shouldSkip) {
    return baseTest.skip(testName, async ({ page, context, browser }) => {
      // This won't run, but we need the signature for TypeScript
      await testFn({ page, context, browser });
    });
  }
  
  if (metadata?.deviceConfig) {
    return baseTest(testName, async ({ browser }) => {
      // Create new context with device configuration
      const context = await browser.newContext({
        ...metadata.deviceConfig,
        // Ensure viewport is properly set
        viewport: metadata.deviceConfig.viewport
      });
      
      const page = await context.newPage();
      
      // Debug: Log the actual viewport size
      // console.log(`Test "${testName}" - Expected viewport:`, metadata.deviceConfig.viewport);
      // console.log(`Test "${testName}" - Actual viewport:`, page.viewportSize());
      
      try {
        // Call the original test function with configured page
        await testFn({ page, context, browser });
      } finally {
        await context.close();
      }
    });
  }
  
  // Default test without special configuration - use standard Playwright fixtures
  return baseTest(testName, async ({ page, context, browser }) => {
    console.log(`Test "${testName}" - Default viewport:`, page.viewportSize());
    await testFn({ page, context, browser });
  });
}

// Helper function to register tests from a class
export function registerTests(testClass: any) {
  const instance = new testClass();
  const prototype = Object.getPrototypeOf(instance);
  const methodNames = Object.getOwnPropertyNames(prototype)
    .filter(name => name !== 'constructor' && typeof prototype[name] === 'function');
  
  methodNames.forEach(methodName => {
    const method = prototype[methodName];
    const testName = methodName.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
    
    // Debug: Check if metadata exists
    const metadata = testMetadata.get(method);
    // console.log(`Registering test "${testName}":`, metadata ? 'Has metadata' : 'No metadata');
    // if (metadata?.deviceConfig) {
    //   console.log('Device config:', metadata.deviceConfig.viewport);
    // }
    
    createConfiguredTest(method, testName);
  });
}