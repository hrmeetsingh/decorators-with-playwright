import { test as baseTest } from '@playwright/test';
import { DecoratorContext } from './decorator-context.interface';
import { DEVICE_CONFIGS } from '../configs/device-configs';
import { LOCATION_CONFIGS } from '../configs/location-configs';

// Metadata for tests
const testMetadata = new Map<Function, {
  deviceConfig?: any;
  locationConfig?: any;
  shouldSkip?: boolean;
}>();


// Viewport decorators
export function mobile(target: Function, context: DecoratorContext): Function {
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

export function desktop(target: Function, context: DecoratorContext): Function {
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

// Test skipping decorators
export function skip(target: Function, context: DecoratorContext): Function {
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

// Geolocation decorators 
export function london(target: Function, context: DecoratorContext): Function {
  if (context.kind !== 'method') {
    throw new Error('London decorator can only be applied to methods');
  }
  
  const originalMethod = target;
  testMetadata.set(originalMethod, {
    ...testMetadata.get(originalMethod),
    locationConfig: LOCATION_CONFIGS.london
  });
  
  console.log(`✓ Applied London location config to method: ${context.name}`);
  return target;
}

export function newyork(target: Function, context: DecoratorContext): Function {
  if (context.kind !== 'method') {
    throw new Error('New York decorator can only be applied to methods');
  }
  
  const originalMethod = target;
  testMetadata.set(originalMethod, {
    ...testMetadata.get(originalMethod),
    locationConfig: LOCATION_CONFIGS.newyork
  });
  
  console.log(`✓ Applied New York location config to method: ${context.name}`);
  return target;
}
  

// Internal helper functions
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

  if (metadata?.locationConfig) {
    return baseTest(testName, async ({ browser }) => {
      // Create new context with location configuration
      const context = await browser.newContext({
        ...metadata.locationConfig,
        geolocation: metadata.locationConfig,
        permissions: ['geolocation']
      });
      
      const page = await context.newPage();
      
      try {
        await testFn({ page, context, browser });
      } finally {
        await context.close();
        await page.close();
      }
    });
  }
  
  // Default test without special configuration - fallback to default Playwright configuration
  return baseTest(testName, async ({ page, context, browser }) => {
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
    
    createConfiguredTest(method, testName);
  });
}