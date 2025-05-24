// Interface for decorator context (used in apply*Config helpers)
export interface DecoratorContext {
  kind: 'method' | string;
  name?: string;
  metadata: any,
  addInitializer: [Function],
  static: boolean,
  private: boolean,
  access: { 
    has: [Function], 
    get: [Function] 
  }
}
