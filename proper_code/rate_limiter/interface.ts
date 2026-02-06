

interface RateLimitingStratergy {
  // constructor(a: number, b: number): void;
  isRequestAllowed(uid: string, apiUrl: string): boolean;
}