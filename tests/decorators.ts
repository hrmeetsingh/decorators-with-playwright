import { test as baseTest } from '@playwright/test';
import { DEVICE_CONFIGS } from '../configs/device-configs';

// Metadata for tests
const testMetadata = new Map<Function, {
  deviceConfig?: any;
  shouldSkip?: boolean;
}>();


export function mobile(...args: any[]): any {
  if (args.length === 2) {
    const [target, context] = args;
    return applyMobileConfig(target, context);
  }
  
  console.error('Mobile decorator called with unexpected arguments:', args);
  throw new Error(`Mobile decorator called with ${args.length} arguments. Expected 2.`);
}

export function desktop(...args: any[]): any {
  if (args.length === 2) {
    const [target, context] = args;
    return applyDesktopConfig(target, context);
  }
  
  console.error('Desktop decorator called with unexpected arguments:', args);
  throw new Error(`Desktop decorator called with ${args.length} arguments. Expected 2.`);
}

export function skip(...args: any[]): any {

  if (args.length === 2) {
    const [target, context] = args;
    return applySkipConfig(target, context);
  }
  
  console.error('Skip decorator called with unexpected arguments:', args);
  throw new Error(`Skip decorator called with ${args.length} arguments. Expected 2.`);
}

function applyMobileConfig(target: Function, context: any): Function {
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

function applyDesktopConfig(target: Function, context: any): Function {
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

function applySkipConfig(target: Function, context: any): Function {
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

export function createConfiguredTest(testFn: Function, testName: string) {
  const metadata = testMetadata.get(testFn);
  
  if (metadata?.shouldSkip) {
    return baseTest.skip(testName, async ({ page, context, browser }) => {
      await testFn({ page, context, browser });
    });
  }
  
  if (metadata?.deviceConfig) {
    return baseTest(testName, async ({ browser }) => {
      // Create new context with device configuration
      const context = await browser.newContext({
        ...metadata.deviceConfig,
        viewport: metadata.deviceConfig.viewport
      });
      
      const page = await context.newPage();
      
      try {
        // Call the original test function with configured page
        await testFn({ page, context, browser });
      } finally {
        await context.close();
      }
    });
  }
  
  // Default test without special configuration - fallback to default Playwright configuration
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
    
    const metadata = testMetadata.get(method);
    createConfiguredTest(method, testName);
  });
}