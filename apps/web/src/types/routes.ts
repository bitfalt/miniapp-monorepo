// Static routes
export type StaticRoutes =
  | "/"
  | "/sign-in"
  | "/register"
  | "/welcome"
  | "/settings"
  | "/achievements"
  | "/test-selection"
  | "/tests/instructions"
  | "/ideology-test"
  | "/insights"
  | "/results"
  | "/awaken-pro"
  | "/leaderboard"
  | "/api-docs";

// Dynamic route patterns
export type DynamicRoutes = 
  | `/register?userId=${string}`
  | `/settings?upgrade=${string}`
  | `/insights?testId=${string}`
  | `/tests/instructions?testId=${string}`
  | `/ideology-test?testId=${string}`;

// Combined routes type
export type AppRoutes = StaticRoutes | DynamicRoutes;

// Augment Next.js types
declare module "next/dist/client/components/navigation" {
  export interface PathnamePrefixPatterns {
    "/": never;
    "/sign-in": never;
    "/register": never;
    "/welcome": never;
    "/settings": never;
    "/achievements": never;
    "/test-selection": never;
    "/tests/instructions": never;
    "/ideology-test": never;
    "/insights": never;
    "/results": never;
    "/awaken-pro": never;
    "/leaderboard": never;
    "/api-docs": never;
    "/register?userId": [userId: string];
    "/settings?upgrade": [upgrade: string];
    "/insights?testId": [testId: string];
    "/tests/instructions?testId": [testId: string];
    "/ideology-test?testId": [testId: string];
  }
} 