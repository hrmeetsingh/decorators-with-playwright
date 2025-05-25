// Interface for decorator context
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
